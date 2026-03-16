import os
import json
import re
import boto3
from botocore.config import Config
from dotenv import load_dotenv
import prompts
import random
import uuid
from faker import Faker
from schemas import CompanyProfile, DemographicMap, PersonaArchetypeList, Persona, PersonaReaction, DiagnosticReport, BaselineContext, StrategicPlan
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans

fake = Faker()

load_dotenv()

if os.getenv("BEDROCK_API_KEY"):
    os.environ["AWS_BEARER_TOKEN_BEDROCK"] = os.getenv("BEDROCK_API_KEY")

bedrock = boto3.client(
    "bedrock-runtime",
    region_name=os.getenv("AWS_REGION", "us-east-1"),
    config=Config(read_timeout=3600)
)


def extract_nested_payload(node: dict | list, expected_keys: set) -> dict | None:
    """
    Recursively hunts through a JSON object of any depth to find the dictionary 
    that contains the target keys, ignoring arbitrary LLM wrapper keys.
    """
    if isinstance(node, dict):
        # If we find the expected keys in this dictionary, this is our payload
        if any(key in node for key in expected_keys):
            return node
        
        # Otherwise, keep digging into its values
        for value in node.values():
            result = extract_nested_payload(value, expected_keys)
            if result:
                return result
                
    elif isinstance(node, list):
        # If it's a list, check every item inside it
        for item in node:
            result = extract_nested_payload(item, expected_keys)
            if result:
                return result
                
    return None


def robust_company_profile_parse(text: str) -> dict:
    match = re.search(r'\{[\s\S]*\}', text)
    if match:
        try: return json.loads(match.group(0))
        except json.JSONDecodeError: pass
        
    def extract_str(key):
        m = re.search(f'"{key}"\\s*:\\s*"([^"]+)"', text)
        return m.group(1).strip() if m else "Information not available."

    def extract_list(key):
        m = re.search(f'"{key}"\\s*:\\s*\\[([^\\]]*)\\]', text)
        if m:
            items = re.findall(r'"([^"]+)"', m.group(1))
            return [item.strip() for item in items] if items else ["Information not available."]
        return []

    return {
        "company_name": extract_str("company_name"),
        "product_description": extract_str("product_description"),
        "list_of_products": extract_list("list_of_products"),
        "target_audience": extract_str("target_audience"),
        "pricing_model": extract_str("pricing_model"),
        "key_competitors": extract_list("key_competitors"),
        "market_position": extract_str("market_position"),
        "unique_value_proposition": extract_str("unique_value_proposition"),
        "core_pain_points_solved": extract_list("core_pain_points_solved")
    }


def fetch_company_profile(company_name: str) -> CompanyProfile | str:
    print(f"Fetching profile for: {company_name}...")
    prompt_text = prompts.COMPANY_PROFILE_PROMPT.format(company_name=company_name)
    tool_config = {"tools": [{"systemTool": {"name": "nova_grounding"}}]}
    
    try:
        response = bedrock.converse(
            modelId="us.amazon.nova-2-lite-v1:0",
            messages=[{"role": "user", "content": [{"text": prompt_text}]}],
            toolConfig=tool_config
        )
        
        output_text = "".join([c.get("text", "") for c in response["output"]["message"]["content"]])
        if "NOT_FOUND" in output_text.strip(): return "NOT_FOUND"
            
        parsed_json = robust_company_profile_parse(output_text)
        try: return CompanyProfile(**parsed_json)
        except Exception as e:
            print(f"Profile Pydantic validation failed: {e}")
            return "NOT_FOUND"
    except Exception as e:
        print(f"Error during Bedrock call: {e}")
        return "NOT_FOUND"


def robust_demographic_map_parse(text: str) -> dict:
    match = re.search(r'\{[\s\S]*\}', text)
    if match:
        try: return json.loads(match.group(0))
        except json.JSONDecodeError: pass
        
    def extract_str(key):
        m = re.search(f'"{key}"\\s*:\\s*"([^"]+)"', text)
        return m.group(1).strip() if m else "Information not available."

    def extract_list(key):
        m = re.search(f'"{key}"\\s*:\\s*\\[([^\\]]*)\\]', text)
        if m:
            items = re.findall(r'"([^"]+)"', m.group(1))
            return [item.strip() for item in items] if items else ["Information not available."]
        return []

    return {
        "age_distribution": extract_str("age_distribution"),
        "income_distribution": extract_str("income_distribution"),
        "geographic_trends": extract_str("geographic_trends"),
        "behavioral_segments": extract_list("behavioral_segments"),
        "price_sensitivity": extract_str("price_sensitivity")
    }


