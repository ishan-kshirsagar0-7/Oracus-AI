// import { useOracusStore } from '../../store/useOracusStore';

// const SEVERITY_STYLES: Record<string, { bg: string; border: string; text: string }> = {
//   critical: { bg: 'bg-rose-950/30', border: 'border-rose-500/30', text: 'text-rose-400' },
//   high: { bg: 'bg-amber-950/30', border: 'border-amber-500/30', text: 'text-amber-400' },
//   medium: { bg: 'bg-blue-950/30', border: 'border-blue-500/30', text: 'text-blue-400' },
//   low: { bg: 'bg-emerald-950/30', border: 'border-emerald-500/30', text: 'text-emerald-400' },
// };

// const VERDICT_STYLES: Record<string, { bg: string; border: string; text: string; glow: string; badge: string }> = {
//   Proceed: {
//     bg: 'bg-emerald-950/20',
//     border: 'border-emerald-500/30',
//     text: 'text-emerald-400',
//     glow: 'shadow-[0_0_30px_rgba(52,211,153,0.15)]',
//     badge: 'bg-emerald-500',
//   },
//   Pivot: {
//     bg: 'bg-amber-950/20',
//     border: 'border-amber-500/30',
//     text: 'text-amber-400',
//     glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
//     badge: 'bg-amber-500',
//   },
//   Abandon: {
//     bg: 'bg-rose-950/20',
//     border: 'border-rose-500/30',
//     text: 'text-rose-400',
//     glow: 'shadow-[0_0_30px_rgba(244,63,94,0.15)]',
//     badge: 'bg-rose-500',
//   },
// };

// const STATUS_STYLES: Record<string, { bg: string; border: string; text: string }> = {
//   critical_risk: { bg: 'bg-rose-950/20', border: 'border-rose-500/30', text: 'text-rose-400' },
//   at_risk: { bg: 'bg-amber-950/20', border: 'border-amber-500/30', text: 'text-amber-400' },
//   neutral: { bg: 'bg-slate-800/20', border: 'border-slate-500/30', text: 'text-slate-400' },
//   positive: { bg: 'bg-emerald-950/20', border: 'border-emerald-500/30', text: 'text-emerald-400' },
//   strong_positive: { bg: 'bg-emerald-950/30', border: 'border-emerald-400/40', text: 'text-emerald-300' },
// };

// const STATUS_LABELS: Record<string, string> = {
//   critical_risk: 'Critical Risk',
//   at_risk: 'At Risk',
//   neutral: 'Neutral',
//   positive: 'Positive',
//   strong_positive: 'Strong Positive',
// };

// export default function Tab6StrategicPlaybook() {
//   const {
//     strategicPlan,
//     diagnosticReport,
//     personaCount,
//     archetypes,
//     voices,
//     setScenario,
//     setScreen,
//   } = useOracusStore();

//   if (!strategicPlan) {
//     return <div className="p-8 text-[#8B8FA3]">Loading strategic playbook...</div>;
//   }

//   const verdict = strategicPlan.overall_strategy.strategic_verdict;
//   const verdictStyle = VERDICT_STYLES[verdict] || VERDICT_STYLES.Pivot;

//   const segmentCount = diagnosticReport?.segment_classifications?.length || 0;
//   const themeCount = voices ? Object.keys(voices).length : 0;

//   // Find segment status from diagnostic report for each advice card
//   const getSegmentStatus = (segmentName: string) => {
//     const match = diagnosticReport?.segment_classifications?.find(
//       (s) => s.segment_name === segmentName
//     );
//     return match?.status || 'neutral';
//   };

//   const handleResimulate = () => {
//     if (strategicPlan.revised_scenario && strategicPlan.revised_scenario !== 'None') {
//       setScenario(strategicPlan.revised_scenario.replace(/^"|"$/g, ''));
//       setScreen(2);
//     }
//   };

//   return (
//     <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10">

