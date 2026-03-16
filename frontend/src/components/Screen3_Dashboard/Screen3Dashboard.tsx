import { useState } from 'react';
import { useOracusStore } from '../../store/useOracusStore';
import Tab1CompanyIntel from './Tab1CompanyIntel';
import Tab2MarketLandscape from './Tab2MarketLandscape';
import Tab3FocusGroup from './Tab3FocusGroup';
import Tab4SimulationResults from './Tab4SimulationResults';
import Tab5DeepAnalysis from './Tab5DeepAnalysis';
import Tab6StrategicPlaybook from './Tab6StrategicPlaybook';

export default function Screen3Dashboard() {
  const [activeTab, setActiveTab] = useState(1);
  const { companyProfile, personaCount } = useOracusStore();

  const tabs = [
    { id: 1, name: 'Company Intel' },
    { id: 2, name: 'Market Landscape' },
    { id: 3, name: 'Focus Group' },
    { id: 4, name: 'Simulation Results' },
    { id: 5, name: 'Deep Analysis' },
    { id: 6, name: 'Strategic Playbook' }
  ];

  return (
    <div className="w-full max-w-[960px] flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-700 pb-12 w-full">
      
      {/* Redesigned Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-2">
        <div>
          <p className="text-[#3B82F6] text-[12px] font-bold tracking-[0.2em] uppercase mb-1.5 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]">
            Simulation Results
          </p>
          <h1 className="text-[40px] leading-none font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E2E8F0] to-[#8B8FA3] drop-shadow-sm">
            {companyProfile?.company_name || 'Loading...'}
          </h1>
        </div>
        
        {/* Dynamic Persona Badge */}
        <div className="flex items-center gap-2 bg-blue-950/30 backdrop-blur-md border border-blue-500/30 rounded-full px-4 py-2 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          <span className="text-[16px]">👥</span>
          <span className="text-blue-200 text-[13px] font-semibold tracking-wide">
            {personaCount} AI Personas Active
          </span>
        </div>
      </div>

      {/* The Sleek Tab Bar */}
      <div className="w-full bg-[#12121A]/80 backdrop-blur-md border border-[#2A2A3E] rounded-xl p-1.5 shadow-lg overflow-x-auto hide-scrollbar">
        <div className="flex items-center min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-[14px] font-medium rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#1A1A2E] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_0_15px_rgba(59,130,246,0.15)] border border-[#3B82F6]/30'
                  : 'text-[#8B8FA3] hover:text-[#E2E8F0] hover:bg-[#1A1A2E]/50 border border-transparent'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="w-full mt-2">
        {activeTab === 1 && <Tab1CompanyIntel />}
        {activeTab === 2 && <Tab2MarketLandscape />}
        {activeTab === 3 && <Tab3FocusGroup />}
        {activeTab === 4 && <Tab4SimulationResults />}
        {activeTab === 5 && <Tab5DeepAnalysis />}
        {activeTab === 6 && <Tab6StrategicPlaybook />}
      </div>

    </div>
  );
}