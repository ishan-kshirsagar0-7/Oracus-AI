import { useEffect, useState } from 'react';

interface SimulationLoadingProps {
  phase: string;
}

const PHASE_DATA: Record<string, { title: string; tip: string; icon: 'scan' | 'personas' | 'metrics' | 'strategy' }> = {
  'Phase 1/4': {
    title: 'Building Your Focus Group',
    tip: 'Oracus is generating your AI focus group — diverse personas modeled on real-world demographic data, not random profiles. Each archetype is weighted to reflect the actual composition of this company\'s customer base.',
    icon: 'scan',
  },
  'Phase 2/4': {
    title: 'Simulating Individual Reactions',
    tip: 'Each persona independently evaluates your scenario based on their income, habits, and pain points — just like a real focus group participant. No two reactions are alike because no two customers are alike.',
    icon: 'personas',
  },
  'Phase 3/4': {
    title: 'Crunching Market Intelligence',
    tip: 'We compute 14 market indicators including NPS, churn risk, loyalty paradox rate, and income-sentiment correlation. Simultaneously, we fetch your company\'s real-world baseline to ground our predictions in reality.',
    icon: 'metrics',
  },
  'Phase 4/4': {
    title: 'Generating Strategic Playbook',
    tip: 'Our strategic advisor compares simulated outcomes against your company\'s current metrics to deliver profit-optimized, segment-specific recommendations — the kind of analysis that typically costs thousands from a consulting firm.',
    icon: 'strategy',
  },
};

function getPhaseKey(phase: string): string {
  for (const key of Object.keys(PHASE_DATA)) {
    if (phase.startsWith(key)) return key;
  }
  return 'Phase 1/4';
}