//       {/* ============ PIPELINE BREADCRUMB ============ */}
//       <div className="flex flex-wrap items-center justify-center gap-2 text-[13px] text-[#555770] bg-[#0A0A0F] border border-[#2A2A3E] rounded-full px-5 py-3 mx-auto">
//         <span className="text-[#E2E8F0] font-medium">{personaCount} personas</span>
//         <span>→</span>
//         <span className="text-[#E2E8F0] font-medium">{segmentCount} segments</span>
//         <span>→</span>
//         <span className="text-[#E2E8F0] font-medium">{archetypes.length} archetypes</span>
//         <span>→</span>
//         <span className="text-[#E2E8F0] font-medium">{themeCount} themes</span>
//         <span>→</span>
//         <span className={`font-bold ${verdictStyle.text}`}>1 strategic verdict</span>
//       </div>

//       {/* ============ ZONE 1: THE VERDICT ============ */}
//       <div className={`${verdictStyle.bg} border ${verdictStyle.border} rounded-2xl p-8 ${verdictStyle.glow} relative overflow-hidden`}>
//         {/* Subtle background glow */}
//         <div className={`absolute top-0 right-0 w-64 h-64 ${verdictStyle.badge} opacity-5 blur-[80px] rounded-full pointer-events-none`}></div>

//         <div className="relative z-10">
//           {/* Verdict Badge */}
//           <div className="flex items-center gap-4 mb-6">
//             <span className={`${verdictStyle.badge} text-white text-[13px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-lg shadow-lg`}>
//               {verdict}
//             </span>
//             <span className="text-[14px] text-[#8B8FA3] font-light">Strategic Verdict</span>
//           </div>

//           {/* Advisor Message */}
//           <div className="mb-6">
//             <p className="text-[17px] text-[#E2E8F0] leading-relaxed font-light">
//               {strategicPlan.advisor_message.replace(/^"|"$/g, '')}
//             </p>
//           </div>

//           {/* Strategic Rationale */}
//           <div className="bg-[#0A0A0F]/40 border border-[#2A2A3E]/40 rounded-xl p-5 mt-4">
//             <p className="text-[11px] text-[#555770] font-bold uppercase tracking-wider mb-2">Strategic Rationale</p>
//             <p className="text-[14px] text-[#A0A5C0] leading-relaxed font-light">
//               {strategicPlan.overall_strategy.strategic_rationale}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ============ ZONE 2: DELTA ANALYSIS ============ */}
//       <div>
//         <h2 className="text-[20px] font-semibold text-[#E2E8F0] mb-5 flex items-center gap-2">
//           <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//           </svg>
//           Baseline vs. Simulated Impact
//         </h2>

//         <div className="bg-[#12121A] border border-[#2A2A3E] rounded-2xl overflow-hidden shadow-lg">
//           {/* Delta Rows */}
//           {strategicPlan.delta_analysis.metrics_comparison.map((metric, idx) => {
//             const severity = SEVERITY_STYLES[metric.severity] || SEVERITY_STYLES.medium;
//             const isLast = idx === strategicPlan.delta_analysis.metrics_comparison.length - 1;

//             return (
//               <div
//                 key={idx}
//                 className={`flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-5 gap-3 ${
//                   !isLast ? 'border-b border-[#2A2A3E]/50' : ''
//                 } hover:bg-[#1A1A2E]/30 transition-colors`}
//               >
//                 {/* Metric Name */}
//                 <div className="flex items-center gap-3 min-w-[140px]">
//                   <span className="text-[15px] font-medium text-[#E2E8F0]">{metric.metric}</span>
//                 </div>

//                 {/* Baseline → Simulated */}
//                 <div className="flex items-center gap-3 flex-grow justify-center">
//                   <span className="text-[14px] text-[#8B8FA3] font-mono">{metric.current_baseline}</span>
//                   <svg className="w-4 h-4 text-[#555770] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                   </svg>
//                   <span className="text-[14px] text-[#E2E8F0] font-mono font-medium">{metric.simulated_outcome}</span>
//                 </div>

//                 {/* Delta + Severity */}
//                 <div className="flex items-center gap-3 min-w-[160px] justify-end">
//                   <span className={`text-[14px] font-mono font-medium ${severity.text}`}>{metric.delta}</span>
//                   <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${severity.border} ${severity.text} ${severity.bg}`}>
//                     {metric.severity}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}