def fetch_demographic_map(company_name: str) -> DemographicMap | str:
    """Uses nova_grounding to fetch real-world demographic data for a company."""
    print(f"Fetching demographic map for: {company_name}...")
    prompt_text = prompts.DEMOGRAPHIC_RESEARCH_PROMPT.format(company_name=company_name)
    tool_config = {"tools": [{"systemTool": {"name": "nova_grounding"}}]}
    
    try:
        response = bedrock.converse(
            modelId="us.amazon.nova-2-lite-v1:0",
            messages=[{"role": "user", "content": [{"text": prompt_text}]}],
            toolConfig=tool_config
        )
        
        output_text = "".join([c.get("text", "") for c in response["output"]["message"]["content"]])
        if "NOT_FOUND" in output_text.strip(): return "NOT_FOUND"
            
        parsed_json = robust_demographic_map_parse(output_text)
        try: return DemographicMap(**parsed_json)
        except Exception as e:
            print(f"Demographic Pydantic validation failed: {e}")
            return "NOT_FOUND"
    except Exception as e:
        print(f"Error during Bedrock call: {e}")
        return "NOT_FOUND"


def robust_archetype_parse(text: str) -> PersonaArchetypeList | None:
    # Strip Markdown formatting
    clean_text = re.sub(r'^```json\s*', '', text, flags=re.MULTILINE)
    clean_text = re.sub(r'^```\s*', '', clean_text, flags=re.MULTILINE)

    # 1. First, try the standard JSON extraction
    match = re.search(r'\{[\s\S]*\}', clean_text)
    if match:
        try:
            data = json.loads(match.group(0))
            return PersonaArchetypeList(**data)
        except json.JSONDecodeError:
            pass

    # 2. Hardcore Regex Fallback
    archetypes_data = []
    array_match = re.search(r'"archetypes"\s*:\s*\[([\s\S]*)\]', clean_text)
    if not array_match:
        print("Failed to find 'archetypes' array in text.")
        return None
        
    array_content = array_match.group(1)
    object_blocks = re.findall(r'\{([^{}]*?)\}', array_content, re.DOTALL)
    
    for block in object_blocks:
        def extract_str(key, default="Information not available"):
            m = re.search(f'"{key}"\\s*:\\s*"([^"]+)"', block)
            return m.group(1).strip() if m else default

        def extract_int(key, default=0):
            m = re.search(f'"{key}"\\s*:\\s*(\\d+)', block)
            return int(m.group(1)) if m else default

        def extract_list(key):
            m = re.search(f'"{key}"\\s*:\\s*\\[([^\\]]*)\\]', block)
            if m:
                items = re.findall(r'"([^"]+)"', m.group(1))
                return [item.strip() for item in items]
            return []

        name = extract_str("archetype_name")
        if name == "Information not available":
            continue

        archetypes_data.append({
            "archetype_name": name,
            "weight_percentage": extract_int("weight_percentage", 10),
            "min_age": extract_int("min_age", 18),
            "max_age": extract_int("max_age", 35),
            "min_income": extract_int("min_income", 30000),
            "max_income": extract_int("max_income", 80000),
            "category_familiarity": extract_str("category_familiarity"),
            "price_sensitivity": extract_str("price_sensitivity"),
            "customer_status": extract_str("customer_status"),
            "core_pain_points": extract_list("core_pain_points")
        })

    if archetypes_data:
        try:
            return PersonaArchetypeList(archetypes=archetypes_data)
        except Exception as e:
            print(f"Failed to instantiate PersonaArchetypeList from regex: {e}")
            return None
            
    return None


def generate_persona_archetypes(company_profile: CompanyProfile, demographic_map: DemographicMap, scenario: str) -> PersonaArchetypeList | None:
    print("Generating Persona Archetypes based on Demographic Map...")
    
    prompt_text = prompts.ARCHETYPE_GENERATION_PROMPT.format(
        company_profile_json=company_profile.model_dump_json(indent=2),
        demographic_map_json=demographic_map.model_dump_json(indent=2),
        scenario=scenario
    )
    
    try:
        response = bedrock.converse(
            modelId="us.amazon.nova-2-lite-v1:0",
            messages=[{"role": "user", "content": [{"text": prompt_text}]}]
        )
        
        for block in response["output"]["message"]["content"]:
            if "text" in block:
                parsed = robust_archetype_parse(block["text"])
                if parsed:
                    return parsed
                    
        return None
        
    except Exception as e:
        print(f"Error during Archetype generation: {e}")
        return None    


