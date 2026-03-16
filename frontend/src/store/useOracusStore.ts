// src/store/useOracusStore.ts
import { create } from 'zustand';
import type { 
  CompanyProfile, DemographicMap, PersonaArchetype, Persona, 
  SimulatedReaction, DiagnosticReport, BaselineContext, StrategicPlan 
} from '../types/api.types';

interface OracusState {
  // Navigation & UI State
  currentScreen: 1 | 2 | 3;
  setScreen: (screen: 1 | 2 | 3) => void;
  
  isLoading: boolean;
  loadingPhase: string;
  setLoading: (isLoading: boolean, phase?: string) => void;

  // User Inputs
  companyName: string;
  setCompanyName: (name: string) => void;
  scenario: string;
  setScenario: (scenario: string) => void;
  personaCount: number;
  setPersonaCount: (count: number) => void;

  // API Responses (Phase 1)
  companyProfile: CompanyProfile | null;
  demographicMap: DemographicMap | null;
  setCompanyIntel: (profile: CompanyProfile, demographics: DemographicMap) => void;

  // API Responses (Phase 2 & 3)
  archetypes: PersonaArchetype[];
  personas: Persona[];
  setFocusGroup: (archetypes: PersonaArchetype[], personas: Persona[]) => void;

  reactions: SimulatedReaction[];
  setReactions: (reactions: SimulatedReaction[]) => void;

  // API Responses (Phase 4 & 5)
  metrics: any | null; // We can strictly type this later if needed
  voices: Record<string, string> | null;
  diagnosticReport: DiagnosticReport | null;
  setAnalysis: (metrics: any, voices: Record<string, string>, report: DiagnosticReport) => void;

  baseline: BaselineContext | null;
  setBaseline: (baseline: BaselineContext) => void;

  strategicPlan: StrategicPlan | null;
  setStrategicPlan: (plan: StrategicPlan) => void;

  // Reset function for a fresh start
  resetApp: () => void;
}

export const useOracusStore = create<OracusState>((set) => ({
  currentScreen: 1,
  setScreen: (screen) => set({ currentScreen: screen }),
  
  isLoading: false,
  loadingPhase: '',
  setLoading: (isLoading, phase = '') => set({ isLoading, loadingPhase: phase }),

  companyName: '',
  setCompanyName: (name) => set({ companyName: name }),
  scenario: '',
  setScenario: (scenario) => set({ scenario }),
  personaCount: 50,
  setPersonaCount: (count) => set({ personaCount: count }),

  companyProfile: null,
  demographicMap: null,
  setCompanyIntel: (profile, demographics) => set({ companyProfile: profile, demographicMap: demographics }),

  archetypes: [],
  personas: [],
  setFocusGroup: (archetypes, personas) => set({ archetypes, personas }),

  reactions: [],
  setReactions: (reactions) => set({ reactions }),

  metrics: null,
  voices: null,
  diagnosticReport: null,
  setAnalysis: (metrics, voices, report) => set({ metrics, voices, diagnosticReport: report }),

  baseline: null,
  setBaseline: (baseline) => set({ baseline }),

  strategicPlan: null,
  setStrategicPlan: (plan) => set({ strategicPlan: plan }),

  resetApp: () => set({
    currentScreen: 1,
    companyName: '',
    scenario: '',
    personaCount: 50,
    companyProfile: null,
    demographicMap: null,
    archetypes: [],
    personas: [],
    reactions: [],
    metrics: null,
    voices: null,
    diagnosticReport: null,
    baseline: null,
    strategicPlan: null,
    isLoading: false,
    loadingPhase: ''
  })
}));