//           {/* Net Assessment */}
//           <div className="px-6 py-5 bg-[#0A0A0F]/50 border-t border-[#2A2A3E]">
//             <p className="text-[11px] text-[#555770] font-bold uppercase tracking-wider mb-2">Net Assessment</p>
//             <p className="text-[14px] text-[#A0A5C0] font-light leading-relaxed">
//               {strategicPlan.delta_analysis.net_assessment}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ============ ZONE 3: SEGMENT PLAYBOOK ============ */}
//       <div>
//         <h2 className="text-[20px] font-semibold text-[#E2E8F0] mb-5 flex items-center gap-2">
//           <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//           </svg>
//           Profit-Optimized Segment Playbook
//         </h2>

//         <div className="flex flex-col gap-4">
//           {strategicPlan.segment_specific_advice.map((advice, idx) => {
//             const segStatus = getSegmentStatus(advice.segment_name);
//             const statusStyle = STATUS_STYLES[segStatus] || STATUS_STYLES.neutral;

//             return (
//               <div key={idx} className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-6 shadow-md hover:bg-[#12121A]/80 transition-colors">

//                 {/* Header: Segment Name + Status Badge */}
//                 <div className="flex justify-between items-start mb-4">
//                   <h3 className="text-[17px] font-semibold text-[#E2E8F0]">{advice.segment_name}</h3>
//                   <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusStyle.border} ${statusStyle.text} ${statusStyle.bg}`}>
//                     {STATUS_LABELS[segStatus] || segStatus}
//                   </span>
//                 </div>

//                 {/* Primary: Recommended Approach */}
//                 <div className="bg-blue-950/15 border border-blue-500/15 rounded-lg p-4 mb-4">
//                   <p className="text-[11px] text-blue-400/70 font-bold uppercase tracking-wider mb-2">Recommended Approach</p>
//                   <p className="text-[15px] text-[#E2E8F0] font-medium leading-relaxed">
//                     {advice.recommended_approach}
//                   </p>
//                 </div>

//                 {/* Profit Consideration Callout */}
//                 <div className="bg-amber-950/15 border border-amber-500/15 rounded-lg p-4 mb-4 flex items-start gap-3">
//                   <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <div>
//                     <p className="text-[11px] text-amber-400/70 font-bold uppercase tracking-wider mb-1">Profit Consideration</p>
//                     <p className="text-[14px] text-amber-100/80 font-light leading-relaxed">{advice.profit_consideration}</p>
//                   </div>
//                 </div>

