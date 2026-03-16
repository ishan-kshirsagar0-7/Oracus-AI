import { useOracusStore } from '../../store/useOracusStore';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#34d399', '#22d3ee', '#f43f5e', '#a855f7', '#fbbf24', '#f87171', '#38bdf8', '#c084fc', '#4ade80'];

export default function Tab3FocusGroup() {
  const { archetypes, personas } = useOracusStore();

  if (!archetypes.length || !personas.length) return <div className="p-8 text-[#8B8FA3]">Loading focus group...</div>;

  // Helper function to match a persona to its parent archetype's exact color
  const getArchetypeColor = (archetypeName: string) => {
    const index = archetypes.findIndex(a => a.archetype_name === archetypeName);
    return index >= 0 ? COLORS[index % COLORS.length] : '#8B8FA3';
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      
      {/* Top Section: UX Context + Recharts Donut */}
      <div className="bg-[#12121A] border border-[#2A2A3E] rounded-2xl p-6 sm:p-8 shadow-lg">
        
        {/* Context Header */}
        <div className="mb-8 border-b border-[#2A2A3E] pb-6">
          <h2 className="text-[20px] font-semibold text-[#E2E8F0] mb-2">Market Archetypes Explained</h2>
          <p className="text-[14px] text-[#8B8FA3] leading-relaxed">
            Instead of testing your idea on random users, we mathematically grouped your target market into specific <strong className="text-[#E2E8F0]">Archetypes</strong> based on real-world demographics. The percentages below represent exactly how much of your total user base each group makes up, ensuring our simulation remains statistically accurate to reality.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* The Chart */}
          <div className="w-full md:w-1/3 h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={archetypes}
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="weight_percentage"
                  nameKey="archetype_name"
                  stroke="none"
                >
                  {archetypes.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: `drop-shadow(0px 0px 6px ${COLORS[index % COLORS.length]}80)` }} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A0F', borderColor: '#2A2A3E', borderRadius: '8px', color: '#E2E8F0' }}
                  itemStyle={{ color: '#E2E8F0' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[28px] font-bold text-white leading-none">{personas.length}</span>
              <span className="text-[11px] text-[#8B8FA3] font-bold uppercase tracking-widest mt-1">Personas</span>
            </div>
          </div>

          {/* The Legend / Details */}
          <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            {archetypes.map((arch, idx) => (
              <div key={idx} className="flex items-start justify-between bg-[#0A0A0F] border border-[#2A2A3E] rounded-lg p-3 hover:bg-[#1A1A2E]/50 transition-colors">
                <div className="flex items-start gap-3 pr-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: COLORS[idx % COLORS.length], boxShadow: `0 0 8px ${COLORS[idx % COLORS.length]}` }}></div>
                  <span className="text-[13px] text-[#E2E8F0] font-medium leading-snug">{arch.archetype_name}</span>
                </div>
                <span className="text-[12px] font-bold text-[#E2E8F0] bg-[#1A1A2E] px-2 py-1 rounded border border-[#2A2A3E] flex-shrink-0">{arch.weight_percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: ID Dossier Cards */}
      <div>
        <div className="mb-6">
          <h3 className="text-[20px] font-semibold text-[#E2E8F0] flex items-center gap-2 mb-2">
            <span className="text-[22px]">🪪</span> AI Participant Dossiers
          </h3>
          <p className="text-[14px] text-[#8B8FA3]">
            These are the individually simulated volunteers drawn from the archetypes above. They are the exact agents who will provide direct, unbiased feedback on the changes you proposed.
          </p>
        </div>
        
        {/* Dynamic Glassmorphic Grid of Personas */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {personas.slice(0, 6).map((p) => {
            const cardColor = getArchetypeColor(p.archetype_name);
            
            return (
              <div 
                key={p.persona_id} 
                className="rounded-xl overflow-hidden shadow-md flex flex-col relative group transition-all"
                style={{
                  backgroundColor: `${cardColor}15`, // 15 is roughly 8% opacity in hex
                  borderColor: `${cardColor}40`,     // 40 is roughly 25% opacity in hex
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  boxShadow: `inset 0 0 20px ${cardColor}10, 0 4px 15px rgba(0,0,0,0.2)`
                }}
              >
                <div className="p-5 pl-6 flex-grow flex flex-col">
                  
                  {/* Header: Name & ID Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-[17px] font-bold text-[#E2E8F0] mb-1">{p.name}</h4>
                      <span className="text-[10px] text-[#555770] font-mono tracking-widest uppercase bg-[#0A0A0F] px-2 py-0.5 rounded border border-[#2A2A3E]">
                        ID: {p.persona_id.split('-')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Clean Demographics Row with Dynamic Color Icons */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5 border-b border-[#2A2A3E]/50 pb-4">
                    <div className="flex items-center gap-1.5 text-[12.5px] text-[#E2E8F0]">
                      <svg style={{ color: cardColor }} className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {p.age} yrs
                    </div>
                    <div className="flex items-center gap-1.5 text-[12.5px] text-[#E2E8F0]">
                      <svg style={{ color: cardColor }} className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {p.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-[12.5px] text-[#E2E8F0]">
                      <svg style={{ color: cardColor }} className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ${p.income.toLocaleString()}
                    </div>
                  </div>
                  
                  {/* Structured Tags (Kept Neutral) */}
                  <div className="flex flex-col gap-2.5 mb-6">
                    <div className="flex items-start gap-3">
                      <span className="text-[10px] uppercase tracking-wider text-[#555770] w-14 pt-0.5">Profile</span>
                      <span className="bg-[#1A1A2E] text-[#A0A5C0] text-[11.5px] px-2.5 py-0.5 rounded-md font-medium leading-snug">{p.archetype_name}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[10px] uppercase tracking-wider text-[#555770] w-14 pt-0.5">Status</span>
                      <span className="bg-[#1A1A2E] text-[#A0A5C0] text-[11.5px] px-2.5 py-0.5 rounded-md font-medium">{p.customer_status}</span>
                    </div>
                  </div>

                  {/* Anchored Footer: Pain Point */}
                  <div className="mt-auto pt-4 border-t border-[#2A2A3E]/30">
                    <p className="text-[10px] font-bold text-[#EF4444] uppercase tracking-widest mb-1.5 flex items-center gap-1.5 opacity-80">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Core Friction
                    </p>
                    <p className="text-[13.5px] text-[#E2E8F0] font-light leading-snug italic line-clamp-2" title={p.core_pain_points[0]}>
                      "{p.core_pain_points[0]}"
                    </p>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
        
        {personas.length > 6 && (
          <div className="mt-8 flex items-center justify-center">
            <span className="bg-[#12121A] border border-[#2A2A3E] text-[#8B8FA3] text-[13px] px-6 py-2 rounded-full font-medium">
              + {personas.length - 6} additional personas actively simulated in the background.
            </span>
          </div>
        )}
      </div>

    </div>
  );
}