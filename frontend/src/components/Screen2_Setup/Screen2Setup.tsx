import { useState } from 'react';
import { useOracusStore } from '../../store/useOracusStore';
import SimulationLoading from '../Shared/SimulationLoading';
import {
  generatePersonas,
  runSimulation,
  analyzeReactions,
  fetchBaseline,
  getStrategicAdvice
} from '../../api/client';

export default function Screen2Setup() {
  const {
    companyProfile, demographicMap,
    scenario, setScenario,
    personaCount, setPersonaCount,
    setFocusGroup, setReactions, setAnalysis, setBaseline, setStrategicPlan,
    setScreen, isLoading, loadingPhase, setLoading
  } = useOracusStore();

  const [error, setError] = useState('');

  if (!companyProfile || !demographicMap) {
    return <div className="text-white">Error: Profile data missing. Please go back.</div>;
  }

  const handleRunSimulation = async () => {
    if (!scenario.trim()) return;
    setError('');

    try {
      setLoading(true, 'Phase 1/4: Generating target focus group...');
      const groupRes = await generatePersonas(scenario, companyProfile, demographicMap, personaCount);
      setFocusGroup(groupRes.archetypes.archetypes, groupRes.personas);

      setLoading(true, `Phase 2/4: Simulating ${personaCount} individual reactions...`);
      const simRes = await runSimulation(companyProfile, scenario, groupRes.personas);
      setReactions(simRes.reactions);

      setLoading(true, 'Phase 3/4: Crunching metrics and fetching market baseline...');
      const [analyzeRes, baselineRes] = await Promise.all([
        analyzeReactions(scenario, simRes.reactions),
        fetchBaseline(companyProfile.company_name)
      ]);
      setAnalysis(analyzeRes.metrics, analyzeRes.voices, analyzeRes.diagnostic_report);
      setBaseline(baselineRes.baseline);

      setLoading(true, 'Phase 4/4: Generating executive-grade strategic plan...');
      const advisorRes = await getStrategicAdvice(scenario, baselineRes.baseline, analyzeRes.diagnostic_report);
      setStrategicPlan(advisorRes.strategic_plan);

      setLoading(false);
      setScreen(3);

    } catch (err: any) {
      setError(err.message || 'An error occurred during the simulation pipeline.');
      setLoading(false);
    }
  };

  // if (isLoading) {
  //   return (
  //     <div className="flex flex-col items-center justify-center animate-in fade-in duration-500 max-w-[500px] text-center">
  //       <svg className="animate-spin h-10 w-10 text-[#3B82F6] mb-6 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  //         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  //         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  //       </svg>
  //       <h2 className="text-[22px] font-medium text-[#E2E8F0] mb-2 drop-shadow-md">Running Simulation</h2>
  //       <p className="text-[16px] text-[#8B8FA3]">{loadingPhase}</p>
  //       <p className="text-[13px] text-[#555770] mt-6 bg-[#0A0A0F] px-4 py-2 rounded-full border border-[#2A2A3E] shadow-inner">
  //         This usually takes 45-60 seconds. Do not close this window.
  //       </p>
  //     </div>
  //   );
  // }

  if (isLoading) {
    return <SimulationLoading phase={loadingPhase} />;
  }

  return (
    <div className="w-full max-w-[850px] flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-700 pb-10">

      {/* 3D-Elevated Company & Demographic Card */}
      <div className="w-full bg-gradient-to-b from-[#1A1A2E] to-[#12121A] border border-[#2A2A3E] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] shadow-[#3B82F6]/5 relative overflow-hidden ring-1 ring-white/5">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-70"></div>

        <div className="p-7 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-gradient-to-b from-[#042D1F] to-[#021A12] text-[#34D399] border border-[#34D399]/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] rounded-full px-3.5 py-1.5 text-[12px] font-semibold tracking-wide flex items-center gap-1.5 uppercase">
              <svg className="w-3.5 h-3.5 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
              Target Profile Extracted
            </span>
          </div>

          <h2 className="text-[32px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-[#8B8FA3] mb-4 drop-shadow-sm">
            {companyProfile.company_name}
          </h2>

          <p className="text-[15px] text-[#A0A5C0] leading-relaxed mb-8 font-light">
            {companyProfile.product_description}
          </p>

          {/* Vibrant Glassmorphism Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <div className="bg-indigo-950/20 backdrop-blur-md border border-indigo-500/20 rounded-xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-indigo-950/30 transition-colors">
              <p className="text-[11px] text-indigo-300/80 font-bold tracking-[0.15em] uppercase mb-2">Market Position</p>
              <p className="text-[14px] text-indigo-50 font-medium leading-snug">{companyProfile.market_position}</p>
            </div>
            <div className="bg-emerald-950/20 backdrop-blur-md border border-emerald-500/20 rounded-xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-emerald-950/30 transition-colors">
              <p className="text-[11px] text-emerald-300/80 font-bold tracking-[0.15em] uppercase mb-2">Pricing Model</p>
              <p className="text-[14px] text-emerald-50 font-medium leading-snug">{companyProfile.pricing_model}</p>
            </div>
            <div className="bg-rose-950/20 backdrop-blur-md border border-rose-500/20 rounded-xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-rose-950/30 transition-colors">
              <p className="text-[11px] text-rose-300/80 font-bold tracking-[0.15em] uppercase mb-2">Key Competitors</p>
              <p className="text-[14px] text-rose-50 font-medium leading-snug">
                {companyProfile.key_competitors.join(', ')}
              </p>
            </div>
          </div>

          <hr className="border-[#2A2A3E]/60 mb-8" />

          {/* Demographic Data with subtle cyan accents */}
          <h3 className="text-[16px] font-semibold text-[#E2E8F0] mb-5 flex items-center gap-2">
            <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Audience Demographics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-cyan-950/10 rounded-xl p-5 border border-cyan-900/20">
            <div className="flex flex-col gap-1.5">
              <p className="text-[12px] text-cyan-200/60 font-medium uppercase tracking-wider">Age & Gender Profile</p>
              <p className="text-[14px] text-[#E2E8F0] font-light">{demographicMap.age_distribution}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-[12px] text-cyan-200/60 font-medium uppercase tracking-wider">Income & Spending</p>
              <p className="text-[14px] text-[#E2E8F0] font-light">{demographicMap.income_distribution}</p>
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2 mt-2">
              <p className="text-[12px] text-cyan-200/60 font-medium uppercase tracking-wider">Geographic Concentration</p>
              <p className="text-[14px] text-[#E2E8F0] font-light">{demographicMap.geographic_trends}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recessed Scenario Input Card */}
      <div className="w-full bg-[#12121A] border border-[#2A2A3E] rounded-2xl p-7 sm:p-10 shadow-lg relative overflow-hidden">
        {/* Subtle accent glow behind the text area */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#3B82F6]/5 blur-3xl rounded-full pointer-events-none"></div>

        <div className="mb-6 relative z-10">
          <h3 className="text-[20px] font-semibold text-[#E2E8F0]">Design Your Scenario</h3>
          <p className="text-[14.5px] text-[#8B8FA3] mt-2 font-light">
            Describe the specific business decision, pricing change, or feature launch you want to test against the demographic profile above.
          </p>
        </div>

        <textarea
          id="scenario"
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          placeholder="e.g. We want to replace our traditional point-based rewards program with a $9.99/month subscription tier..."
          className="relative z-10 w-full bg-[#0A0A0F] border border-[#1A1A2E] rounded-xl text-[#E2E8F0] placeholder-[#555770] px-5 py-4 text-[15px] min-h-[160px] resize-y focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 focus:outline-none transition-all mb-8 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]"
        />

        {error && <p className="relative z-10 text-[13px] text-[#EF4444] mb-6 p-4 bg-gradient-to-r from-[#2D1215] to-[#12121A] border-l-4 border-[#EF4444] rounded-r-lg shadow-sm">{error}</p>}

        <div className="bg-[#1A1A2E]/40 backdrop-blur-sm rounded-xl p-6 border border-[#2A2A3E]/60 relative z-10">
          <p className="text-[14px] font-semibold text-[#E2E8F0] mb-5">Virtual Focus Group Size</p>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">

            <div className="flex flex-col gap-3">
              <div className="flex rounded-lg border border-[#2A2A3E] overflow-hidden bg-[#0A0A0F] shadow-inner w-fit p-1 gap-1">
                {[10, 50, 100].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPersonaCount(num)}
                    className={`px-4 py-2 text-[13px] font-medium rounded-md transition-all ${personaCount === num
                        ? 'bg-gradient-to-b from-[#3B82F6] to-[#2563EB] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] drop-shadow-sm'
                        : 'text-[#8B8FA3] hover:text-[#E2E8F0] hover:bg-[#1A1A2E]'
                      }`}
                  >
                    {num} Personas
                  </button>
                ))}
              </div>

              <p className="text-[12.5px] text-[#8B8FA3] max-w-[320px] leading-relaxed">
                {personaCount === 10 && 'Generates 10 AI profiles. Best for rapid testing and checking if your prompt is clear.'}
                {personaCount === 50 && 'Generates 50 unique AI profiles. Provides a balanced, statistically significant market analysis.'}
                {personaCount === 100 && 'Generates 100 AI profiles. Deepest segmentation, ideal for uncovering niche edge-cases.'}
              </p>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={!scenario.trim() || isLoading}
              className="bg-gradient-to-b from-[#F8FAFC] to-[#CBD5E1] text-[#0A0A0F] font-bold text-[15px] tracking-wide rounded-xl px-8 py-3.5 hover:from-white hover:to-[#E2E8F0] transition-all active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto self-end shadow-[0_0_20px_rgba(59,130,246,0.15)] border border-white/20"
            >
              Run Simulation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}