//                 {/* Supporting Context */}
//                 <div className="flex flex-col sm:flex-row gap-4">
//                   <div className="flex-1">
//                     <p className="text-[11px] text-[#555770] font-bold uppercase tracking-wider mb-1">Current Status</p>
//                     <p className="text-[13px] text-[#8B8FA3] font-light leading-relaxed">{advice.current_status_insight}</p>
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-[11px] text-[#555770] font-bold uppercase tracking-wider mb-1">Simulated Impact</p>
//                     <p className="text-[13px] text-[#8B8FA3] font-light leading-relaxed">{advice.simulated_impact}</p>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* ============ ZONE 4: THE PIVOT PATH ============ */}
//       {strategicPlan.revised_scenario &&
//        strategicPlan.revised_scenario !== 'None' &&
//        strategicPlan.revised_scenario !== '"None"' && (
//         <div className="bg-gradient-to-b from-[#1A1A2E] to-[#12121A] border border-[#3B82F6]/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden">
//           {/* Top accent line */}
//           <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-70"></div>

//           <div className="relative z-10">
//             <div className="flex items-center gap-3 mb-5">
//               <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//               </svg>
//               <h2 className="text-[20px] font-semibold text-[#E2E8F0]">Suggested Pivot Strategy</h2>
//             </div>

//             <p className="text-[14px] text-[#8B8FA3] mb-5 font-light">
//               Based on the analysis above, Oracus has formulated an optimized alternative strategy. You can re-run the entire simulation with this revised scenario to compare outcomes.
//             </p>

//             {/* The Revised Scenario */}
//             <div className="bg-[#0A0A0F] border border-[#2A2A3E] rounded-xl p-5 mb-6">
//               <p className="text-[11px] text-[#3B82F6] font-bold uppercase tracking-wider mb-3">Revised Scenario</p>
//               <p className="text-[15px] text-[#E2E8F0] font-medium leading-relaxed">
//                 {strategicPlan.revised_scenario.replace(/^"|"$/g, '')}
//               </p>
//             </div>

//             {/* Re-simulate Button */}
//             <button
//               onClick={handleResimulate}
//               className="w-full sm:w-auto bg-gradient-to-b from-[#3B82F6] to-[#2563EB] text-white font-bold text-[15px] tracking-wide rounded-xl px-8 py-4 hover:from-[#4B92FF] hover:to-[#3B82F6] transition-all active:translate-y-[1px] shadow-[0_0_25px_rgba(59,130,246,0.3)] border border-blue-400/20 flex items-center justify-center gap-3"
//             >
//               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//               </svg>
//               Simulate This Strategy
//             </button>

//             <p className="text-[12px] text-[#555770] mt-3 font-light">
//               This will launch a fresh simulation with the revised scenario against the same company profile.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* ============ ZONE 5: KEY TRADEOFFS ============ */}
//       {strategicPlan.overall_strategy.key_tradeoffs?.length > 0 && (
//         <div className="bg-[#0A0A0F] border border-[#2A2A3E] rounded-xl p-6">
//           <p className="text-[13px] text-[#555770] font-bold uppercase tracking-wider mb-4">Key Tradeoffs to Consider</p>
//           <div className="flex flex-col gap-3">
//             {strategicPlan.overall_strategy.key_tradeoffs.map((tradeoff, idx) => (
//               <div key={idx} className="flex items-start gap-3">
//                 <svg className="w-4 h-4 text-amber-500/60 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                 </svg>
//                 <p className="text-[14px] text-[#A0A5C0] font-light leading-relaxed">{tradeoff}</p>
//               </div>
//             ))}
//           </div>

//           {/* Profit Optimization Notes */}
//           {strategicPlan.overall_strategy.profit_optimization_notes && (
//             <div className="mt-5 pt-4 border-t border-[#2A2A3E]/40">
//               <p className="text-[11px] text-[#555770] font-bold uppercase tracking-wider mb-2">Profit Optimization Note</p>
//               <p className="text-[14px] text-[#8B8FA3] font-light leading-relaxed">
//                 {strategicPlan.overall_strategy.profit_optimization_notes}
//               </p>
//             </div>
//           )}
//         </div>
//       )}

//     </div>
//   );
// }

import { useState } from 'react';
import { useOracusStore } from '../../store/useOracusStore';

const SEVERITY_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  critical: { bg: 'bg-rose-950/30', border: 'border-rose-500/30', text: 'text-rose-400' },
  high: { bg: 'bg-amber-950/30', border: 'border-amber-500/30', text: 'text-amber-400' },
  medium: { bg: 'bg-blue-950/30', border: 'border-blue-500/30', text: 'text-blue-400' },
  low: { bg: 'bg-emerald-950/30', border: 'border-emerald-500/30', text: 'text-emerald-400' },
};

const VERDICT_STYLES: Record<string, { bg: string; border: string; text: string; glow: string; badge: string }> = {
  Proceed: {
    bg: 'bg-emerald-950/20',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    glow: 'shadow-[0_0_30px_rgba(52,211,153,0.15)]',
    badge: 'bg-emerald-500',
  },
  Pivot: {
    bg: 'bg-amber-950/20',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    badge: 'bg-amber-500',
  },
  Abandon: {
    bg: 'bg-rose-950/20',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    glow: 'shadow-[0_0_30px_rgba(244,63,94,0.15)]',
    badge: 'bg-rose-500',
  },
};

