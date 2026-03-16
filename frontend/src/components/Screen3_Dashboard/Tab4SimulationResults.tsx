// import { useState, useMemo, useEffect } from 'react';
// import { useOracusStore } from '../../store/useOracusStore';

// // We reuse the exact same color palette from Tab 3 to maintain the visual bridge
// const ARCHETYPE_COLORS = ['#6366f1', '#34d399', '#22d3ee', '#f43f5e', '#a855f7', '#fbbf24', '#f87171', '#38bdf8', '#c084fc', '#4ade80'];

// export default function Tab4SimulationResults() {
//   const { reactions, archetypes } = useOracusStore();
//   const [activeFilter, setActiveFilter] = useState<string>('all');
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Safety fallback
//   if (!reactions || reactions.length === 0) {
//     return <div className="p-8 text-[#8B8FA3]">Loading simulation results...</div>;
//   }

//   // Helper to grab the exact archetype color from Tab 3
//   const getArchetypeColor = (archetypeName: string) => {
//     const index = archetypes.findIndex(a => a.archetype_name === archetypeName);
//     return index >= 0 ? ARCHETYPE_COLORS[index % ARCHETYPE_COLORS.length] : '#8B8FA3';
//   };

//   // 1. Crunch the Sentiment Data for Zone 1
//   const sentimentStats = useMemo(() => {
//     const total = reactions.length;
//     const positive = reactions.filter(r => r.reaction.sentiment === 'positive').length;
//     const mixed = reactions.filter(r => r.reaction.sentiment === 'mixed').length;
//     const neutral = reactions.filter(r => r.reaction.sentiment === 'neutral').length;
//     const negative = reactions.filter(r => r.reaction.sentiment === 'negative').length;

//     return {
//       total,
//       positive: { count: positive, pct: (positive / total) * 100, color: 'bg-emerald-500', glow: 'shadow-[0_0_15px_#10B981]' },
//       mixed: { count: mixed, pct: (mixed / total) * 100, color: 'bg-violet-500', glow: 'shadow-[0_0_15px_#8B5CF6]' },
//       neutral: { count: neutral, pct: (neutral / total) * 100, color: 'bg-amber-500', glow: 'shadow-[0_0_15px_#F59E0B]' },
//       negative: { count: negative, pct: (negative / total) * 100, color: 'bg-rose-500', glow: 'shadow-[0_0_15px_#F43F5E]' }
//     };
//   }, [reactions]);

//   // 2. Crunch the Behavioral Data for Zone 2
//   const behavioralStats = useMemo(() => {
//     const growth = reactions.filter(r => ['adopt', 'increase_engagement'].includes(r.reaction.behavioral_prediction)).length;
//     const stable = reactions.filter(r => r.reaction.behavioral_prediction === 'maintain').length;
//     const flight = reactions.filter(r => ['abandon', 'decrease_engagement'].includes(r.reaction.behavioral_prediction)).length;

//     return { growth, stable, flight };
//   }, [reactions]);

//   // 3. Filter the feedback cards for Zone 3
//   const filteredReactions = useMemo(() => {
//     if (activeFilter === 'all') return reactions;
//     return reactions.filter(r => r.reaction.sentiment === activeFilter);
//   }, [reactions, activeFilter]);

//   // Reset carousel index when filter changes
//   useEffect(() => {
//     setCurrentIndex(0);
//   }, [activeFilter]);

//   const handleNext = () => {
//     if (currentIndex < filteredReactions.length - 1) setCurrentIndex(prev => prev + 1);
//   };

//   const handlePrev = () => {
//     if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
//   };

//   // 3D Coverflow Style Calculator
//   const getCardStyles = (index: number) => {
//     if (index === currentIndex) {
//       return "left-1/2 -translate-x-1/2 scale-100 opacity-100 z-30 shadow-[0_0_40px_rgba(0,0,0,0.5)] pointer-events-auto";
//     }
//     if (index === currentIndex - 1) {
//       return "left-[15%] -translate-x-1/2 scale-90 opacity-40 z-20 hover:opacity-70 blur-[1px] cursor-pointer";
//     }
//     if (index === currentIndex + 1) {
//       return "left-[85%] -translate-x-1/2 scale-90 opacity-40 z-20 hover:opacity-70 blur-[1px] cursor-pointer";
//     }
//     if (index < currentIndex - 1) {
//       return "left-[-20%] -translate-x-1/2 scale-75 opacity-0 z-0 pointer-events-none";
//     }
//     if (index > currentIndex + 1) {
//       return "left-[120%] -translate-x-1/2 scale-75 opacity-0 z-0 pointer-events-none";
//     }
//   };

