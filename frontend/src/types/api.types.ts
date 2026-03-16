// src/types/api.types.ts

export interface MetaResponse {
  time_taken_sec: number;
  input_tokens: number;
  output_tokens: number;
}

export interface CompanyProfile {
  company_name: string;
  product_description: string;
  list_of_products: string[];
  target_audience: string;
  pricing_model: string;
  key_competitors: string[];
  market_position: string;
  unique_value_proposition: string;
  core_pain_points_solved: string[];
}

export interface DemographicMap {
  age_distribution: string;
  income_distribution: string;
  geographic_trends: string;
  behavioral_segments: string[];
  price_sensitivity: string;
}

export interface PersonaArchetype {
  archetype_name: string;
  weight_percentage: number;
  min_age: number;
  max_age: number;
  min_income: number;
  max_income: number;
  category_familiarity: string;
  price_sensitivity: string;
  customer_status: string;
  core_pain_points: string[];
}

export interface Persona {
  persona_id: string;
  name: string;
  age: number;
  income: number;
  location: string;
  archetype_name: string;
  category_familiarity: string;
  price_sensitivity: string;
  customer_status: string;
  core_pain_points: string[];
}

export interface ReactionData {
  persona_name: string;
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  sentiment_score: number;
  behavioral_prediction: 'increase_engagement' | 'decrease_engagement' | 'abandon' | 'maintain' | 'adopt';
  reasoning: string;
  key_concern: string;
  willingness_to_pay: number;
  likelihood_to_recommend: number;
}

export interface SimulatedReaction {
  persona: Persona;
  reaction: ReactionData;
}

export interface DiagnosticReport {
  situation_assessment: string;
  headline_findings: string[];
  segment_classifications: {
    segment_name: string;
    status: 'critical_risk' | 'at_risk' | 'neutral' | 'positive' | 'strong_positive';
    headline: string;
  }[];
}

export interface BaselineContext {
  current_estimated_churn: string;
  current_estimated_nps: string;
  current_revenue_context: string;
  recent_market_moves: string;
  key_baseline_sources: string[];
}

export interface StrategicPlan {
  delta_analysis: {
    metrics_comparison: {
      metric: string;
      current_baseline: string;
      simulated_outcome: string;
      delta: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
    }[];
    net_assessment: string;
  };
  segment_specific_advice: {
    segment_name: string;
    current_status_insight: string;
    simulated_impact: string;
    recommended_approach: string;
    profit_consideration: string;
  }[];
  overall_strategy: {
    strategic_verdict: 'Proceed' | 'Pivot' | 'Abandon';
    strategic_rationale: string;
    key_tradeoffs: string[];
    profit_optimization_notes: string;
  };
  revised_scenario: string;
  advisor_message: string;
}