const STATUS_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  critical_risk: { bg: 'bg-rose-950/20', border: 'border-rose-500/30', text: 'text-rose-400' },
  at_risk: { bg: 'bg-amber-950/20', border: 'border-amber-500/30', text: 'text-amber-400' },
  neutral: { bg: 'bg-slate-800/20', border: 'border-slate-500/30', text: 'text-slate-400' },
  positive: { bg: 'bg-emerald-950/20', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  strong_positive: { bg: 'bg-emerald-950/30', border: 'border-emerald-400/40', text: 'text-emerald-300' },
};

const STATUS_LABELS: Record<string, string> = {
  critical_risk: 'Critical Risk',
  at_risk: 'At Risk',
  neutral: 'Neutral',
  positive: 'Positive',
  strong_positive: 'Strong Positive',
};

export default function Tab6StrategicPlaybook() {
  const {
    strategicPlan,
    diagnosticReport,
    personaCount,
    archetypes,
    voices,
    setScenario,
    setScreen,
  } = useOracusStore();

  const [segmentIndex, setSegmentIndex] = useState(0);

  if (!strategicPlan) {
    return <div className="p-8 text-[#8B8FA3]">Loading strategic playbook...</div>;
  }

  const verdict = strategicPlan.overall_strategy.strategic_verdict;
  const verdictStyle = VERDICT_STYLES[verdict] || VERDICT_STYLES.Pivot;

  const segmentCount = diagnosticReport?.segment_classifications?.length || 0;
  const themeCount = voices ? Object.keys(voices).length : 0;
  const segments = strategicPlan.segment_specific_advice;

  const getSegmentStatus = (segmentName: string) => {
    const match = diagnosticReport?.segment_classifications?.find(
      (s) => s.segment_name === segmentName
    );
    return match?.status || 'neutral';
  };

  const handleResimulate = () => {
    if (strategicPlan.revised_scenario && strategicPlan.revised_scenario !== 'None') {
      setScenario(strategicPlan.revised_scenario.replace(/^"|"$/g, ''));
      setScreen(2);
    }
  };

  const handleSegmentPrev = () => {
    if (segmentIndex > 0) setSegmentIndex(prev => prev - 1);
  };

  const handleSegmentNext = () => {
    if (segmentIndex < segments.length - 1) setSegmentIndex(prev => prev + 1);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10">

      {/* ============ PIPELINE BREADCRUMB ============ */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-[13px] text-[#555770] bg-[#0A0A0F] border border-[#2A2A3E] rounded-full px-5 py-3 mx-auto">
        <span className="text-[#E2E8F0] font-medium">{personaCount} personas</span>
        <span>→</span>
        <span className="text-[#E2E8F0] font-medium">{segmentCount} segments</span>
        <span>→</span>
        <span className="text-[#E2E8F0] font-medium">{archetypes.length} archetypes</span>
        <span>→</span>
        <span className="text-[#E2E8F0] font-medium">{themeCount} themes</span>
        <span>→</span>
        <span className={`font-bold ${verdictStyle.text}`}>1 strategic verdict</span>
      </div>

      {/* ============ ZONE 1: THE VERDICT ============ */}
      <div className={`${verdictStyle.bg} border ${verdictStyle.border} rounded-2xl p-8 ${verdictStyle.glow} relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-64 h-64 ${verdictStyle.badge} opacity-5 blur-[80px] rounded-full pointer-events-none`}></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <span className={`${verdictStyle.badge} text-white text-[13px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-lg shadow-lg`}>
              {verdict}
            </span>
            <span className="text-[14px] text-[#8B8FA3] font-light">Strategic Verdict</span>
          </div>

          <div className="mb-6">
            <p className="text-[17px] text-[#E2E8F0] leading-relaxed font-light">
              {strategicPlan.advisor_message.replace(/^"|"$/g, '')}
            </p>
          </div>

          <div className="bg-[#0A0A0F]/40 border border-[#2A2A3E]/40 rounded-xl p-5 mt-4">
            <p className="text-[11px] text-[#555770] font-bold uppercase tracking-wider mb-2">Strategic Rationale</p>
            <p className="text-[14px] text-[#A0A5C0] leading-relaxed font-light">
              {strategicPlan.overall_strategy.strategic_rationale}
            </p>
          </div>
        </div>
      </div>

      {/* ============ ZONE 2: DELTA ANALYSIS ============ */}
      <div>
        <h2 className="text-[20px] font-semibold text-[#E2E8F0] mb-5 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Baseline vs. Simulated Impact
        </h2>

        <div className="bg-[#12121A] border border-[#2A2A3E] rounded-2xl overflow-hidden shadow-lg">
          {strategicPlan.delta_analysis.metrics_comparison.map((metric, idx) => {
            const severity = SEVERITY_STYLES[metric.severity] || SEVERITY_STYLES.medium;
            const isLast = idx === strategicPlan.delta_analysis.metrics_comparison.length - 1;

            return (
              <div
                key={idx}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-5 gap-3 ${
                  !isLast ? 'border-b border-[#2A2A3E]/50' : ''
                } hover:bg-[#1A1A2E]/30 transition-colors`}
              >
                <div className="flex items-center gap-3 min-w-[140px]">
                  <span className="text-[15px] font-medium text-[#E2E8F0]">{metric.metric}</span>
                </div>

                <div className="flex items-center gap-3 flex-grow justify-center">
                  <span className="text-[14px] text-[#8B8FA3] font-mono">{metric.current_baseline}</span>
                  <svg className="w-4 h-4 text-[#555770] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span className="text-[14px] text-[#E2E8F0] font-mono font-medium">{metric.simulated_outcome}</span>
                </div>

                <div className="flex items-center gap-3 min-w-[160px] justify-end">
                  <span className={`text-[14px] font-mono font-medium ${severity.text}`}>{metric.delta}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${severity.border} ${severity.text} ${severity.bg}`}>
                    {metric.severity}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="px-6 py-5 bg-[#0A0A0F]/50 border-t border-[#2A2A3E]">
            <p className="text-[11px] text-[#555770] font-bold uppercase tracking-wider mb-2">Net Assessment</p>
            <p className="text-[14px] text-[#A0A5C0] font-light leading-relaxed">
              {strategicPlan.delta_analysis.net_assessment}
            </p>
          </div>
        </div>
      </div>

      {/* ============ ZONE 3: SEGMENT PLAYBOOK CAROUSEL ============ */}
      <div>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-[20px] font-semibold text-[#E2E8F0] flex items-center gap-2">
            <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Profit-Optimized Segment Playbook
          </h2>
          <span className="text-[13px] text-[#555770] font-medium">
            {segmentIndex + 1} / {segments.length}
          </span>
        </div>

        {segments.length > 0 && (
          <div className="relative">
            {/* The Card */}
            {(() => {
              const advice = segments[segmentIndex];
              const segStatus = getSegmentStatus(advice.segment_name);
              const statusStyle = STATUS_STYLES[segStatus] || STATUS_STYLES.neutral;

              return (
                <div className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-6 shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-[17px] font-semibold text-[#E2E8F0]">{advice.segment_name}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusStyle.border} ${statusStyle.text} ${statusStyle.bg}`}>
                      {STATUS_LABELS[segStatus] || segStatus}
                    </span>
                  </div>

                  <div className="bg-blue-950/15 border border-blue-500/15 rounded-lg p-4 mb-4">
                    <p className="text-[11px] text-blue-400/70 font-bold uppercase tracking-wider mb-2">Recommended Approach</p>
                    <p className="text-[15px] text-[#E2E8F0] font-medium leading-relaxed">
                      {advice.recommended_approach}
                    </p>
                  </div>

                  <div className="bg-amber-950/15 border border-amber-500/15 rounded-lg p-4 mb-4 flex items-start gap-3">
                    <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-[11px] text-amber-400/70 font-bold uppercase tracking-wider mb-1">Profit Consideration</p>
                      <p className="text-[14px] text-amber-100/80 font-light leading-relaxed">{advice.profit_consideration}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <p className="text-[11px] text-[#555770] font-bold uppercase tracking-wider mb-1">Current Status</p>
                      <p className="text-[13px] text-[#8B8FA3] font-light leading-relaxed">{advice.current_status_insight}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] text-[#555770] font-bold uppercase tracking-wider mb-1">Simulated Impact</p>
                      <p className="text-[13px] text-[#8B8FA3] font-light leading-relaxed">{advice.simulated_impact}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Navigation Arrows */}
            <button
              onClick={handleSegmentPrev}
              disabled={segmentIndex === 0}
              className={`absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-[#1A1A2E]/90 border border-[#2A2A3E] backdrop-blur-md transition-all ${
                segmentIndex === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-[#2A2A3E] hover:scale-110 text-white shadow-xl cursor-pointer'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handleSegmentNext}
              disabled={segmentIndex === segments.length - 1}
              className={`absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-[#1A1A2E]/90 border border-[#2A2A3E] backdrop-blur-md transition-all ${
                segmentIndex === segments.length - 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-[#2A2A3E] hover:scale-110 text-white shadow-xl cursor-pointer'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Pagination Dots */}
        {segments.length > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-5">
            {segments.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setSegmentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === segmentIndex ? 'w-8 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'w-2 bg-[#2A2A3E] hover:bg-[#555770]'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ============ ZONE 4: THE PIVOT PATH ============ */}
      {strategicPlan.revised_scenario &&
       strategicPlan.revised_scenario !== 'None' &&
       strategicPlan.revised_scenario !== '"None"' && (
        <div className="bg-gradient-to-b from-[#1A1A2E] to-[#12121A] border border-[#3B82F6]/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-70"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <h2 className="text-[20px] font-semibold text-[#E2E8F0]">Suggested Pivot Strategy</h2>
            </div>

            <p className="text-[14px] text-[#8B8FA3] mb-5 font-light">
              Based on the analysis above, Oracus has formulated an optimized alternative strategy. You can re-run the entire simulation with this revised scenario to compare outcomes.
            </p>

            <div className="bg-[#0A0A0F] border border-[#2A2A3E] rounded-xl p-5 mb-6">
              <p className="text-[11px] text-[#3B82F6] font-bold uppercase tracking-wider mb-3">Revised Scenario</p>
              <p className="text-[15px] text-[#E2E8F0] font-medium leading-relaxed">
                {strategicPlan.revised_scenario.replace(/^"|"$/g, '')}
              </p>
            </div>

            <button
              onClick={handleResimulate}
              className="w-full sm:w-auto bg-gradient-to-b from-[#3B82F6] to-[#2563EB] text-white font-bold text-[15px] tracking-wide rounded-xl px-8 py-4 hover:from-[#4B92FF] hover:to-[#3B82F6] transition-all active:translate-y-[1px] shadow-[0_0_25px_rgba(59,130,246,0.3)] border border-blue-400/20 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Simulate This Strategy
            </button>

            <p className="text-[12px] text-[#555770] mt-3 font-light">
              This will launch a fresh simulation with the revised scenario against the same company profile.
            </p>
          </div>
        </div>
      )}

      {/* ============ ZONE 5: KEY TRADEOFFS ============ */}
      {strategicPlan.overall_strategy.key_tradeoffs?.length > 0 && (
        <div className="bg-[#0A0A0F] border border-[#2A2A3E] rounded-xl p-6">
          <p className="text-[13px] text-[#555770] font-bold uppercase tracking-wider mb-4">Key Tradeoffs to Consider</p>
          <div className="flex flex-col gap-3">
            {strategicPlan.overall_strategy.key_tradeoffs.map((tradeoff, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <svg className="w-4 h-4 text-amber-500/60 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-[14px] text-[#A0A5C0] font-light leading-relaxed">{tradeoff}</p>
              </div>
            ))}
          </div>

          {strategicPlan.overall_strategy.profit_optimization_notes && (
            <div className="mt-5 pt-4 border-t border-[#2A2A3E]/40">
              <p className="text-[11px] text-[#555770] font-bold uppercase tracking-wider mb-2">Profit Optimization Note</p>
              <p className="text-[14px] text-[#8B8FA3] font-light leading-relaxed">
                {strategicPlan.overall_strategy.profit_optimization_notes}
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}