def spawn_personas(archetype_list: PersonaArchetypeList, total_count: int) -> list[Persona]:
    print(f"Spawning {total_count} generalized personas...")
    personas = []
    
    counts = [int((arch.weight_percentage / 100.0) * total_count) for arch in archetype_list.archetypes]
    while sum(counts) < total_count: counts[counts.index(max(counts))] += 1
    while sum(counts) > total_count: counts[counts.index(max(counts))] -= 1
        
    for i, arch in enumerate(archetype_list.archetypes):
        for _ in range(counts[i]):
            personas.append(Persona(
                persona_id=str(uuid.uuid4()),
                name=fake.name(),
                age=random.randint(arch.min_age, arch.max_age),
                income=random.randint(arch.min_income, arch.max_income),
                location=fake.city(),
                archetype_name=arch.archetype_name,
                category_familiarity=arch.category_familiarity,
                price_sensitivity=arch.price_sensitivity,
                customer_status=arch.customer_status,
                core_pain_points=arch.core_pain_points
            ))
            
    random.shuffle(personas)
    return personas


def robust_reaction_parse(text: str) -> dict | None:
    clean_text = re.sub(r'^```json\s*', '', text, flags=re.MULTILINE)
    clean_text = re.sub(r'^```\s*', '', clean_text, flags=re.MULTILINE)
    
    # def normalize_payload(p):
    #     if "sentiment" in p and isinstance(p["sentiment"], str):
    #         p["sentiment"] = p["sentiment"].lower()
    #     if "behavioral_prediction" in p and isinstance(p["behavioral_prediction"], str):
    #         p["behavioral_prediction"] = p["behavioral_prediction"].lower()
    #     return p

    def normalize_payload(p):
        if "sentiment" in p and isinstance(p["sentiment"], str):
            p["sentiment"] = p["sentiment"].strip().lower()
        if "behavioral_prediction" in p and isinstance(p["behavioral_prediction"], str):
            p["behavioral_prediction"] = p["behavioral_prediction"].strip().lower().replace(" ", "_")
        return p

    match = re.search(r'\{[\s\S]*\}', clean_text)
    if match:
        try:
            data = json.loads(match.group(0))
            payload = extract_nested_payload(data, {"persona_name", "sentiment", "behavioral_prediction"})
            if payload: 
                return normalize_payload(payload)
        except json.JSONDecodeError:
            pass

    def extract_str(key, default=""):
        m = re.search(f'"{key}"\\s*:\\s*"([^"]+)"', clean_text)
        return m.group(1).strip() if m else default

    def extract_float(key, default=0.0):
        m = re.search(f'"{key}"\\s*:\\s*([0-9.-]+)', clean_text)
        return float(m.group(1)) if m else default

    payload = {
        "persona_name": extract_str("persona_name", "Unknown"),
        "sentiment": extract_str("sentiment", "neutral"),
        "sentiment_score": extract_float("sentiment_score", 0.0),
        "behavioral_prediction": extract_str("behavioral_prediction", "maintain"),
        "reasoning": extract_str("reasoning", "No reasoning provided."),
        "key_concern": extract_str("key_concern", "None"),
        "willingness_to_pay": extract_float("willingness_to_pay", 0.0),
        "likelihood_to_recommend": int(extract_float("likelihood_to_recommend", 5))
    }
    
    if payload["persona_name"] == "Unknown" and payload["reasoning"] == "No reasoning provided.":
        return None
        
    return normalize_payload(payload)


