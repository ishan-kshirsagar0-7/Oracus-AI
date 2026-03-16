from pydantic import BaseModel, Field, field_validator
from typing import List, Literal, Optional

class CompanyProfile(BaseModel):
    company_name: str
    product_description: str
    list_of_products: List[str]
    target_audience: str
    pricing_model: str
    key_competitors: List[str]
    market_position: str
    unique_value_proposition: str
    core_pain_points_solved: List[str]

class DemographicMap(BaseModel):
    age_distribution: str
    income_distribution: str
    geographic_trends: str
    behavioral_segments: List[str]
    price_sensitivity: str

class PersonaArchetype(BaseModel):
    archetype_name: str
    weight_percentage: int = Field(..., description="Must sum to 100 across all archetypes")
    min_age: int
    max_age: int
    min_income: int
    max_income: int
    category_familiarity: str # Generalized from tech_savviness
    price_sensitivity: str
    customer_status: str # Generalized from usage_tier
    core_pain_points: List[str]

class PersonaArchetypeList(BaseModel):
    archetypes: List[PersonaArchetype]

class Persona(BaseModel):
    persona_id: str
    name: str
    age: int
    income: int
    location: str
    archetype_name: str
    category_familiarity: str
    price_sensitivity: str
    customer_status: str
    core_pain_points: List[str]

class SegmentStrategy(BaseModel):
    segment_name: str
    recommended_action: str

# class PersonaReaction(BaseModel):
#     persona_name: str
#     sentiment: str # "positive", "negative", "neutral", "mixed"
#     sentiment_score: float = Field(..., description="STRICTLY a float between -1.0 and 1.0. Do not use a 1-10 scale.")
#     behavioral_prediction: str # "increase_engagement", "decrease_engagement", "abandon", "maintain", "adopt"
#     reasoning: str
#     key_concern: str
#     willingness_to_pay: float | None = Field(..., description="Maximum price in USD they are willing to pay for this specific product/service. Must be a realistic amount. Do not output annual budgets.")
#     likelihood_to_recommend: int # 1 to 10

class PersonaReaction(BaseModel):
    persona_name: str
    sentiment: Literal["positive", "negative", "neutral", "mixed"]
    sentiment_score: float = Field(..., description="STRICTLY a float between -1.0 and 1.0.")
    behavioral_prediction: Literal["increase_engagement", "decrease_engagement", "abandon", "maintain", "adopt"]
    reasoning: str
    key_concern: str
    willingness_to_pay: float | None = Field(None, description="Maximum price in USD.")
    likelihood_to_recommend: int

    @field_validator('sentiment', mode='before')
    @classmethod
    def normalize_sentiment(cls, v):
        if isinstance(v, str):
            return v.strip().lower()
        return v

    @field_validator('behavioral_prediction', mode='before')
    @classmethod
    def normalize_behavior(cls, v):
        if isinstance(v, str):
            return v.strip().lower().replace(' ', '_')
        return v

class SegmentClassification(BaseModel):
    segment_name: str
    status: Literal["critical_risk", "at_risk", "neutral", "positive", "strong_positive"]
    headline: str

class DiagnosticReport(BaseModel):
    situation_assessment: str
    headline_findings: List[str]
    segment_classifications: List[SegmentClassification]

class BaselineContext(BaseModel):
    current_estimated_churn: str
    current_estimated_nps: str
    current_revenue_context: str
    recent_market_moves: str
    key_baseline_sources: List[str]

class MetricDelta(BaseModel):
    metric: str
    current_baseline: str
    simulated_outcome: str
    delta: str
    severity: Literal["low", "medium", "high", "critical"]

class DeltaAnalysis(BaseModel):
    metrics_comparison: List[MetricDelta]
    net_assessment: str

class SegmentAdvice(BaseModel):
    segment_name: str
    current_status_insight: str
    simulated_impact: str
    recommended_approach: str
    profit_consideration: str

class OverallStrategy(BaseModel):
    strategic_verdict: Literal["Proceed", "Pivot", "Abandon"]
    strategic_rationale: str
    key_tradeoffs: List[str]
    profit_optimization_notes: str

class StrategicPlan(BaseModel):
    delta_analysis: DeltaAnalysis
    segment_specific_advice: List[SegmentAdvice]
    overall_strategy: OverallStrategy
    revised_scenario: str  # "None" if verdict is Proceed or Abandon
    advisor_message: str