export default function SimulationLoading({ phase }: SimulationLoadingProps) {
  const [fadeIn, setFadeIn] = useState(false);
  const [prevPhaseKey, setPrevPhaseKey] = useState('');

  const phaseKey = getPhaseKey(phase);
  const data = PHASE_DATA[phaseKey] || PHASE_DATA['Phase 1/4'];

  // Trigger fade transition when phase changes
  useEffect(() => {
    if (phaseKey !== prevPhaseKey) {
      setFadeIn(false);
      const timeout = setTimeout(() => {
        setFadeIn(true);
        setPrevPhaseKey(phaseKey);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [phaseKey, prevPhaseKey]);

  // Initial mount fade
  useEffect(() => {
    const timeout = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center max-w-[560px] text-center">

      {/* Animated Icon Area */}
      <div className={`mb-8 transition-all duration-500 ${fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        {data.icon === 'scan' && <ScanAnimation />}
        {data.icon === 'personas' && <PersonasAnimation />}
        {data.icon === 'metrics' && <MetricsAnimation />}
        {data.icon === 'strategy' && <StrategyAnimation />}
      </div>

      {/* Phase Indicator Dots */}
      <div className="flex items-center gap-3 mb-6">
        {['Phase 1/4', 'Phase 2/4', 'Phase 3/4', 'Phase 4/4'].map((p, idx) => {
          const isActive = p === phaseKey;
          const isPast = Object.keys(PHASE_DATA).indexOf(p) < Object.keys(PHASE_DATA).indexOf(phaseKey);
          return (
            <div key={idx} className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                isActive
                  ? 'bg-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.8)] scale-125'
                  : isPast
                    ? 'bg-[#3B82F6]/50'
                    : 'bg-[#2A2A3E]'
              }`} />
              {idx < 3 && (
                <div className={`w-8 h-[2px] rounded-full transition-all duration-500 ${
                  isPast ? 'bg-[#3B82F6]/40' : 'bg-[#2A2A3E]'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Title & Tip */}
      <div className={`transition-all duration-500 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
        <h2 className="text-[22px] font-semibold text-[#E2E8F0] mb-3">{data.title}</h2>
        <p className="text-[15px] text-[#8B8FA3] leading-relaxed font-light mb-6">{data.tip}</p>
      </div>

      {/* Raw Phase Text */}
      <p className="text-[13px] text-[#555770] bg-[#0A0A0F] px-4 py-2 rounded-full border border-[#2A2A3E] mb-3">
        {phase}
      </p>

      <p className="text-[12px] text-[#555770]/60">
        This usually takes 60–90 seconds. Do not close this window.
      </p>
    </div>
  );
}


/* ============ ANIMATED ICONS ============ */

function ScanAnimation() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      {/* Outer ring - slow spin */}
      <div className="absolute inset-0 rounded-full border-2 border-[#3B82F6]/20 animate-[spin_8s_linear_infinite]" />
      {/* Middle ring - medium spin reverse */}
      <div className="absolute inset-3 rounded-full border-2 border-dashed border-[#3B82F6]/30 animate-[spin_5s_linear_infinite_reverse]" />
      {/* Inner ring - fast pulse */}
      <div className="absolute inset-6 rounded-full border-2 border-[#3B82F6]/40 animate-pulse" />
      {/* Center dot */}
      <div className="w-4 h-4 rounded-full bg-[#3B82F6] shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-pulse" />
      {/* Sweep line */}
      <div className="absolute top-1/2 left-1/2 w-12 h-[2px] bg-gradient-to-r from-[#3B82F6] to-transparent origin-left animate-[spin_3s_linear_infinite]" />
    </div>
  );
}

function PersonasAnimation() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      {/* Grid of appearing dots representing personas */}
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-[#3B82F6] animate-pulse"
            style={{
              animationDelay: `${i * 150}ms`,
              opacity: 0.3 + (i % 4) * 0.2,
              boxShadow: `0 0 ${8 + (i % 3) * 4}px rgba(59,130,246,${0.2 + (i % 4) * 0.1})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MetricsAnimation() {
  return (
    <div className="relative w-24 h-24 flex items-end justify-center gap-1.5 pb-2">
      {/* Animated bar chart */}
      {[40, 65, 30, 80, 55, 45, 70].map((height, i) => (
        <div
          key={i}
          className="w-2.5 rounded-t-sm bg-[#3B82F6] animate-pulse"
          style={{
            height: `${height}%`,
            animationDelay: `${i * 200}ms`,
            opacity: 0.4 + (i % 3) * 0.2,
            boxShadow: '0 0 8px rgba(59,130,246,0.3)',
          }}
        />
      ))}
      {/* Base line */}
      <div className="absolute bottom-2 left-0 right-0 h-[1px] bg-[#2A2A3E]" />
    </div>
  );
}

function StrategyAnimation() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      {/* Converging lines to a center point - representing synthesis */}
      <svg width="96" height="96" viewBox="0 0 96 96" className="animate-pulse">
        {/* Outer points converging to center */}
        <line x1="10" y1="10" x2="48" y2="48" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" begin="0s" />
        </line>
        <line x1="86" y1="10" x2="48" y2="48" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" begin="0.3s" />
        </line>
        <line x1="10" y1="86" x2="48" y2="48" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" begin="0.6s" />
        </line>
        <line x1="86" y1="86" x2="48" y2="48" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" begin="0.9s" />
        </line>
        <line x1="48" y1="5" x2="48" y2="48" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" begin="1.2s" />
        </line>
        <line x1="48" y1="91" x2="48" y2="48" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" begin="1.5s" />
        </line>
        {/* Outer dots */}
        <circle cx="10" cy="10" r="3" fill="#3B82F6" opacity="0.4" />
        <circle cx="86" cy="10" r="3" fill="#3B82F6" opacity="0.4" />
        <circle cx="10" cy="86" r="3" fill="#3B82F6" opacity="0.4" />
        <circle cx="86" cy="86" r="3" fill="#3B82F6" opacity="0.4" />
        <circle cx="48" cy="5" r="3" fill="#3B82F6" opacity="0.4" />
        <circle cx="48" cy="91" r="3" fill="#3B82F6" opacity="0.4" />
        {/* Center convergence point */}
        <circle cx="48" cy="48" r="6" fill="#3B82F6">
          <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}