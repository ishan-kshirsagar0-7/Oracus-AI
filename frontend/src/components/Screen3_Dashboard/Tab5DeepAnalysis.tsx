import { useOracusStore } from '../../store/useOracusStore';

const STATUS_STYLES: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  critical_risk: { bg: 'bg-rose-950/20', border: 'border-rose-500/30', text: 'text-rose-400', glow: 'shadow-[0_0_8px_rgba(244,63,94,0.3)]' },
  at_risk: { bg: 'bg-amber-950/20', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-[0_0_8px_rgba(245,158,11,0.3)]' },
  neutral: { bg: 'bg-slate-800/20', border: 'border-slate-500/30', text: 'text-slate-400', glow: '' },
  positive: { bg: 'bg-emerald-950/20', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-[0_0_8px_rgba(52,211,153,0.3)]' },
  strong_positive: { bg: 'bg-emerald-950/30', border: 'border-emerald-400/40', text: 'text-emerald-300', glow: 'shadow-[0_0_12px_rgba(52,211,153,0.4)]' },
};

const STATUS_LABELS: Record<string, string> = {
  critical_risk: 'Critical Risk',
  at_risk: 'At Risk',
  neutral: 'Neutral',
  positive: 'Positive',
  strong_positive: 'Strong Positive',
};

export default function Tab5DeepAnalysis() {
  const { metrics, voices, diagnosticReport, baseline } = useOracusStore();

  if (!metrics || !diagnosticReport) {
    return <div className="p-8 text-[#8B8FA3]">Loading deep analysis...</div>;
  }

  const gm = metrics.global_metrics;
  const sm = metrics.segment_metrics;

  const statusOrder = ['critical_risk', 'at_risk', 'neutral', 'positive', 'strong_positive'];
  const sortedClassifications = [...diagnosticReport.segment_classifications].sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  );

  const npsPosition = ((gm.net_promoter_score + 100) / 200) * 100;

  const sentimentColor = (val: number) => val > 0.2 ? 'text-emerald-400' : val < -0.2 ? 'text-rose-400' : 'text-amber-400';
  const churnColor = (val: number) => val > 0.3 ? 'text-rose-400' : val > 0.15 ? 'text-amber-400' : 'text-emerald-400';
  const correlationLabel = (val: number) => {
    const abs = Math.abs(val);
    if (abs > 0.5) return 'Strong';
    if (abs > 0.3) return 'Moderate';
    return 'Weak';
  };

  // Strip markdown formatting from theme labels
  const cleanThemeLabel = (label: string) => label.replace(/\*\*/g, '').replace(/\*/g, '').trim();

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10">

      {/* ============ ZONE 1: SITUATION ASSESSMENT ============ */}
      <div className="bg-[#12121A] border border-[#2A2A3E] rounded-2xl p-7 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#3B82F6] rounded-l-2xl"></div>

        <div className="pl-4">
          <h2 className="text-[22px] font-semibold text-[#E2E8F0] mb-4">Executive Diagnostic</h2>
          <p className="text-[16px] text-[#A0A5C0] leading-relaxed font-light max-w-[850px]">
            {diagnosticReport.situation_assessment}
          </p>

          {/* Headline Findings */}
          <div className="mt-6">
            <p className="text-[13px] text-[#555770] font-semibold uppercase tracking-wider mb-3">Key Findings</p>
            <div className="flex flex-col gap-2.5">
              {diagnosticReport.headline_findings.map((finding, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-[13px] font-bold text-[#3B82F6] mt-0.5 flex-shrink-0 w-5 text-right">{idx + 1}.</span>
                  <span className="bg-[#0A0A0F] border border-[#2A2A3E] text-[#E2E8F0] text-[14px] font-medium px-4 py-2.5 rounded-lg leading-snug">
                    {finding}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============ ZONE 2: THE NUMBERS GRID ============ */}
      <div>
        <h2 className="text-[20px] font-semibold text-[#E2E8F0] mb-5 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Quantitative Indicators
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {/* NPS Gauge */}
          <div className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-6 shadow-md col-span-1 md:col-span-2 xl:col-span-2">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-[13px] font-bold text-[#8B8FA3] uppercase tracking-wider mb-1">Net Promoter Score</h3>
                <span className={`text-[32px] font-bold ${gm.net_promoter_score > 30 ? 'text-emerald-400' : gm.net_promoter_score > 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {gm.net_promoter_score > 0 ? '+' : ''}{gm.net_promoter_score}
                </span>
              </div>
              {baseline?.current_estimated_nps && baseline.current_estimated_nps !== 'UNKNOWN' && (
                <div className="text-right">
                  <p className="text-[11px] text-[#555770] uppercase tracking-wider">Baseline</p>
                  <p className="text-[16px] text-[#8B8FA3] font-medium">+{baseline.current_estimated_nps}</p>
                </div>
              )}
            </div>

            <div className="relative w-full h-3 rounded-full overflow-hidden bg-gradient-to-r from-rose-500/30 via-amber-500/30 to-emerald-500/30 mt-2">
              <div className="absolute top-1/2 -translate-y-1/2 w-full h-[1px] bg-[#2A2A3E]"></div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.6)] transition-all duration-1000"
                style={{ left: `calc(${Math.max(2, Math.min(98, npsPosition))}% - 8px)` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[11px] text-rose-400/60">-100</span>
              <span className="text-[11px] text-[#555770]">0</span>
              <span className="text-[11px] text-emerald-400/60">+100</span>
            </div>

            <p className="text-[14px] text-[#A0A5C0] mt-3 font-light leading-relaxed">
              Measures overall customer advocacy. Scores above 30 indicate strong loyalty. Negative scores signal widespread dissatisfaction.
            </p>
          </div>

          {/* Churn Risk */}
          <div className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-6 shadow-md">
            <h3 className="text-[13px] font-bold text-[#8B8FA3] uppercase tracking-wider mb-3">Churn Risk Rate</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" fill="transparent" stroke="#2A2A3E" strokeWidth="5" />
                  <circle
                    cx="32" cy="32" r="28" fill="transparent"
                    stroke={gm.churn_risk_rate > 0.3 ? '#F43F5E' : gm.churn_risk_rate > 0.15 ? '#F59E0B' : '#10B981'}
                    strokeWidth="5" strokeDasharray="176" strokeDashoffset={176 - (176 * gm.churn_risk_rate)}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                    style={{ filter: `drop-shadow(0 0 6px ${gm.churn_risk_rate > 0.3 ? '#F43F5E' : gm.churn_risk_rate > 0.15 ? '#F59E0B' : '#10B981'})` }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-[16px] font-bold ${churnColor(gm.churn_risk_rate)}`}>{(gm.churn_risk_rate * 100).toFixed(0)}%</span>
                </div>
              </div>
              <div>
                <p className="text-[15px] text-[#E2E8F0] font-medium">
                  {(gm.churn_risk_rate * 100).toFixed(0)}% of existing users at risk
                </p>
                {baseline?.current_estimated_churn && baseline.current_estimated_churn !== 'UNKNOWN' && (
                  <p className="text-[13px] text-[#555770] mt-1">Baseline: {baseline.current_estimated_churn}</p>
                )}
              </div>
            </div>
          </div>

          {/* Polarization */}
          <div className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-6 shadow-md">
            <h3 className="text-[13px] font-bold text-[#8B8FA3] uppercase tracking-wider mb-3">Market Polarization</h3>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-[32px] font-bold ${gm.is_highly_polarized_bimodal ? 'text-rose-400' : 'text-emerald-400'}`}>
                {gm.polarization_index_std_dev}
              </span>
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                gm.is_highly_polarized_bimodal
                  ? 'bg-rose-950/30 text-rose-400 border border-rose-500/30'
                  : 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/30'
              }`}>
                {gm.is_highly_polarized_bimodal ? 'Bimodal Split' : 'Consensus'}
              </span>
            </div>
            {gm.is_highly_polarized_bimodal && (
              <div className="flex gap-1 mt-3">
                <div className="h-6 rounded-l-full bg-emerald-500/40" style={{ width: `${(gm.sentiment_distribution?.positive || 0) * 100}%` }}></div>
                <div className="h-6 bg-[#2A2A3E] flex-grow"></div>
                <div className="h-6 rounded-r-full bg-rose-500/40" style={{ width: `${(gm.sentiment_distribution?.negative || 0) * 100}%` }}></div>
              </div>
            )}
            <p className="text-[14px] text-[#A0A5C0] mt-3 font-light leading-relaxed">
              {gm.is_highly_polarized_bimodal
                ? 'Your market is deeply divided — strong lovers and strong haters with little middle ground.'
                : 'Market response is relatively unified with moderate agreement across segments.'}
            </p>
          </div>

          {/* Loyalty Paradox */}
          <div className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-6 shadow-md">
            <h3 className="text-[13px] font-bold text-[#8B8FA3] uppercase tracking-wider mb-3">Loyalty Paradox</h3>
            <span className={`text-[32px] font-bold ${gm.loyalty_paradox_rate > 0.15 ? 'text-rose-400' : gm.loyalty_paradox_rate > 0.05 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {(gm.loyalty_paradox_rate * 100).toFixed(0)}%
            </span>
            <p className="text-[14px] text-[#A0A5C0] mt-3 font-light leading-relaxed">
              of your most loyal customers reacted negatively to this change.
            </p>
          </div>

          {/* Income-Sentiment Correlation */}
          <div className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-6 shadow-md">
            <h3 className="text-[13px] font-bold text-[#8B8FA3] uppercase tracking-wider mb-3">Income vs. Sentiment</h3>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-[32px] font-bold ${sentimentColor(gm.income_sentiment_correlation)}`}>
                {gm.income_sentiment_correlation > 0 ? '+' : ''}{gm.income_sentiment_correlation}
              </span>
              <span className="text-[12px] text-[#8B8FA3] font-medium bg-[#0A0A0F] px-2.5 py-1 rounded border border-[#2A2A3E]">
                {correlationLabel(gm.income_sentiment_correlation)} {gm.income_sentiment_correlation > 0 ? 'positive' : 'negative'}
              </span>
            </div>
            <p className="text-[14px] text-[#A0A5C0] mt-3 font-light leading-relaxed">
              {gm.income_sentiment_correlation > 0.3
                ? 'Higher-income users respond more favorably. This change disproportionately alienates budget-conscious segments.'
                : gm.income_sentiment_correlation < -0.3
                  ? 'Lower-income users respond more favorably. Premium segments may see this as a downgrade.'
                  : 'Income has minimal influence on sentiment. Reactions are driven by factors other than affordability.'}
            </p>
          </div>

          {/* Revenue-Weighted Sentiment */}
          <div className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-6 shadow-md">
            <h3 className="text-[13px] font-bold text-[#8B8FA3] uppercase tracking-wider mb-3">Revenue-Weighted Sentiment</h3>
            <span className={`text-[32px] font-bold ${sentimentColor(gm.revenue_weighted_sentiment)}`}>
              {gm.revenue_weighted_sentiment > 0 ? '+' : ''}{gm.revenue_weighted_sentiment}
            </span>
            <p className="text-[14px] text-[#A0A5C0] mt-3 font-light leading-relaxed">
              {gm.revenue_weighted_sentiment > 0
                ? 'Sentiment is positive when weighted by spending power — your highest-value customers are on board.'
                : gm.revenue_weighted_sentiment < -0.1
                  ? 'Even high-value customers are turning against this change — significant revenue risk.'
                  : 'Revenue-weighted sentiment is flat — high-value and low-value customers are reacting similarly.'}
            </p>
          </div>

          {/* Growth Signals */}
          <div className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-6 shadow-md">
            <h3 className="text-[13px] font-bold text-[#8B8FA3] uppercase tracking-wider mb-3">Growth Signals</h3>
            <div className="flex gap-6">
              <div>
                <p className="text-[11px] text-[#555770] uppercase tracking-wider mb-1">Acquisition</p>
                <span className={`text-[26px] font-bold ${gm.acquisition_potential > 0.05 ? 'text-emerald-400' : 'text-[#555770]'}`}>
                  {(gm.acquisition_potential * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-px bg-[#2A2A3E]"></div>
              <div>
                <p className="text-[11px] text-[#555770] uppercase tracking-wider mb-1">Win-Back</p>
                <span className={`text-[26px] font-bold ${gm.win_back_rate > 0.05 ? 'text-emerald-400' : 'text-[#555770]'}`}>
                  {(gm.win_back_rate * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <p className="text-[14px] text-[#A0A5C0] mt-3 font-light leading-relaxed">
              {gm.acquisition_potential === 0 && gm.win_back_rate === 0
                ? 'This change attracts no new customers and wins back no lapsed users.'
                : `${(gm.acquisition_potential * 100).toFixed(0)}% of prospects would join, ${(gm.win_back_rate * 100).toFixed(0)}% of lapsed users would return.`}
            </p>
          </div>

        </div>
      </div>

      {/* ============ ZONE 3: SEGMENT RISK MATRIX ============ */}
      <div>
        <h2 className="text-[20px] font-semibold text-[#E2E8F0] mb-5 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Segment Risk Matrix
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedClassifications.map((seg, idx) => {
            const style = STATUS_STYLES[seg.status] || STATUS_STYLES.neutral;
            const segMetrics = sm[seg.segment_name];

            return (
              <div
                key={idx}
                className={`${style.bg} backdrop-blur-md border ${style.border} rounded-xl p-5 shadow-md ${style.glow} transition-all hover:scale-[1.01]`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-[16px] font-semibold text-[#E2E8F0]">{seg.segment_name}</h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${style.border} ${style.text} ${style.bg}`}>
                    {STATUS_LABELS[seg.status] || seg.status}
                  </span>
                </div>

                <p className="text-[14px] text-[#A0A5C0] font-light leading-relaxed mb-4">
                  {seg.headline}
                </p>

                {segMetrics && (
                  <div className="flex flex-wrap gap-3 pt-3 border-t border-[#2A2A3E]/40">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-[#555770] uppercase tracking-wider">Size</span>
                      <span className="text-[13px] text-[#E2E8F0] font-medium">{(segMetrics.size_percentage * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-[#555770] uppercase tracking-wider">Sentiment</span>
                      <span className={`text-[13px] font-medium ${sentimentColor(segMetrics.avg_sentiment)}`}>
                        {segMetrics.avg_sentiment > 0 ? '+' : ''}{segMetrics.avg_sentiment.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-[#555770] uppercase tracking-wider">Churn</span>
                      <span className={`text-[13px] font-medium ${churnColor(segMetrics.churn_rate)}`}>
                        {(segMetrics.churn_rate * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-[#555770] uppercase tracking-wider">WTP</span>
                      <span className="text-[13px] font-medium text-[#E2E8F0]">
                        {typeof segMetrics.median_willingness_to_pay === 'number'
                          ? `$${segMetrics.median_willingness_to_pay.toFixed(2)}`
                          : segMetrics.median_willingness_to_pay}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============ ZONE 4: CLUSTERED VOICES ============ */}
      {voices && Object.keys(voices).length > 0 && (
        <div>
          <h2 className="text-[20px] font-semibold text-[#E2E8F0] mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Dominant Market Themes
          </h2>
          <p className="text-[14px] text-[#8B8FA3] mb-5 font-light">
            AI-clustered representative voices — each theme represents a distinct pattern of reasoning identified across the simulated population.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Object.entries(voices).map(([theme, quote], idx) => (
              <div
                key={idx}
                className="bg-[#12121A] border border-[#2A2A3E] rounded-xl p-6 shadow-md hover:bg-[#1A1A2E]/50 transition-colors"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                  <h3 className="text-[16px] font-semibold text-[#E2E8F0]">{cleanThemeLabel(theme)}</h3>
                </div>

                <div className="bg-[#0A0A0F] rounded-lg p-5 border border-[#2A2A3E]/50 relative">
                  <span className="absolute -top-1 -left-1 text-[24px] text-[#3B82F6]/20 font-serif leading-none">"</span>
                  <p className="text-[14px] text-[#A0A5C0] font-light leading-relaxed italic pl-3">
                    {quote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}