def robust_diagnostic_parse(text: str) -> dict | None:
    clean_text = re.sub(r'^```json\s*', '', text, flags=re.MULTILINE)
    clean_text = re.sub(r'^```\s*', '', clean_text, flags=re.MULTILINE)
    
    def normalize_payload(p):
        if "segment_classifications" in p and isinstance(p["segment_classifications"], list):
            for seg in p["segment_classifications"]:
                if "status" in seg and isinstance(seg["status"], str):
                    seg["status"] = seg["status"].lower()
        return p

    match = re.search(r'\{[\s\S]*\}', clean_text)
    if match:
        try:
            data = json.loads(match.group(0))
            payload = extract_nested_payload(data, {"situation_assessment", "headline_findings", "segment_classifications"})
            if payload: 
                return normalize_payload(payload)
        except json.JSONDecodeError:
            pass

    def extract_str(key, default=""):
        m = re.search(f'"{key}"\\s*:\\s*"([^"]+)"', clean_text)
        return m.group(1).strip() if m else default

    def extract_list(key):
        m = re.search(f'"{key}"\\s*:\\s*\\[([^\\]]*)\\]', clean_text)
        if m:
            return [item.strip() for item in re.findall(r'"([^"]+)"', m.group(1))]
        return []

    segment_classifications = []
    seg_match = re.search(r'"segment_classifications"\s*:\s*\[([\s\S]*?)\]', clean_text)
    if seg_match:
        blocks = re.findall(r'\{([^{}]*?)\}', seg_match.group(1))
        for b in blocks:
            s_name = re.search(r'"segment_name"\s*:\s*"([^"]+)"', b)
            status = re.search(r'"status"\s*:\s*"([^"]+)"', b)
            headline = re.search(r'"headline"\s*:\s*"([^"]+)"', b)
            segment_classifications.append({
                "segment_name": s_name.group(1) if s_name else "Unknown",
                "status": status.group(1).lower() if status else "neutral",
                "headline": headline.group(1) if headline else ""
            })

    payload = {
        "situation_assessment": extract_str("situation_assessment", "Assessment not available."),
        "headline_findings": extract_list("headline_findings"),
        "segment_classifications": segment_classifications
    }
    
    if payload["situation_assessment"] == "Assessment not available." and not payload["headline_findings"]:
        return None
        
    return normalize_payload(payload)


def simulate_single_persona(persona: Persona, company_profile: CompanyProfile, scenario: str) -> tuple[PersonaReaction | None, dict]:
    prompt_text = prompts.SIMULATION_ENGINE_PROMPT.format(
        persona_json=persona.model_dump_json(indent=2),
        company_profile_json=company_profile.model_dump_json(indent=2),
        scenario=scenario
    )
    
    # Injecting here because SIMULATION_ENGINE_PROMPT lacks a schema
    prompt_text += f"\n\nCRITICAL INSTRUCTION: You MUST return ONLY valid JSON. The JSON must strictly adhere to this exact schema. Do NOT wrap the JSON in any other outer keys:\n{json.dumps(PersonaReaction.model_json_schema(), indent=2)}"
    
    empty_usage = {"inputTokens": 0, "outputTokens": 0, "totalTokens": 0}
    
    try:
        response = bedrock.converse(
            modelId="us.amazon.nova-2-lite-v1:0",
            messages=[{"role": "user", "content": [{"text": prompt_text}]}],
            inferenceConfig={"maxTokens": 400, "temperature": 0.7}
        )
        
        usage = response.get("usage", empty_usage)
        
        for block in response["output"]["message"]["content"]:
            if "text" in block:
                parsed_data = robust_reaction_parse(block["text"])
                if parsed_data:
                    try:
                        return PersonaReaction(**parsed_data), usage
                    except Exception as e:
                        print(f"Reaction validation error: {e}")
                        pass
                        
        return None, usage
    except Exception as e:
        return None, empty_usage
    

def get_titan_embedding(text: str) -> list[float]:
    """Fetches a text embedding from Amazon Titan."""
    try:
        response = bedrock.invoke_model(
            modelId="amazon.titan-embed-text-v2:0",
            body=json.dumps({"inputText": text}),
            contentType="application/json",
            accept="application/json"
        )
        return json.loads(response['body'].read())['embedding']
    except Exception as e:
        print(f"Embedding error: {e}")
        return [0.0] * 1024  # Fallback zero vector


def label_cluster_theme(quote: str) -> str:
    """Uses Nova Lite to generate a 2-4 word label for a representative quote."""
    prompt = prompts.CLUSTER_LABELING_PROMPT.format(quote=quote)
    try:
        response = bedrock.converse(
            modelId="us.amazon.nova-2-lite-v1:0",
            messages=[{"role": "user", "content": [{"text": prompt}]}]
        )
        return response["output"]["message"]["content"][0]["text"].strip(' "\'')
    except:
        return "Unknown Theme"