//   return (
//     <div className="flex flex-col gap-10 animate-in fade-in duration-500 pb-10">
      
//       {/* Zone 1: The Macro Pulse (Sentiment Spectrum) */}
//       <div className="bg-[#12121A] border border-[#2A2A3E] rounded-2xl p-7 shadow-lg">
//         <div className="flex justify-between items-end mb-5">
//           <div>
//             <h2 className="text-[20px] font-semibold text-[#E2E8F0]">Market Pulse</h2>
//             <p className="text-[14px] text-[#8B8FA3] mt-1">High-level emotional response to your proposed scenario.</p>
//           </div>
//         </div>

//         {/* Stacked Progress Bar */}
//         <div className="w-full h-8 rounded-full overflow-hidden flex bg-[#0A0A0F] border border-[#2A2A3E] shadow-inner">
//           <div style={{ width: `${sentimentStats.positive.pct}%` }} className={`${sentimentStats.positive.color} ${sentimentStats.positive.glow} relative group transition-all duration-500`}>
//              <div className="absolute inset-0 hover:bg-white/20 transition-colors cursor-pointer" title={`${sentimentStats.positive.count} Positive`} />
//           </div>
//           <div style={{ width: `${sentimentStats.mixed.pct}%` }} className={`${sentimentStats.mixed.color} ${sentimentStats.mixed.glow} relative group transition-all duration-500 border-l border-[#12121A]/30`}>
//              <div className="absolute inset-0 hover:bg-white/20 transition-colors cursor-pointer" title={`${sentimentStats.mixed.count} Mixed`} />
//           </div>
//           <div style={{ width: `${sentimentStats.neutral.pct}%` }} className={`${sentimentStats.neutral.color} ${sentimentStats.neutral.glow} relative group transition-all duration-500 border-l border-[#12121A]/30`}>
//              <div className="absolute inset-0 hover:bg-white/20 transition-colors cursor-pointer" title={`${sentimentStats.neutral.count} Neutral`} />
//           </div>
//           <div style={{ width: `${sentimentStats.negative.pct}%` }} className={`${sentimentStats.negative.color} ${sentimentStats.negative.glow} relative group transition-all duration-500 border-l border-[#12121A]/30`}>
//              <div className="absolute inset-0 hover:bg-white/20 transition-colors cursor-pointer" title={`${sentimentStats.negative.count} Negative`} />
//           </div>
//         </div>

//         {/* Legend */}
//         <div className="flex flex-wrap justify-between mt-5 gap-4">
//           <div className="flex items-center gap-2">
//             <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"></span>
//             <span className="text-[13px] text-[#E2E8F0] font-medium">Positive ({sentimentStats.positive.pct.toFixed(0)}%)</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_8px_#8B5CF6]"></span>
//             <span className="text-[13px] text-[#E2E8F0] font-medium">Mixed ({sentimentStats.mixed.pct.toFixed(0)}%)</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_#F59E0B]"></span>
//             <span className="text-[13px] text-[#E2E8F0] font-medium">Neutral ({sentimentStats.neutral.pct.toFixed(0)}%)</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#F43F5E]"></span>
//             <span className="text-[13px] text-[#E2E8F0] font-medium">Negative ({sentimentStats.negative.pct.toFixed(0)}%)</span>
//           </div>
//         </div>
//       </div>

//       {/* Zone 2: The Behavioral Shift */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
//         {/* Growth Card */}
//         <div className="bg-emerald-950/20 backdrop-blur-md border border-emerald-500/20 rounded-xl p-6 shadow-md relative overflow-hidden">
//           <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none"></div>
//           <h3 className="text-[12px] font-bold text-emerald-400 uppercase tracking-wider mb-2">Predicted Growth</h3>
//           <div className="flex items-end gap-3 mb-2">
//             <span className="text-[32px] font-bold text-emerald-50 leading-none">{behavioralStats.growth}</span>
//             <span className="text-[14px] text-emerald-200/60 pb-1 font-medium">Personas</span>
//           </div>
//           <p className="text-[13px] text-emerald-100/70 font-light leading-relaxed">Will adopt the product or significantly increase engagement.</p>
//         </div>

//         {/* Stable Card */}
//         <div className="bg-blue-950/20 backdrop-blur-md border border-blue-500/20 rounded-xl p-6 shadow-md relative overflow-hidden">
//           <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full pointer-events-none"></div>
//           <h3 className="text-[12px] font-bold text-blue-400 uppercase tracking-wider mb-2">Status Quo</h3>
//           <div className="flex items-end gap-3 mb-2">
//             <span className="text-[32px] font-bold text-blue-50 leading-none">{behavioralStats.stable}</span>
//             <span className="text-[14px] text-blue-200/60 pb-1 font-medium">Personas</span>
//           </div>
//           <p className="text-[13px] text-blue-100/70 font-light leading-relaxed">Will maintain their current usage levels despite the change.</p>
//         </div>

