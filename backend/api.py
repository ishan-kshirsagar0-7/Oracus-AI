import time
import asyncio
from typing import List, Optional, Any, Dict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import utils

from schemas import (
    CompanyProfile, 
    DemographicMap, 
    PersonaArchetypeList, 
    Persona, 
    DiagnosticReport, 
    BaselineContext, 
    StrategicPlan
)

app = FastAPI(title="Oracus AI Backend", version="1.0.0")

# 1. CORS Configuration for Frontend Integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. API Data Models (The Frontend Contracts)
class MetaResponse(BaseModel):
    time_taken_sec: float
    input_tokens: int
    output_tokens: int

class CompanyIntelRequest(BaseModel):
    company_name: str

class CompanyIntelResponse(BaseModel):
    company_profile: CompanyProfile
    demographic_map: DemographicMap
    meta: MetaResponse

class GeneratePersonasRequest(BaseModel):
    scenario: str
    company_profile: CompanyProfile
    demographic_map: DemographicMap
    persona_count: int = 50

class GeneratePersonasResponse(BaseModel):
    archetypes: PersonaArchetypeList
    personas: List[Persona]
    meta: MetaResponse

class SimulateRequest(BaseModel):
    personas: List[Persona]
    company_profile: CompanyProfile
    scenario: str

class SimulateResponse(BaseModel):
    reactions: List[Dict[str, Any]]
    meta: MetaResponse

class AnalyzeRequest(BaseModel):
    reactions: List[Dict[str, Any]]
    scenario: str

class AnalyzeResponse(BaseModel):
    metrics: dict
    voices: dict
    diagnostic_report: DiagnosticReport
    meta: MetaResponse

class BaselineRequest(BaseModel):
    company_name: str

class BaselineResponse(BaseModel):
    baseline: BaselineContext
    meta: MetaResponse

class AdvisorRequest(BaseModel):
    scenario: str
    baseline: BaselineContext
    diagnostic_report: DiagnosticReport

class AdvisorResponse(BaseModel):
    strategic_plan: StrategicPlan
    meta: MetaResponse


# 3. Helper for generic retry logic on Utils functions
async def run_with_retries(func, *args, max_retries=3):
    """Executes a synchronous utils function in a thread with retries."""
    for attempt in range(max_retries):
        try:
            result = await asyncio.to_thread(func, *args)
            
            # Handle the tuple (result, usage) return format
            if isinstance(result, tuple) and len(result) == 2:
                data, usage = result
                if data: return data, usage
            # Handle single returns (like company profile which doesn't return usage currently)
            elif result and result != "NOT_FOUND":
                return result, {"inputTokens": 0, "outputTokens": 0, "totalTokens": 0}
                
        except Exception as e:
            print(f"Error on attempt {attempt + 1} for {func.__name__}: {e}")
            
        await asyncio.sleep(2)
        
    raise HTTPException(status_code=500, detail=f"Failed to execute {func.__name__} after {max_retries} attempts.")


# 4. The API Routes

@app.post("/api/company_intel", response_model=CompanyIntelResponse)
async def api_company_intel(req: CompanyIntelRequest):
    start_time = time.perf_counter()
    
    # Run these two concurrently to slash the wait time for the first screen
    profile_task = run_with_retries(utils
    .fetch_company_profile, req.company_name)
    demo_map_task = run_with_retries(utils
    .fetch_demographic_map, req.company_name)
    
    (profile, _), (demo_map, _) = await asyncio.gather(profile_task, demo_map_task)
    
    duration = round(time.perf_counter() - start_time, 2)
    return CompanyIntelResponse(
        company_profile=profile,
        demographic_map=demo_map,
        meta=MetaResponse(time_taken_sec=duration, input_tokens=0, output_tokens=0)
    )