def extract_representative_voices(reactions_list: list[dict], target_key: str = "reasoning", n_clusters: int = 4) -> dict:
    """Runs K-Means on embeddings to extract the most representative quotes."""
    print(f"Running intelligent clustering on {target_key}...")
    
    texts = [r["reaction"][target_key] for r in reactions_list if r.get("reaction")]
    if len(texts) < n_clusters:
        return {"Insufficient Data": texts}
        
    embeddings = np.array([get_titan_embedding(t) for t in texts])
    
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init='auto')
    labels = kmeans.fit_predict(embeddings)
    
    clustered_voices = {}
    for i in range(n_clusters):
        # Find the text closest to this cluster's centroid
        centroid = kmeans.cluster_centers_[i]
        cluster_indices = np.where(labels == i)[0]
        cluster_embeddings = embeddings[cluster_indices]
        
        distances = np.linalg.norm(cluster_embeddings - centroid, axis=1)
        closest_idx = cluster_indices[np.argmin(distances)]
        representative_quote = texts[closest_idx]
        
        # Label the theme cosmetically
        theme_label = label_cluster_theme(representative_quote)
        clustered_voices[theme_label] = representative_quote
        
    return clustered_voices


def classify_segment_risk(churn_rate: float, avg_sentiment: float) -> str:
    """Deterministically classifies segment risk based on hard metrics."""
    # Catch the absolute worst cases first
    if churn_rate >= 0.50 or avg_sentiment <= -0.5:
        return "critical_risk"
    # Then catch the moderate risks
    elif churn_rate >= 0.20 or avg_sentiment < -0.2:
        return "at_risk"
    # Catch the absolute best
    elif churn_rate < 0.05 and avg_sentiment > 0.5:
        return "strong_positive"
    # Catch the generally good
    elif churn_rate < 0.20 and avg_sentiment > 0.2:
        return "positive"
    # Everything else
    else:
        return "neutral"


def calculate_market_metrics(reactions_list: list[dict]) -> dict:
    """Calculates all 14 deterministic market metrics with robust normalization."""
    print("Crunching hard market metrics...")
    
    rows = []
    for item in reactions_list:
        if not item.get("reaction"): continue
        row = {**item["persona"], **item["reaction"]}
        rows.append(row)
        
    df = pd.DataFrame(rows)
    if df.empty: return {}

    # --- NORMALIZATION LAYER ---
    # Squish hallucinated 1-10 sentiment scores down to -1.0 to 1.0
    if 'sentiment_score' in df.columns:
        df.loc[df['sentiment_score'] > 1.0, 'sentiment_score'] = (df['sentiment_score'] - 5.5) / 4.5
        df.loc[df['sentiment_score'] < -1.0, 'sentiment_score'] = -1.0 # Floor safety
    
    # 1. & 2. Sentiment Distribution & Polarization
    sentiment_dist = df['sentiment'].value_counts(normalize=True).to_dict()
    polarization = df['sentiment_score'].std()
    
    # 3. & 14. NPS & Recommendation Polarity
    promoters = len(df[df['likelihood_to_recommend'] >= 9])
    detractors = len(df[df['likelihood_to_recommend'] <= 6])
    nps = ((promoters - detractors) / len(df)) * 100
    is_bimodal = polarization > 0.6  
    
    # 4. Behavioral Distribution
    behavior_dist = df['behavioral_prediction'].value_counts(normalize=True).to_dict()
    
    # 5. Churn Risk Rate
    existing_users = df[df['customer_status'].isin(["Loyal Customer", "Casual Buyer", "Lapsed/Churned"])]
    churn_risk = len(existing_users[existing_users['behavioral_prediction'].isin(['abandon', 'decrease_engagement'])]) / max(len(existing_users), 1)
    
    # 6. Acquisition Potential 
    prospects = df[df['customer_status'].isin(["Prospect", "First-Time Buyer"])]
    acquisition_potential = len(prospects[prospects['behavioral_prediction'].isin(['adopt', 'increase_engagement'])]) / max(len(prospects), 1)
    
    # 7. Win-Back Rate
    lapsed = df[df['customer_status'] == "Lapsed/Churned"]
    win_back = len(lapsed[lapsed['sentiment'].isin(['positive'])]) / max(len(lapsed), 1)
    
    # 9. Revenue-Weighted Sentiment
    df['income_weight'] = df['income'] / df['income'].sum()
    rev_weighted_sentiment = (df['sentiment_score'] * df['income_weight']).sum()
    
    # 12. Loyalty Paradox Detection
    loyal = df[df['customer_status'] == "Loyal Customer"]
    loyalty_paradox = len(loyal[loyal['sentiment'] == 'negative']) / max(len(loyal), 1)
    
    # 13. Income-Sentiment Correlation
    income_sentiment_corr = df['income'].corr(df['sentiment_score'])

    # Segment-Level Metrics (8, 10, 11) using MEDIAN for WTP
    segment_metrics = {}
    for segment, group in df.groupby('archetype_name'):
        median_wtp = group['willingness_to_pay'].median()
        churn_rate = len(group[group['behavioral_prediction'].isin(['abandon', 'decrease_engagement'])]) / len(group)
        avg_sentiment = group['sentiment_score'].mean()
        
        segment_metrics[segment] = {
            "size_percentage": len(group) / len(df),
            "avg_sentiment": avg_sentiment,
            "churn_rate": churn_rate,
            "median_willingness_to_pay": median_wtp if pd.notna(median_wtp) else "Will Not Pay",
            "pre_calculated_status": classify_segment_risk(churn_rate, avg_sentiment)
        }
        
    return {
        "global_metrics": {
            "net_promoter_score": round(nps, 2),
            "polarization_index_std_dev": round(polarization, 2),
            "is_highly_polarized_bimodal": bool(is_bimodal),
            "churn_risk_rate": round(churn_risk, 2),
            "acquisition_potential": round(acquisition_potential, 2),
            "win_back_rate": round(win_back, 2),
            "revenue_weighted_sentiment": round(rev_weighted_sentiment, 2),
            "loyalty_paradox_rate": round(loyalty_paradox, 2),
            "income_sentiment_correlation": round(income_sentiment_corr, 2),
            "sentiment_distribution": sentiment_dist,
            "behavioral_distribution": behavior_dist
        },
        "segment_metrics": segment_metrics
    }


