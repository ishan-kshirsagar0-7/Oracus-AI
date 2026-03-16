import { useOracusStore } from './store/useOracusStore';
import Screen1Landing from './components/Screen1_Landing/Screen1Landing';
import Screen2Setup from './components/Screen2_Setup/Screen2Setup';
import Screen3Dashboard from './components/Screen3_Dashboard/Screen3Dashboard';

function App() {
  const currentScreen = useOracusStore((state) => state.currentScreen);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E2E8F0] font-sans selection:bg-[#3B82F6] selection:text-white">
      <main className="max-w-[960px] mx-auto px-6 sm:px-10 py-10 flex flex-col items-center justify-center min-h-screen">
        {currentScreen === 1 && <Screen1Landing />}
        {currentScreen === 2 && <Screen2Setup />}
        {currentScreen === 3 && <Screen3Dashboard />}
      </main>
    </div>
  );
}

export default App;