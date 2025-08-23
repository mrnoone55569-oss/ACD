import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { usePlayerStore } from '../store/playerStore';
import { insertInitialPlayers } from '../utils/playerMigration';
import { AlertCircle, Check, Crown, Trash2, Target, Globe } from 'lucide-react';
import { KITS } from '../config/kits';
import { KitId } from '../types';
import ResetConfirmModal from './ResetConfirmModal';
import { useToast } from './ToastContainer';

const AdminPanel: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { resetKitForAll, resetAllTiers } = usePlayerStore();
  const { showToast } = useToast();
  const [status, setStatus] = useState<{
    loading: boolean;
    error?: string;
    success?: boolean;
  }>({ loading: false });
  
  const [resetModal, setResetModal] = useState<{
    isOpen: boolean;
    type: 'kit' | 'global';
    kitId?: KitId;
    kitName?: string;
  }>({ isOpen: false, type: 'kit' });
  
  const [isResetting, setIsResetting] = useState(false);

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

  const handleKitReset = async (kitId: KitId) => {
    const kit = KITS.find(k => k.id === kitId);
    setResetModal({
      isOpen: true,
      type: 'kit',
      kitId,
      kitName: kit?.name
    });
  };

  const handleGlobalReset = () => {
    setResetModal({
      isOpen: true,
      type: 'global'
    });
  };

  const handleResetConfirm = async () => {
    setIsResetting(true);
    
    try {
      if (resetModal.type === 'kit' && resetModal.kitId) {
        const result = await resetKitForAll(resetModal.kitId);
        if (result.success) {
          showToast({
            type: 'success',
            title: 'Kit Reset Successful',
            message: `Reset ${resetModal.kitName} tiers for ${result.affected} players`
          });
        } else {
          throw new Error(result.error);
        }
      } else if (resetModal.type === 'global') {
        const result = await resetAllTiers();
        if (result.success) {
          showToast({
            type: 'success',
            title: 'Global Reset Successful',
            message: 'All player tiers have been reset'
          });
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Reset Failed',
        message: error instanceof Error ? error.message : 'An error occurred'
      });
    } finally {
      setIsResetting(false);
      setResetModal({ isOpen: false, type: 'kit' });
    }
  };

  return (
    <>
      <div className="bg-panel-gradient rounded-xl p-6 mb-6 border border-highlight shadow-lg shadow-accent-glow/20">
        <h2 className="text-xl font-game font-bold mb-6 text-text-primary flex items-center">
          <Crown size={20} className="mr-2 text-accent-primary" />
          Admin Controls
        </h2>
        
        {/* Data Management Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Data Management</h3>
          <div className="flex flex-wrap items-center gap-4">
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

        {/* Reset Tiers Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Reset Tiers</h3>
          
          {/* Kit-level Reset */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-text-secondary mb-3 flex items-center">
              <Target size={16} className="mr-2" />
              Reset Specific Kit (All Players)
            </h4>
            <div className="flex flex-wrap gap-2">
              {KITS.filter(kit => kit.id !== 'overall').map(kit => (
                <button
                  key={kit.id}
                  onClick={() => handleKitReset(kit.id as KitId)}
                  className="px-4 py-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 hover:border-yellow-400 transition-all duration-300 text-sm font-semibold flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  Reset {kit.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border-t border-red-500/30 pt-6">
          <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
            <AlertTriangle size={18} className="mr-2" />
            Danger Zone
          </h3>
          <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-red-400 mb-1">Reset All Tiers (Global)</h4>
                <p className="text-sm text-red-300/80">This will remove all tier rankings for all players. This action cannot be undone.</p>
              </div>
              <button
                onClick={handleGlobalReset}
                className="px-6 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-400 transition-all duration-300 font-semibold flex items-center gap-2 ml-4"
              >
                <Globe size={16} />
                Reset All Tiers
              </button>
            </div>
          </div>
        </div>
      </div>

      <ResetConfirmModal
        isOpen={resetModal.isOpen}
        onClose={() => setResetModal({ isOpen: false, type: 'kit' })}
        onConfirm={handleResetConfirm}
        title={resetModal.type === 'kit' ? 'Reset Kit Tiers' : 'Reset All Tiers'}
        description={
          resetModal.type === 'kit'
            ? `This will remove all ${resetModal.kitName} tier rankings from all players.`
            : 'This will remove ALL tier rankings from ALL players. Every player will be unranked in every kit.'
        }
        type={resetModal.type}
        kitName={resetModal.kitName}
        isLoading={isResetting}
      />
    </>
  );
};

export default AdminPanel;