def generate_diagnostic_report(scenario: str, metrics: dict, voices: dict) -> tuple[DiagnosticReport | None, dict]:
    prompt_text = prompts.DIAGNOSTIC_REPORT_PROMPT.format(
        scenario=scenario,
        metrics_json=json.dumps(metrics, indent=2),
        voices_json=json.dumps(voices, indent=2)
    )
    
    # Injecting here because DIAGNOSTIC_REPORT_PROMPT lacks a schema
    prompt_text += f"\n\nCRITICAL INSTRUCTION: You MUST return ONLY valid JSON. The JSON must strictly adhere to this exact schema. Do NOT wrap the JSON in any other outer keys (like 'executive_summary'):\n{json.dumps(DiagnosticReport.model_json_schema(), indent=2)}"
    
    empty_usage = {"inputTokens": 0, "outputTokens": 0, "totalTokens": 0}
    
    try:
        response = bedrock.converse(
            modelId="us.amazon.nova-2-lite-v1:0",
            messages=[{"role": "user", "content": [{"text": prompt_text}]}],
            inferenceConfig={"temperature": 0.2}
        )
        
        usage = response.get("usage", empty_usage)
        
        for block in response["output"]["message"]["content"]:
            if "text" in block:
                parsed_data = robust_diagnostic_parse(block["text"])
                if parsed_data:
                    try:
                        return DiagnosticReport(**parsed_data), usage
                    except Exception as e:
                        print(f"Diagnostic validation error: {e}")
                        pass
                        
        return None, usage
    except Exception as e:
        print(f"Error generating diagnostic report: {e}")
        return None, empty_usage
    

def robust_baseline_parse(text: str) -> dict:
    """Safely extracts the baseline JSON from a potentially messy web-grounded LLM response."""
    match = re.search(r'\{[\s\S]*\}', text)
    if match:
        try: return json.loads(match.group(0))
        except json.JSONDecodeError: pass
        
    def extract_str(key):
        m = re.search(f'"{key}"\\s*:\\s*"([^"]+)"', text)
        return m.group(1).strip() if m else "UNKNOWN"

    def extract_list(key):
        m = re.search(f'"{key}"\\s*:\\s*\\[([^\\]]*)\\]', text)
        if m:
            items = re.findall(r'"([^"]+)"', m.group(1))
            return [item.strip() for item in items] if items else []
        return []

    return {
        "current_estimated_churn": extract_str("current_estimated_churn"),
        "current_estimated_nps": extract_str("current_estimated_nps"),
        "current_revenue_context": extract_str("current_revenue_context"),
        "recent_market_moves": extract_str("recent_market_moves"),
        "key_baseline_sources": extract_list("key_baseline_sources")
    }