//         {/* Flight Risk Card */}
//         <div className="bg-rose-950/20 backdrop-blur-md border border-rose-500/20 rounded-xl p-6 shadow-md relative overflow-hidden">
//           <div className="absolute right-0 top-0 w-24 h-24 bg-rose-500/10 blur-2xl rounded-full pointer-events-none"></div>
//           <h3 className="text-[12px] font-bold text-rose-400 uppercase tracking-wider mb-2">Flight Risk</h3>
//           <div className="flex items-end gap-3 mb-2">
//             <span className="text-[32px] font-bold text-rose-50 leading-none">{behavioralStats.flight}</span>
//             <span className="text-[14px] text-rose-200/60 pb-1 font-medium">Personas</span>
//           </div>
//           <p className="text-[13px] text-rose-100/70 font-light leading-relaxed">Highly likely to cancel or severely decrease engagement.</p>
//         </div>

//       </div>

//       <hr className="border-[#2A2A3E]/60" />

//       {/* Zone 3: Voice of the Market (Coverflow Carousel) */}
//       <div>
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//           <h2 className="text-[20px] font-semibold text-[#E2E8F0]">Direct Feedback Log</h2>
          
//           {/* Sentiment Filters */}
//           <div className="flex bg-[#0A0A0F] border border-[#2A2A3E] rounded-lg p-1">
//             <button onClick={() => setActiveFilter('all')} className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors ${activeFilter === 'all' ? 'bg-[#2A2A3E] text-white' : 'text-[#8B8FA3] hover:text-[#E2E8F0]'}`}>All</button>
//             <button onClick={() => setActiveFilter('positive')} className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors ${activeFilter === 'positive' ? 'bg-emerald-500/20 text-emerald-400' : 'text-[#8B8FA3] hover:text-[#E2E8F0]'}`}>Positive</button>
//             <button onClick={() => setActiveFilter('mixed')} className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors ${activeFilter === 'mixed' ? 'bg-violet-500/20 text-violet-400' : 'text-[#8B8FA3] hover:text-[#E2E8F0]'}`}>Mixed</button>
//             <button onClick={() => setActiveFilter('neutral')} className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors ${activeFilter === 'neutral' ? 'bg-amber-500/20 text-amber-400' : 'text-[#8B8FA3] hover:text-[#E2E8F0]'}`}>Neutral</button>
//             <button onClick={() => setActiveFilter('negative')} className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors ${activeFilter === 'negative' ? 'bg-rose-500/20 text-rose-400' : 'text-[#8B8FA3] hover:text-[#E2E8F0]'}`}>Negative</button>
//           </div>
//         </div>

//         {/* The Carousel Stage */}
//         <div className="relative w-full h-[430px] flex items-center justify-center overflow-hidden py-4 rounded-xl">
          
//           {filteredReactions.length === 0 ? (
//             <div className="text-center py-10 text-[#8B8FA3]">
//               No reactions match the selected filter.
//             </div>
//           ) : (
//             <>
//               {filteredReactions.map((r, index) => {
//                 const borderColors: Record<string, string> = {
//                   positive: 'border-emerald-500/30 shadow-[0_4px_20px_rgba(16,185,129,0.05)]',
//                   mixed: 'border-violet-500/30 shadow-[0_4px_20px_rgba(139,92,246,0.05)]',
//                   neutral: 'border-amber-500/30 shadow-[0_4px_20px_rgba(245,158,11,0.05)]',
//                   negative: 'border-rose-500/30 shadow-[0_4px_20px_rgba(244,63,94,0.05)]'
//                 };

//                 const dotColors: Record<string, string> = {
//                   positive: 'bg-emerald-500 shadow-[0_0_8px_#10B981]',
//                   mixed: 'bg-violet-500 shadow-[0_0_8px_#8B5CF6]',
//                   neutral: 'bg-amber-500 shadow-[0_0_8px_#F59E0B]',
//                   negative: 'bg-rose-500 shadow-[0_0_8px_#F43F5E]'
//                 };

//                 const cardBorderClass = borderColors[r.reaction.sentiment] || 'border-[#2A2A3E]';
//                 const dotClass = dotColors[r.reaction.sentiment] || 'bg-gray-500';
//                 const archetypeColor = getArchetypeColor(r.persona.archetype_name);

