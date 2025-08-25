import React from 'react';
import Header from './components/Header';
import KitSelector from './components/KitSelector';
import PlayerList from './components/PlayerList';
import StatsSummary from './components/StatsSummary';
import Logo from './components/Logo';
import AdminPanel from './components/AdminPanel';
import { ToastProvider } from './components/ToastContainer';
import { usePlayerStore } from './store/playerStore';
import { useThemeStore } from './store/themeStore';
import Snowfall from './components/Snowfall';

function App() {
  const { isLoading, error } = usePlayerStore();
  const { theme } = useThemeStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darker text-text-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading players...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-darker text-text-primary flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="text-xl mb-2">Error loading players</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className={`min-h-screen text-text-primary pb-10 ${theme === 'winter' ? 'theme-winter' : 'bg-darker'}`}>
        {theme === 'winter' && <Snowfall />}
        <Header />
        
        <main className="container mx-auto px-4 pt-24">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
            <Logo />
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-game font-bold mb-2 text-center md:text-left text-text-primary">
                ACD Tier List Rankings
              </h1>
              <p className="text-text-secondary max-w-2xl text-center md:text-left">
                View and manage player rankings across different kit categories. 
                Select a kit category to view specific rankings and click on a tier to update it.
              </p>
            </div>
          </div>
          
          <AdminPanel />
          <StatsSummary />
          <KitSelector />
          <PlayerList />
        </main>
        
        <footer className="mt-16 py-6 border-t border-highlight">
          <div className="container mx-auto px-4 text-center text-text-muted text-sm">
            <p>© 2025 ACD Tier List. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}

export default App;