def fetch_baseline_context(company_name: str) -> tuple[BaselineContext | None, dict]:
    """Uses nova_grounding to fetch real-world baseline metrics."""
    prompt_text = prompts.BASELINE_INTELLIGENCE_PROMPT.format(company_name=company_name)
    tool_config = {"tools": [{"systemTool": {"name": "nova_grounding"}}]}
    empty_usage = {"inputTokens": 0, "outputTokens": 0, "totalTokens": 0}
    
    try:
        response = bedrock.converse(
            modelId="us.amazon.nova-2-lite-v1:0",
            messages=[{"role": "user", "content": [{"text": prompt_text}]}],
            toolConfig=tool_config
        )
        
        usage = response.get("usage", empty_usage)
        output_text = "".join([c.get("text", "") for c in response["output"]["message"]["content"]])
        
        if "NOT_FOUND" in output_text.strip(): 
            return None, usage
            
        parsed_json = robust_baseline_parse(output_text)
        try: 
            return BaselineContext(**parsed_json), usage
        except Exception as e:
            print(f"Baseline Pydantic validation failed: {e}")
            return None, usage
    except Exception as e:
        print(f"Error during Baseline fetch: {e}")
        return None, empty_usage


def robust_strategic_plan_parse(text: str) -> dict | None:
    """Aggressive fallback parser to surgically extract Strategic Plan data."""
    clean_text = re.sub(r'^```json\s*', '', text, flags=re.MULTILINE)
    clean_text = re.sub(r'^```\s*', '', clean_text, flags=re.MULTILINE)
    
    def normalize_payload(p):
        if "delta_analysis" in p and "metrics_comparison" in p["delta_analysis"]:
            for metric in p["delta_analysis"]["metrics_comparison"]:
                if "severity" in metric and isinstance(metric["severity"], str):
                    metric["severity"] = metric["severity"].lower()
        
        if "overall_strategy" in p and "strategic_verdict" in p["overall_strategy"]:
            val = p["overall_strategy"]["strategic_verdict"]
            if isinstance(val, str):
                p["overall_strategy"]["strategic_verdict"] = val.title()
        return p

    match = re.search(r'\{[\s\S]*\}', clean_text)
    if match:
        try:
            data = json.loads(match.group(0))
            payload = extract_nested_payload(data, {"delta_analysis", "segment_specific_advice", "overall_strategy"})
            if payload: 
                return normalize_payload(payload)
        except json.JSONDecodeError:
            pass

    print("Standard JSON parse failed for Strategic Plan. Initiating aggressive regex extraction...")

    def extract_str(key, block, default="Information not available"):
        # First try: handle escaped quotes inside value
        m = re.search(f'"{key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"', block)
        if m:
            return m.group(1).strip().replace('\\"', "'").replace('\\n', ' ')
        return default

    def extract_list(key, block):
        m = re.search(f'"{key}"\\s*:\\s*\\[([^\\]]*)\\]', block)
        if m:
            items = re.findall(r'"((?:[^"\\]|\\.)*)"', m.group(1))
            return [item.strip().replace('\\"', "'").replace('\\n', ' ') for item in items]
        return []

    try:
        delta_analysis = {
            "metrics_comparison": [],
            "net_assessment": "Information not available"
        }
        delta_block_match = re.search(r'"delta_analysis"\s*:\s*\{([\s\S]*?)\}(?=\s*,\s*"segment_specific_advice"|\s*\Z)', text)
        if delta_block_match:
            d_block = delta_block_match.group(1)
            delta_analysis["net_assessment"] = extract_str("net_assessment", d_block)
            
            metrics_array_match = re.search(r'"metrics_comparison"\s*:\s*\[([\s\S]*?)\]', d_block)
            if metrics_array_match:
                metric_blocks = re.findall(r'\{([^{}]*?)\}', metrics_array_match.group(1))
                for mb in metric_blocks:
                    delta_analysis["metrics_comparison"].append({
                        "metric": extract_str("metric", mb),
                        "current_baseline": extract_str("current_baseline", mb),
                        "simulated_outcome": extract_str("simulated_outcome", mb),
                        "delta": extract_str("delta", mb),
                        "severity": extract_str("severity", mb, "medium").lower()
                    })

        segment_advice = []
        segment_array_match = re.search(r'"segment_specific_advice"\s*:\s*\[([\s\S]*?)\](?=\s*,\s*"overall_strategy"|\s*\Z)', text)
        if segment_array_match:
            segment_blocks = re.findall(r'\{([^{}]*?)\}', segment_array_match.group(1))
            for sb in segment_blocks:
                segment_advice.append({
                    "segment_name": extract_str("segment_name", sb),
                    "current_status_insight": extract_str("current_status_insight", sb),
                    "simulated_impact": extract_str("simulated_impact", sb),
                    "recommended_approach": extract_str("recommended_approach", sb),
                    "profit_consideration": extract_str("profit_consideration", sb)
                })

        overall_strategy = {
            "strategic_verdict": "Pivot", 
            "strategic_rationale": "Information not available",
            "key_tradeoffs": [],
            "profit_optimization_notes": "Information not available"
        }
        strategy_block_match = re.search(r'"overall_strategy"\s*:\s*\{([\s\S]*?)\}(?=\s*,\s*"revised_scenario"|\s*\Z)', text)
        if strategy_block_match:
            s_block = strategy_block_match.group(1)
            overall_strategy["strategic_verdict"] = extract_str("strategic_verdict", s_block, "Pivot").title()
            overall_strategy["strategic_rationale"] = extract_str("strategic_rationale", s_block)
            overall_strategy["profit_optimization_notes"] = extract_str("profit_optimization_notes", s_block)
            overall_strategy["key_tradeoffs"] = extract_list("key_tradeoffs", s_block)

        revised_scenario = extract_str("revised_scenario", text)
        advisor_message = extract_str("advisor_message", text)

        payload = {
            "delta_analysis": delta_analysis,
            "segment_specific_advice": segment_advice,
            "overall_strategy": overall_strategy,
            "revised_scenario": revised_scenario,
            "advisor_message": advisor_message
        }
        
        if overall_strategy["strategic_rationale"] == "Information not available" and delta_analysis["net_assessment"] == "Information not available":
            return None
            
        return normalize_payload(payload)
    except Exception as e:
        print(f"Aggressive regex fallback failed: {e}")
        return None


