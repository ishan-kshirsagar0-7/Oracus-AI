import { useOracusStore } from '../../store/useOracusStore';

export default function Tab1CompanyIntel() {
  const { companyProfile } = useOracusStore();

  if (!companyProfile) return null;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Hero Context Card with sweeping radial gradient */}
      <div className="bg-gradient-to-br from-[#1A1A2E] to-[#12121A] border border-[#2A2A3E] rounded-2xl p-8 shadow-lg relative overflow-hidden">
        {/* Massive subtle blue glow behind the text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10">
          <h2 className="text-[24px] font-semibold text-[#E2E8F0] mb-3">Context & Intelligence</h2>
          <p className="text-[15px] text-[#A0A5C0] leading-relaxed max-w-[850px] font-light">
            {companyProfile.product_description}
          </p>
        </div>
      </div>

      {/* Vibrant Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Indigo Target Audience */}
        <div className="bg-indigo-950/20 backdrop-blur-md border border-indigo-500/20 rounded-xl p-6 hover:bg-indigo-950/30 transition-all shadow-md group">
          <h3 className="text-[12px] font-bold text-indigo-400 uppercase tracking-wider mb-4 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">Target Audience</h3>
          <p className="text-[14.5px] text-indigo-50 leading-relaxed font-light">{companyProfile.target_audience}</p>
        </div>

        {/* Emerald Pricing Model */}
        <div className="bg-emerald-950/20 backdrop-blur-md border border-emerald-500/20 rounded-xl p-6 hover:bg-emerald-950/30 transition-all shadow-md group">
          <h3 className="text-[12px] font-bold text-emerald-400 uppercase tracking-wider mb-4 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">Pricing Model</h3>
          <p className="text-[14.5px] text-emerald-50 leading-relaxed font-light">{companyProfile.pricing_model}</p>
        </div>

        {/* Cyan Core Pain Points */}
        <div className="bg-cyan-950/10 backdrop-blur-md border border-cyan-500/20 rounded-xl p-7 shadow-md md:col-span-2">
          <h3 className="text-[12px] font-bold text-cyan-400 uppercase tracking-wider mb-5 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Core Pain Points Solved</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {companyProfile.core_pain_points_solved.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[14.5px] text-cyan-50 font-light">
                <svg className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12a4 4 0 108 0 4 4 0 00-8 0zm4 8c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
                </svg>
                <span className="leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Electric Blue Products */}
        <div className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-6 shadow-md">
          <h3 className="text-[12px] font-bold text-[#555770] uppercase tracking-wider mb-5">Products & Services</h3>
          <div className="flex flex-wrap gap-2.5">
            {companyProfile.list_of_products.map((product, idx) => (
              <span key={idx} className="bg-blue-950/40 text-blue-300 border border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.15)] rounded-full px-3.5 py-1.5 text-[13px] font-medium tracking-wide">
                {product}
              </span>
            ))}
          </div>
        </div>

        {/* Glowing Rose Competitors */}
        <div className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-6 shadow-md">
          <h3 className="text-[12px] font-bold text-[#555770] uppercase tracking-wider mb-5">Key Competitors</h3>
          <div className="flex flex-wrap gap-2.5">
            {companyProfile.key_competitors.map((comp, idx) => (
              <span key={idx} className="bg-rose-950/30 text-rose-300 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.15)] rounded-full px-3.5 py-1.5 text-[13px] font-medium tracking-wide">
                {comp}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}