@app.post("/api/generate_personas", response_model=GeneratePersonasResponse)
async def api_generate_personas(req: GeneratePersonasRequest):
    start_time = time.perf_counter()
    
    archetypes, usage = await run_with_retries(
        utils
        .generate_persona_archetypes, 
        req.company_profile, 
        req.demographic_map, 
        req.scenario
    )
    
    personas = await asyncio.to_thread(utils
    .spawn_personas, archetypes, req.persona_count)
    
    duration = round(time.perf_counter() - start_time, 2)
    return GeneratePersonasResponse(
        archetypes=archetypes,
        personas=personas,
        meta=MetaResponse(
            time_taken_sec=duration, 
            input_tokens=usage.get("inputTokens", 0), 
            output_tokens=usage.get("outputTokens", 0)
        )
    )

@app.post("/api/simulate", response_model=SimulateResponse)
async def api_simulate(req: SimulateRequest):
    start_time = time.perf_counter()
    
    sem = asyncio.Semaphore(10)
    total_usage = {"inputTokens": 0, "outputTokens": 0}
    
    async def process_persona(persona: Persona):
        async with sem:
            for attempt in range(3):
                reaction, usage = await asyncio.to_thread(
                    utils
                    .simulate_single_persona, persona, req.company_profile, req.scenario
                )
                if reaction:
                    return {"persona": persona.model_dump(), "reaction": reaction.model_dump()}, usage
                await asyncio.sleep(2)
            return None, {"inputTokens": 0, "outputTokens": 0}

    tasks = [process_persona(p) for p in req.personas]
    results = await asyncio.gather(*tasks)
    
    valid_reactions = []
    for res, usage in results:
        total_usage["inputTokens"] += usage.get("inputTokens", 0)
        total_usage["outputTokens"] += usage.get("outputTokens", 0)
        if res:
            valid_reactions.append(res)
            
    if not valid_reactions:
        raise HTTPException(status_code=500, detail="All persona simulations failed.")

    duration = round(time.perf_counter() - start_time, 2)
    return SimulateResponse(
        reactions=valid_reactions,
        meta=MetaResponse(
            time_taken_sec=duration, 
            input_tokens=total_usage["inputTokens"], 
            output_tokens=total_usage["outputTokens"]
        )
    )

@app.post("/api/analyze", response_model=AnalyzeResponse)
async def api_analyze(req: AnalyzeRequest):
    start_time = time.perf_counter()
    
    metrics = await asyncio.to_thread(utils
    .calculate_market_metrics, req.reactions)
    voices = await asyncio.to_thread(utils
    .extract_representative_voices, req.reactions)
    
    report, usage = await run_with_retries(utils
    .generate_diagnostic_report, req.scenario, metrics, voices)
    
    duration = round(time.perf_counter() - start_time, 2)
    return AnalyzeResponse(
        metrics=metrics,
        voices=voices,
        diagnostic_report=report,
        meta=MetaResponse(
            time_taken_sec=duration,
            input_tokens=usage.get("inputTokens", 0),
            output_tokens=usage.get("outputTokens", 0)
        )
    )

@app.post("/api/baseline", response_model=BaselineResponse)
async def api_baseline(req: BaselineRequest):
    start_time = time.perf_counter()
    
    baseline, usage = await run_with_retries(utils
    .fetch_baseline_context, req.company_name)
    
    duration = round(time.perf_counter() - start_time, 2)
    return BaselineResponse(
        baseline=baseline,
        meta=MetaResponse(
            time_taken_sec=duration,
            input_tokens=usage.get("inputTokens", 0),
            output_tokens=usage.get("outputTokens", 0)
        )
    )

@app.post("/api/advisor", response_model=AdvisorResponse)
async def api_advisor(req: AdvisorRequest):
    start_time = time.perf_counter()
    
    plan, usage = await run_with_retries(utils
    .generate_strategic_plan, req.scenario, req.baseline, req.diagnostic_report)
    
    duration = round(time.perf_counter() - start_time, 2)
    return AdvisorResponse(
        strategic_plan=plan,
        meta=MetaResponse(
            time_taken_sec=duration,
            input_tokens=usage.get("inputTokens", 0),
            output_tokens=usage.get("outputTokens", 0)
        )
    )