def generate_strategic_plan(scenario: str, baseline: BaselineContext, diagnostic: DiagnosticReport) -> tuple[StrategicPlan | None, dict]:
    """Passes the context to Nova to generate the final strategic pivot plan, bypassing Bedrock's strict tool engine."""
    prompt_text = prompts.STRATEGIC_ADVISOR_PROMPT.format(
        scenario=scenario,
        baseline_json=baseline.model_dump_json(indent=2),
        diagnostic_json=diagnostic.model_dump_json(indent=2)
    )

    prompt_text += f"\n\nCRITICAL: You MUST return ONLY valid JSON matching this exact schema. No other text, no markdown fences, no preamble:\n{json.dumps(StrategicPlan.model_json_schema(), indent=2)}"
    
    
    empty_usage = {"inputTokens": 0, "outputTokens": 0, "totalTokens": 0}
    
    try:
        response = bedrock.converse(
            modelId="us.amazon.nova-2-lite-v1:0",
            messages=[{"role": "user", "content": [{"text": prompt_text}]}],
            inferenceConfig={"temperature": 0.4, "maxTokens": 4096} 
        )
        
        usage = response.get("usage", empty_usage)
        content_blocks = response["output"]["message"]["content"]
        
        print("Extracting strategic plan via robust regex parsing...")
        for block in content_blocks:
            if "text" in block:
                parsed_data = robust_strategic_plan_parse(block["text"])
                if parsed_data:
                    try:
                        return StrategicPlan(**parsed_data), usage
                    except Exception as val_err:
                        print(f"\n⚠️ FALLBACK VALIDATION ERROR:\n{val_err}")
                        return None, usage

        print(f"\n⚠️ NO VALID JSON FOUND. RAW RESPONSE:\n{content_blocks}")
        return None, usage
        
    except Exception as e:
        print(f"\n⚠️ BEDROCK API ERROR:\n{e}")
        return None, empty_usage