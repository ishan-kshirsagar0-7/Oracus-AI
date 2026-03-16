import { useOracusStore } from '../../store/useOracusStore';

// Helper to safely extract a number from LLM text for our visual rings
const extractNumber = (str: string, fallback: number) => {
  const match = str.match(/(\d+)/);
  return match ? parseInt(match[0], 10) : fallback;
};

export default function Tab2MarketLandscape() {
  const { demographicMap, baseline } = useOracusStore();

  if (!demographicMap || !baseline) return <div className="p-8 text-[#8B8FA3]">Loading market data...</div>;

  const churnNum = extractNumber(baseline.current_estimated_churn, 5);
  const npsNum = extractNumber(baseline.current_estimated_nps, 40);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Top Row: Executive Metrics with UX Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Metric 1: Churn Risk */}
        <div className="bg-rose-950/20 backdrop-blur-md border border-rose-500/20 rounded-2xl p-6 flex flex-col justify-center shadow-md relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-rose-500/10 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="flex items-center gap-6 mb-3">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="36" fill="transparent" stroke="#2D1215" strokeWidth="6" />
                <circle cx="40" cy="40" r="36" fill="transparent" stroke="#F43F5E" strokeWidth="6" strokeDasharray="226" strokeDashoffset={226 - (226 * churnNum) / 100} className="drop-shadow-[0_0_8px_rgba(244,63,94,0.6)] transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-rose-50 font-bold text-[18px]">{churnNum}%</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-[14px] font-bold text-rose-400 uppercase tracking-wider mb-1 drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]">Estimated Annual Churn</h3>
              <p className="text-[15px] text-rose-50 font-medium leading-snug">{baseline.current_estimated_churn}</p>
            </div>
          </div>
          
          {/* Added UX Context */}
          <div className="bg-rose-950/40 border border-rose-500/10 rounded-lg p-3 mt-1">
            <p className="text-[12px] text-rose-200/70 font-light leading-relaxed">
              <strong className="text-rose-200">What this means:</strong> Churn represents the percentage of your customer base expected to cancel or leave over the next year. A lower number is better.
            </p>
          </div>
        </div>

        {/* Metric 2: Market NPS */}
        <div className="bg-emerald-950/20 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-6 flex flex-col justify-center shadow-md relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="flex items-center gap-6 mb-3">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="36" fill="transparent" stroke="#022C22" strokeWidth="6" />
                <circle cx="40" cy="40" r="36" fill="transparent" stroke="#34D399" strokeWidth="6" strokeDasharray="226" strokeDashoffset={226 - (226 * (npsNum > 0 ? npsNum : 50)) / 100} className="drop-shadow-[0_0_8px_rgba(52,211,153,0.6)] transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-emerald-50 font-bold text-[18px]">+{npsNum}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-[14px] font-bold text-emerald-400 uppercase tracking-wider mb-1 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">Estimated Current NPS</h3>
              <p className="text-[15px] text-emerald-50 font-medium leading-snug">{baseline.current_estimated_nps}</p>
            </div>
          </div>

          {/* Added UX Context */}
          <div className="bg-emerald-950/40 border border-emerald-500/10 rounded-lg p-3 mt-1">
            <p className="text-[12px] text-emerald-200/70 font-light leading-relaxed">
              <strong className="text-emerald-200">What this means:</strong> Net Promoter Score (NPS) measures overall customer satisfaction and loyalty. Scores range from -100 to +100. Higher scores mean customers actively recommend your product.
            </p>
          </div>
        </div>
      </div>

      {/* Breaking News Ticker: Market Moves */}
      <div className="bg-amber-950/20 backdrop-blur-md border border-amber-500/30 rounded-xl p-5 shadow-md flex gap-4 items-start">
        <div className="mt-1 flex-shrink-0 animate-pulse">
          <svg className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div>
          <h3 className="text-[12px] font-bold text-amber-400 uppercase tracking-wider mb-1.5">Recent Market Moves</h3>
          <p className="text-[14px] text-amber-50 leading-relaxed font-light">{baseline.recent_market_moves}</p>
        </div>
      </div>

      {/* Deep Dive Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <div className="bg-violet-950/20 backdrop-blur-md border border-violet-500/20 rounded-xl p-6 shadow-md">
          <h3 className="text-[12px] font-bold text-violet-400 uppercase tracking-wider mb-4 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">Behavioral Segments</h3>
          <ul className="space-y-3">
            {demographicMap.behavioral_segments.map((seg, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[14px] text-violet-50 font-light">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 shadow-[0_0_8px_#8B5CF6]"></span>
                <span>{seg}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-cyan-950/20 backdrop-blur-md border border-cyan-500/20 rounded-xl p-6 shadow-md flex-grow">
            <h3 className="text-[12px] font-bold text-cyan-400 uppercase tracking-wider mb-2 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Price Sensitivity</h3>
            <p className="text-[14px] text-cyan-50 font-light leading-relaxed">{demographicMap.price_sensitivity}</p>
          </div>
          
          <div className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-6 shadow-md flex-grow">
            <h3 className="text-[12px] font-bold text-[#8B8FA3] uppercase tracking-wider mb-2">Geographic Trends</h3>
            <p className="text-[14px] text-[#E2E8F0] font-light leading-relaxed">{demographicMap.geographic_trends}</p>
          </div>
        </div>
      </div>
    </div>
  );
}