//                 return (
//                   <div 
//                     key={index}
//                     onClick={() => {
//                       if (index === currentIndex - 1) handlePrev();
//                       if (index === currentIndex + 1) handleNext();
//                     }}
//                     className={`absolute w-full max-w-2xl h-[380px] bg-[#12121A] border rounded-xl p-6 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${cardBorderClass} ${getCardStyles(index)}`}
//                   >
                    
//                     {/* Header: Name & Sentiment */}
//                     <div className="flex justify-between items-start mb-3">
//                       <div className="flex flex-col gap-1">
//                         <h4 className="text-[18px] font-bold text-[#E2E8F0]">{r.persona.name}</h4>
//                         <div className="flex items-center gap-2 mt-1">
//                           <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: archetypeColor, boxShadow: `0 0 6px ${archetypeColor}` }}></span>
//                           <span className="text-[12px] text-[#A0A5C0] uppercase tracking-wider font-medium">{r.persona.archetype_name}</span>
//                         </div>
//                       </div>
//                       <span className={`w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ${dotClass}`} title={`Sentiment: ${r.reaction.sentiment}`}></span>
//                     </div>

//                     {/* Micro-Badge Stats Row */}
//                     <div className="flex flex-wrap items-center gap-2 mb-4">
//                       <div className="bg-[#0A0A0F]/50 border border-[#2A2A3E]/60 rounded px-2 py-1 flex items-center gap-1.5">
//                         <span className="text-[9px] uppercase tracking-widest text-[#8B8FA3]">Sentiment Score</span>
//                         <span className={`text-[11px] font-mono font-medium ${r.reaction.sentiment_score > 0 ? 'text-emerald-400' : r.reaction.sentiment_score < 0 ? 'text-rose-400' : 'text-amber-400'}`}>
//                           {r.reaction.sentiment_score > 0 ? '+' : ''}{r.reaction.sentiment_score}
//                         </span>
//                       </div>
//                       <div className="bg-[#0A0A0F]/50 border border-[#2A2A3E]/60 rounded px-2 py-1 flex items-center gap-1.5">
//                         <span className="text-[9px] uppercase tracking-widest text-[#8B8FA3]">Action</span>
//                         <span className="text-[11px] font-medium text-[#E2E8F0] capitalize">
//                           {r.reaction.behavioral_prediction.replace('_', ' ')}
//                         </span>
//                       </div>
//                       <div className="bg-[#0A0A0F]/50 border border-[#2A2A3E]/60 rounded px-2 py-1 flex items-center gap-1.5">
//                         <span className="text-[9px] uppercase tracking-widest text-[#8B8FA3]">Willing To Pay</span>
//                         <span className="text-[11px] font-mono font-medium text-[#E2E8F0]">${r.reaction.willingness_to_pay}</span>
//                       </div>
//                       <div className="bg-[#0A0A0F]/50 border border-[#2A2A3E]/60 rounded px-2 py-1 flex items-center gap-1.5">
//                         <span className="text-[9px] uppercase tracking-widest text-[#8B8FA3]">NPS</span>
//                         <span className="text-[11px] font-mono font-medium text-[#E2E8F0]">{r.reaction.likelihood_to_recommend}/10</span>
//                       </div>
//                     </div>

//                     {/* The Meat: Reasoning Quote */}
//                     <div className="bg-[#0A0A0F] rounded-lg p-5 border border-[#2A2A3E]/50 mb-4 flex-grow relative overflow-y-auto hide-scrollbar">
//                       <span className="absolute -top-1 -left-1 text-[28px] text-[#3B82F6]/20 font-serif leading-none">"</span>
//                       <p className="text-[15px] text-[#E2E8F0] font-light leading-relaxed italic relative z-10 pl-3">
//                         {r.reaction.reasoning}
//                       </p>
//                     </div>

//                     {/* Footer: Key Concern */}
//                     <div className="mt-auto bg-[#0A0A0F]/50 p-3 rounded-lg border border-[#2A2A3E]/30">
//                       <p className="text-[10px] font-bold text-[#555770] uppercase tracking-widest mb-1.5">Key Concern</p>
//                       <p className="text-[13px] text-[#8B8FA3] font-medium leading-snug line-clamp-2">
//                         {r.reaction.key_concern}
//                       </p>
//                     </div>

//                   </div>
//                 );
//               })}
//             </>
//           )}

//           {/* Left Arrow */}
//           <button 
//             onClick={handlePrev}
//             disabled={currentIndex === 0 || filteredReactions.length === 0}
//             className={`absolute left-2 md:left-4 z-40 p-3 rounded-full bg-[#1A1A2E]/90 border border-[#2A2A3E] backdrop-blur-md transition-all ${
//               currentIndex === 0 || filteredReactions.length === 0 ? 'opacity-0 cursor-default pointer-events-none' : 'hover:bg-[#2A2A3E] hover:scale-110 text-white shadow-xl cursor-pointer'
//             }`}
//           >
//             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>

