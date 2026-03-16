import type { 
  CompanyProfile, DemographicMap, PersonaArchetype, Persona, 
  SimulatedReaction, DiagnosticReport, BaselineContext, StrategicPlan, MetaResponse 
} from '../types/api.types';

// our live Vercel deployment URL
const BASE_URL = 'https://oracus-backend.vercel.app';

async function fetcher<T>(endpoint: string, body: any): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.status} on ${endpoint}`);
  }
  
  return response.json();
}

// --- 1. Company Intel ---
export interface CompanyIntelResponse {
  company_profile: CompanyProfile;
  demographic_map: DemographicMap;
  meta: MetaResponse;
}
export const fetchCompanyIntel = (company_name: string) => 
  fetcher<CompanyIntelResponse>('/api/company_intel', { company_name });

// --- 2. Generate Personas ---
export interface GeneratePersonasResponse {
  archetypes: { archetypes: PersonaArchetype[] }; 
  personas: Persona[];
  meta: MetaResponse;
}
export const generatePersonas = (scenario: string, company_profile: CompanyProfile, demographic_map: DemographicMap, persona_count: number = 50) => 
  fetcher<GeneratePersonasResponse>('/api/generate_personas', { scenario, company_profile, demographic_map, persona_count });

// --- 3. Simulate ---
export interface SimulateResponse {
  reactions: SimulatedReaction[];
  meta: MetaResponse;
}
export const runSimulation = (company_profile: CompanyProfile, scenario: string, personas: Persona[]) => 
  fetcher<SimulateResponse>('/api/simulate', { company_profile, scenario, personas });

// --- 4. Analyze ---
export interface AnalyzeResponse {
  metrics: any; // Kept flexible for the complex metrics object
  voices: Record<string, string>;
  diagnostic_report: DiagnosticReport;
  meta: MetaResponse;
}
export const analyzeReactions = (scenario: string, reactions: SimulatedReaction[]) => 
  fetcher<AnalyzeResponse>('/api/analyze', { scenario, reactions });

// --- 5. Baseline ---
export interface BaselineResponse {
  baseline: BaselineContext;
  meta: MetaResponse;
}
export const fetchBaseline = (company_name: string) => 
  fetcher<BaselineResponse>('/api/baseline', { company_name });

// --- 6. Advisor ---
export interface AdvisorResponse {
  strategic_plan: StrategicPlan;
  meta: MetaResponse;
}
export const getStrategicAdvice = (scenario: string, baseline: BaselineContext, diagnostic_report: DiagnosticReport) => 
  fetcher<AdvisorResponse>('/api/advisor', { scenario, baseline, diagnostic_report });