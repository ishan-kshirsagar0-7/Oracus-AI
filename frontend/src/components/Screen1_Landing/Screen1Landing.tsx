import { useState } from 'react';
import { useOracusStore } from '../../store/useOracusStore';
import { fetchCompanyIntel } from '../../api/client';
import logo from '../../assets/oracus_logo.png';

export default function Screen1Landing() {
  const { 
    companyName, setCompanyName, setCompanyIntel, 
    setScreen, isLoading, loadingPhase, setLoading 
  } = useOracusStore();
  
  const [error, setError] = useState('');

  const handleBuildProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setError('');
    setLoading(true, 'Fetching company intelligence...');

    try {
      // Hits your live Vercel API!
      const data = await fetchCompanyIntel(companyName);
      setCompanyIntel(data.company_profile, data.demographic_map);
      setScreen(2); // Automatically transitions to Screen 2 on success
    } catch (err: any) {
      setError(err.message || 'Failed to fetch company profile. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-700">
      {/* Header Section */}
      <img src={logo} alt="Oracus AI" className="h-[70px] mt-[60px] object-contain" />
      
      <h1 className="mt-4 text-[28px] font-light tracking-[6px] uppercase text-[#E2E8F0]">
        ORACUS AI
      </h1>
      
      <p className="mt-2 text-[18px] font-light text-[#3B82F6] italic">
        Test before you launch
      </p>
      
      <p className="mt-3 text-[15px] font-normal text-[#8B8FA3] max-w-[500px] text-center">
        Simulate how your target market will react to any business decision — before you spend a dollar.
      </p>

      {/* Input Card */}
      <div className="mt-[60px] w-full max-w-[700px] bg-[#12121A] border border-[#2A2A3E] rounded-xl p-6">
        <label htmlFor="companyName" className="block text-[15px] font-medium text-[#E2E8F0] mb-2">
          Enter your company name
        </label>
        
        <form onSubmit={handleBuildProfile} className="flex flex-row gap-2">
          <input
            id="companyName"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. Starbucks, Nvidia, Spotify..."
            className="flex-grow bg-[#0A0A0F] border border-[#2A2A3E] rounded-lg text-[#E2E8F0] placeholder-[#555770] px-4 py-[14px] text-[14px] focus:border-[#3B82F6] focus:outline-none transition-colors disabled:opacity-50"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isLoading || !companyName.trim()}
            className="bg-[#E2E8F0] text-[#0A0A0F] font-medium text-[14px] rounded-lg px-6 py-[12px] hover:bg-[#CBD5E1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-[#0A0A0F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Building...
              </>
            ) : (
              'Build profile'
            )}
          </button>
        </form>

        {/* Loading / Error / Helper Text */}
        <div className="mt-3 h-5">
          {isLoading ? (
            <p className="text-[13px] text-[#8B8FA3] animate-pulse">
              {loadingPhase}
            </p>
          ) : error ? (
            <p className="text-[13px] text-[#EF4444]">
              {error}
            </p>
          ) : (
            <p className="text-[12px] text-[#555770]">
              We'll auto-detect your product, pricing, audience, and competitors from public data.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}