//           {/* Right Arrow */}
//           <button 
//             onClick={handleNext}
//             disabled={currentIndex === filteredReactions.length - 1 || filteredReactions.length === 0}
//             className={`absolute right-2 md:right-4 z-40 p-3 rounded-full bg-[#1A1A2E]/90 border border-[#2A2A3E] backdrop-blur-md transition-all ${
//               currentIndex === filteredReactions.length - 1 || filteredReactions.length === 0 ? 'opacity-0 cursor-default pointer-events-none' : 'hover:bg-[#2A2A3E] hover:scale-110 text-white shadow-xl cursor-pointer'
//             }`}
//           >
//             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//           </button>
//         </div>

//         {/* Pagination Line / Dots */}
//         {filteredReactions.length > 0 && (
//           <div className="flex justify-center items-center space-x-2 mt-4">
//             {filteredReactions.map((_, idx) => (
//               <div 
//                 key={idx} 
//                 onClick={() => setCurrentIndex(idx)}
//                 className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
//                   idx === currentIndex ? 'w-8 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'w-2 bg-[#2A2A3E] hover:bg-[#555770]'
//                 }`}
//               />
//             ))}
//           </div>
//         )}

//       </div>

//     </div>
//   );
// }

import { useState, useMemo, useEffect } from 'react';
import { useOracusStore } from '../../store/useOracusStore';

const ARCHETYPE_COLORS = ['#6366f1', '#34d399', '#22d3ee', '#f43f5e', '#a855f7', '#fbbf24', '#f87171', '#38bdf8', '#c084fc', '#4ade80'];

