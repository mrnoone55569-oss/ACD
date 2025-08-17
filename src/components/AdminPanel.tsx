import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { insertInitialPlayers } from '../utils/playerMigration';
import { AlertCircle, Check, Crown } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [status, setStatus] = useState<{
    loading: boolean;
    error?: string;
    success?: boolean;
  }>({ loading: false });

  if (!isAuthenticated) return null;

  const handleInitialDataLoad = async () => {
    setStatus({ loading: true });
    const result = await insertInitialPlayers();
    
    if (result.success) {
      setStatus({ loading: false, success: true });
    } else {
      setStatus({ loading: false, error: result.error });
    }

    // Clear success/error message after 5 seconds
    setTimeout(() => {
      setStatus({ loading: false });
    }, 5000);
  };

  return (
    <div className="bg-panel-gradient rounded-xl p-6 mb-6 border border-highlight shadow-lg shadow-accent-glow/20">
      <h2 className="text-xl font-game font-bold mb-4 text-text-primary flex items-center">
        <Crown size={20} className="mr-2 text-accent-primary" />
        Admin Controls
      </h2>
      
      <div className="flex items-center gap-4">
        <button
          onClick={handleInitialDataLoad}
          disabled={status.loading}
          className={`px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${
            status.loading
              ? 'bg-accent-primary/20 text-accent-primary cursor-not-allowed'
              : 'bg-accent-gradient hover:shadow-accent-glow text-white border border-accent-primary/30 hover:border-accent-primary transform hover:scale-[1.02]'
          }`}
        >
          {status.loading ? (
            <>
              <span className="inline-block animate-spin mr-2">⟳</span>
              Loading Initial Data...
            </>
          ) : (
            'Load Initial Player Data'
          )}
        </button>

        {status.error && (
          <div className="flex items-center text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/30">
            <AlertCircle size={16} className="mr-2" />
            {status.error}
          </div>
        )}

        {status.success && (
          <div className="flex items-center text-green-400 text-sm bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/30">
            <Check size={16} className="mr-2" />
            Players added successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;