export default function Tab4SimulationResults() {
  const { reactions, archetypes } = useOracusStore();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!reactions || reactions.length === 0) {
    return <div className="p-8 text-[#8B8FA3]">Loading simulation results...</div>;
  }

  const getArchetypeColor = (archetypeName: string) => {
    const index = archetypes.findIndex(a => a.archetype_name === archetypeName);
    return index >= 0 ? ARCHETYPE_COLORS[index % ARCHETYPE_COLORS.length] : '#8B8FA3';
  };

  // Helper to normalize sentiment strings from backend
  const normalizeSentiment = (s: string) => s?.toLowerCase().trim() || 'neutral';

  const sentimentStats = useMemo(() => {
    const total = reactions.length;
    const positive = reactions.filter(r => normalizeSentiment(r.reaction.sentiment) === 'positive').length;
    const mixed = reactions.filter(r => normalizeSentiment(r.reaction.sentiment) === 'mixed').length;
    const neutral = reactions.filter(r => normalizeSentiment(r.reaction.sentiment) === 'neutral').length;
    const negative = reactions.filter(r => normalizeSentiment(r.reaction.sentiment) === 'negative').length;

    return {
      total,
      positive: { count: positive, pct: (positive / total) * 100, color: 'bg-emerald-500', glow: 'shadow-[0_0_15px_#10B981]' },
      mixed: { count: mixed, pct: (mixed / total) * 100, color: 'bg-violet-500', glow: 'shadow-[0_0_15px_#8B5CF6]' },
      neutral: { count: neutral, pct: (neutral / total) * 100, color: 'bg-amber-500', glow: 'shadow-[0_0_15px_#F59E0B]' },
      negative: { count: negative, pct: (negative / total) * 100, color: 'bg-rose-500', glow: 'shadow-[0_0_15px_#F43F5E]' }
    };
  }, [reactions]);

  const behavioralStats = useMemo(() => {
    const growth = reactions.filter(r => ['adopt', 'increase_engagement'].includes(r.reaction.behavioral_prediction?.toLowerCase().trim())).length;
    const stable = reactions.filter(r => r.reaction.behavioral_prediction?.toLowerCase().trim() === 'maintain').length;
    const flight = reactions.filter(r => ['abandon', 'decrease_engagement'].includes(r.reaction.behavioral_prediction?.toLowerCase().trim())).length;

    return { growth, stable, flight };
  }, [reactions]);

  const filteredReactions = useMemo(() => {
    if (activeFilter === 'all') return reactions;
    return reactions.filter(r => normalizeSentiment(r.reaction.sentiment) === activeFilter);
  }, [reactions, activeFilter]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeFilter]);

  const handleNext = () => {
    if (currentIndex < filteredReactions.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const getCardStyles = (index: number) => {
    if (index === currentIndex) {
      return "left-1/2 -translate-x-1/2 scale-100 opacity-100 z-30 shadow-[0_0_40px_rgba(0,0,0,0.5)] pointer-events-auto";
    }
    if (index === currentIndex - 1) {
      return "left-[15%] -translate-x-1/2 scale-90 opacity-40 z-20 hover:opacity-70 blur-[1px] cursor-pointer";
    }
    if (index === currentIndex + 1) {
      return "left-[85%] -translate-x-1/2 scale-90 opacity-40 z-20 hover:opacity-70 blur-[1px] cursor-pointer";
    }
    if (index < currentIndex - 1) {
      return "left-[-20%] -translate-x-1/2 scale-75 opacity-0 z-0 pointer-events-none";
    }
    if (index > currentIndex + 1) {
      return "left-[120%] -translate-x-1/2 scale-75 opacity-0 z-0 pointer-events-none";
    }
  };

  const borderColors: Record<string, string> = {
    positive: 'border-emerald-500/30 shadow-[0_4px_20px_rgba(16,185,129,0.05)]',
    mixed: 'border-violet-500/30 shadow-[0_4px_20px_rgba(139,92,246,0.05)]',
    neutral: 'border-amber-500/30 shadow-[0_4px_20px_rgba(245,158,11,0.05)]',
    negative: 'border-rose-500/30 shadow-[0_4px_20px_rgba(244,63,94,0.05)]'
  };

  const dotColors: Record<string, string> = {
    positive: 'bg-emerald-500 shadow-[0_0_8px_#10B981]',
    mixed: 'bg-violet-500 shadow-[0_0_8px_#8B5CF6]',
    neutral: 'bg-amber-500 shadow-[0_0_8px_#F59E0B]',
    negative: 'bg-rose-500 shadow-[0_0_8px_#F43F5E]'
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500 pb-10">
      
      {/* Zone 1: The Macro Pulse */}
      <div className="bg-[#12121A] border border-[#2A2A3E] rounded-2xl p-7 shadow-lg">
        <div className="flex justify-between items-end mb-5">
          <div>
            <h2 className="text-[20px] font-semibold text-[#E2E8F0]">Market Pulse</h2>
            <p className="text-[14px] text-[#8B8FA3] mt-1">High-level emotional response to your proposed scenario.</p>
          </div>
        </div>

        <div className="w-full h-8 rounded-full overflow-hidden flex bg-[#0A0A0F] border border-[#2A2A3E] shadow-inner">
          <div style={{ width: `${sentimentStats.positive.pct}%` }} className={`${sentimentStats.positive.color} ${sentimentStats.positive.glow} relative group transition-all duration-500`}>
             <div className="absolute inset-0 hover:bg-white/20 transition-colors cursor-pointer" title={`${sentimentStats.positive.count} Positive`} />
          </div>
          <div style={{ width: `${sentimentStats.mixed.pct}%` }} className={`${sentimentStats.mixed.color} ${sentimentStats.mixed.glow} relative group transition-all duration-500 border-l border-[#12121A]/30`}>
             <div className="absolute inset-0 hover:bg-white/20 transition-colors cursor-pointer" title={`${sentimentStats.mixed.count} Mixed`} />
          </div>
          <div style={{ width: `${sentimentStats.neutral.pct}%` }} className={`${sentimentStats.neutral.color} ${sentimentStats.neutral.glow} relative group transition-all duration-500 border-l border-[#12121A]/30`}>
             <div className="absolute inset-0 hover:bg-white/20 transition-colors cursor-pointer" title={`${sentimentStats.neutral.count} Neutral`} />
          </div>
          <div style={{ width: `${sentimentStats.negative.pct}%` }} className={`${sentimentStats.negative.color} ${sentimentStats.negative.glow} relative group transition-all duration-500 border-l border-[#12121A]/30`}>
             <div className="absolute inset-0 hover:bg-white/20 transition-colors cursor-pointer" title={`${sentimentStats.negative.count} Negative`} />
          </div>
        </div>

        <div className="flex flex-wrap justify-between mt-5 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"></span>
            <span className="text-[13px] text-[#E2E8F0] font-medium">Positive ({sentimentStats.positive.pct.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_8px_#8B5CF6]"></span>
            <span className="text-[13px] text-[#E2E8F0] font-medium">Mixed ({sentimentStats.mixed.pct.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_#F59E0B]"></span>
            <span className="text-[13px] text-[#E2E8F0] font-medium">Neutral ({sentimentStats.neutral.pct.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#F43F5E]"></span>
            <span className="text-[13px] text-[#E2E8F0] font-medium">Negative ({sentimentStats.negative.pct.toFixed(0)}%)</span>
          </div>
        </div>
      </div>

      {/* Zone 2: The Behavioral Shift */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-emerald-950/20 backdrop-blur-md border border-emerald-500/20 rounded-xl p-6 shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none"></div>
          <h3 className="text-[12px] font-bold text-emerald-400 uppercase tracking-wider mb-2">Predicted Growth</h3>
          <div className="flex items-end gap-3 mb-2">
            <span className="text-[32px] font-bold text-emerald-50 leading-none">{behavioralStats.growth}</span>
            <span className="text-[14px] text-emerald-200/60 pb-1 font-medium">Personas</span>
          </div>
          <p className="text-[13px] text-emerald-100/70 font-light leading-relaxed">Will adopt the product or significantly increase engagement.</p>
        </div>

        <div className="bg-blue-950/20 backdrop-blur-md border border-blue-500/20 rounded-xl p-6 shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full pointer-events-none"></div>
          <h3 className="text-[12px] font-bold text-blue-400 uppercase tracking-wider mb-2">Status Quo</h3>
          <div className="flex items-end gap-3 mb-2">
            <span className="text-[32px] font-bold text-blue-50 leading-none">{behavioralStats.stable}</span>
            <span className="text-[14px] text-blue-200/60 pb-1 font-medium">Personas</span>
          </div>
          <p className="text-[13px] text-blue-100/70 font-light leading-relaxed">Will maintain their current usage levels despite the change.</p>
        </div>

        <div className="bg-rose-950/20 backdrop-blur-md border border-rose-500/20 rounded-xl p-6 shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-rose-500/10 blur-2xl rounded-full pointer-events-none"></div>
          <h3 className="text-[12px] font-bold text-rose-400 uppercase tracking-wider mb-2">Flight Risk</h3>
          <div className="flex items-end gap-3 mb-2">
            <span className="text-[32px] font-bold text-rose-50 leading-none">{behavioralStats.flight}</span>
            <span className="text-[14px] text-rose-200/60 pb-1 font-medium">Personas</span>
          </div>
          <p className="text-[13px] text-rose-100/70 font-light leading-relaxed">Highly likely to cancel or severely decrease engagement.</p>
        </div>
      </div>

      <hr className="border-[#2A2A3E]/60" />

      {/* Zone 3: Voice of the Market */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-[20px] font-semibold text-[#E2E8F0]">Direct Feedback Log</h2>
          
          <div className="flex bg-[#0A0A0F] border border-[#2A2A3E] rounded-lg p-1">
            <button onClick={() => setActiveFilter('all')} className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors ${activeFilter === 'all' ? 'bg-[#2A2A3E] text-white' : 'text-[#8B8FA3] hover:text-[#E2E8F0]'}`}>All</button>
            <button onClick={() => setActiveFilter('positive')} className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors ${activeFilter === 'positive' ? 'bg-emerald-500/20 text-emerald-400' : 'text-[#8B8FA3] hover:text-[#E2E8F0]'}`}>Positive</button>
            <button onClick={() => setActiveFilter('mixed')} className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors ${activeFilter === 'mixed' ? 'bg-violet-500/20 text-violet-400' : 'text-[#8B8FA3] hover:text-[#E2E8F0]'}`}>Mixed</button>
            <button onClick={() => setActiveFilter('neutral')} className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors ${activeFilter === 'neutral' ? 'bg-amber-500/20 text-amber-400' : 'text-[#8B8FA3] hover:text-[#E2E8F0]'}`}>Neutral</button>
            <button onClick={() => setActiveFilter('negative')} className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors ${activeFilter === 'negative' ? 'bg-rose-500/20 text-rose-400' : 'text-[#8B8FA3] hover:text-[#E2E8F0]'}`}>Negative</button>
          </div>
        </div>

        <div className="relative w-full h-[430px] flex items-center justify-center overflow-hidden py-4 rounded-xl">
          
          {filteredReactions.length === 0 ? (
            <div className="text-center py-10 text-[#8B8FA3]">
              No reactions match the selected filter.
            </div>
          ) : (
            <>
              {filteredReactions.map((r, index) => {
                const sentimentKey = normalizeSentiment(r.reaction.sentiment);
                const cardBorderClass = borderColors[sentimentKey] || 'border-[#2A2A3E]';
                const dotClass = dotColors[sentimentKey] || 'bg-gray-500';
                const archetypeColor = getArchetypeColor(r.persona.archetype_name);

                return (
                  <div 
                    key={index}
                    onClick={() => {
                      if (index === currentIndex - 1) handlePrev();
                      if (index === currentIndex + 1) handleNext();
                    }}
                    className={`absolute w-full max-w-2xl h-[380px] bg-[#12121A] border rounded-xl p-6 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${cardBorderClass} ${getCardStyles(index)}`}
                  >
                    
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-col gap-1">
                        <h4 className="text-[18px] font-bold text-[#E2E8F0]">{r.persona.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: archetypeColor, boxShadow: `0 0 6px ${archetypeColor}` }}></span>
                          <span className="text-[12px] text-[#A0A5C0] uppercase tracking-wider font-medium">{r.persona.archetype_name}</span>
                        </div>
                      </div>
                      <span className={`w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ${dotClass}`} title={`Sentiment: ${r.reaction.sentiment}`}></span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <div className="bg-[#0A0A0F]/50 border border-[#2A2A3E]/60 rounded px-2 py-1 flex items-center gap-1.5">
                        <span className="text-[9px] uppercase tracking-widest text-[#8B8FA3]">Sentiment Score</span>
                        <span className={`text-[11px] font-mono font-medium ${r.reaction.sentiment_score > 0 ? 'text-emerald-400' : r.reaction.sentiment_score < 0 ? 'text-rose-400' : 'text-amber-400'}`}>
                          {r.reaction.sentiment_score > 0 ? '+' : ''}{r.reaction.sentiment_score}
                        </span>
                      </div>
                      <div className="bg-[#0A0A0F]/50 border border-[#2A2A3E]/60 rounded px-2 py-1 flex items-center gap-1.5">
                        <span className="text-[9px] uppercase tracking-widest text-[#8B8FA3]">Action</span>
                        <span className="text-[11px] font-medium text-[#E2E8F0] capitalize">
                          {r.reaction.behavioral_prediction.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="bg-[#0A0A0F]/50 border border-[#2A2A3E]/60 rounded px-2 py-1 flex items-center gap-1.5">
                        <span className="text-[9px] uppercase tracking-widest text-[#8B8FA3]">Willing To Pay</span>
                        <span className="text-[11px] font-mono font-medium text-[#E2E8F0]">${r.reaction.willingness_to_pay}</span>
                      </div>
                      <div className="bg-[#0A0A0F]/50 border border-[#2A2A3E]/60 rounded px-2 py-1 flex items-center gap-1.5">
                        <span className="text-[9px] uppercase tracking-widest text-[#8B8FA3]">NPS</span>
                        <span className="text-[11px] font-mono font-medium text-[#E2E8F0]">{r.reaction.likelihood_to_recommend}/10</span>
                      </div>
                    </div>

                    <div className="bg-[#0A0A0F] rounded-lg p-5 border border-[#2A2A3E]/50 mb-4 flex-grow relative overflow-y-auto hide-scrollbar">
                      <span className="absolute -top-1 -left-1 text-[28px] text-[#3B82F6]/20 font-serif leading-none">"</span>
                      <p className="text-[15px] text-[#E2E8F0] font-light leading-relaxed italic relative z-10 pl-3">
                        {r.reaction.reasoning}
                      </p>
                    </div>

                    <div className="mt-auto bg-[#0A0A0F]/50 p-3 rounded-lg border border-[#2A2A3E]/30">
                      <p className="text-[10px] font-bold text-[#555770] uppercase tracking-widest mb-1.5">Key Concern</p>
                      <p className="text-[13px] text-[#8B8FA3] font-medium leading-snug line-clamp-2">
                        {r.reaction.key_concern}
                      </p>
                    </div>

                  </div>
                );
              })}
            </>
          )}

          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0 || filteredReactions.length === 0}
            className={`absolute left-2 md:left-4 z-40 p-3 rounded-full bg-[#1A1A2E]/90 border border-[#2A2A3E] backdrop-blur-md transition-all ${
              currentIndex === 0 || filteredReactions.length === 0 ? 'opacity-0 cursor-default pointer-events-none' : 'hover:bg-[#2A2A3E] hover:scale-110 text-white shadow-xl cursor-pointer'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button 
            onClick={handleNext}
            disabled={currentIndex === filteredReactions.length - 1 || filteredReactions.length === 0}
            className={`absolute right-2 md:right-4 z-40 p-3 rounded-full bg-[#1A1A2E]/90 border border-[#2A2A3E] backdrop-blur-md transition-all ${
              currentIndex === filteredReactions.length - 1 || filteredReactions.length === 0 ? 'opacity-0 cursor-default pointer-events-none' : 'hover:bg-[#2A2A3E] hover:scale-110 text-white shadow-xl cursor-pointer'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {filteredReactions.length > 0 && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            {filteredReactions.map((_, idx) => (
              <div 
                key={idx} 
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex ? 'w-8 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'w-2 bg-[#2A2A3E] hover:bg-[#555770]'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}