import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { usePlayerStore } from '../store/playerStore';
import { useThemeStore } from '../store/themeStore';
import { insertInitialPlayers } from '../utils/playerMigration';
 
import { AlertCircle, Check, Crown, Trash2, Target, Globe, AlertTriangle, Plus, Save } from 'lucide-react';
 
import { KITS } from '../config/kits';
import { KitId } from '../types';
import ResetConfirmModal from './ResetConfirmModal';
import { useToast } from './ToastContainer';

const AdminPanel: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { players, addPlayer, updatePlayerInfo, resetKitForAll, resetAllTiers } = usePlayerStore();
  const { theme, setTheme } = useThemeStore();
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
  const [selectedKit, setSelectedKit] = useState<KitId | ''>('');


  const [newPlayer, setNewPlayer] = useState({ name: '', image_url: '', active: true });
  const [editStates, setEditStates] = useState<Record<string, { name: string; image_url: string; active: boolean }>>({});

  useEffect(() => {
    const initial = players.reduce((acc, p) => ({
      ...acc,
      [p.id]: { name: p.name, image_url: p.image_url || '', active: p.active !== false }
    }), {} as Record<string, { name: string; image_url: string; active: boolean }>);
    setEditStates(initial);
  }, [players]);


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

  const handleKitReset = () => {
    if (!selectedKit) return;
    const kit = KITS.find(k => k.id === selectedKit);
    setResetModal({
      isOpen: true,
      type: 'kit',
      kitId: selectedKit,
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
            message: `Reset tiers for ${result.affected} players`
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
      setSelectedKit('');

    }
  };

  const handleAddPlayer = async () => {
    const result = await addPlayer(newPlayer.name, newPlayer.image_url, newPlayer.active);
    if (result.success) {
      showToast({ type: 'success', title: 'Player Added', message: `Added ${newPlayer.name}` });
      setNewPlayer({ name: '', image_url: '', active: true });
    } else {
      showToast({ type: 'error', title: 'Add Failed', message: result.error || 'Failed to add player' });
    }
  };

  const handleEditChange = (id: string, field: 'name' | 'image_url' | 'active', value: string | boolean) => {
    setEditStates(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleSavePlayer = async (id: string) => {
    const result = await updatePlayerInfo(id, editStates[id]);
    if (result.success) {
      showToast({ type: 'success', title: 'Player Updated', message: 'Changes saved' });
    } else {
      showToast({ type: 'error', title: 'Update Failed', message: result.error || 'Failed to update player' });

    }
  };

  return (
    <>
      <div className="bg-panel-gradient rounded-xl p-6 mb-6 border border-highlight shadow-lg shadow-accent-glow/20">
        <h2 className="text-xl font-game font-bold mb-6 text-text-primary flex items-center">
          <Crown size={20} className="mr-2 text-accent-primary" />
          Admin Controls
        </h2>


        {/* Player Management Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Player Management</h3>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Name"
              value={newPlayer.name}
              onChange={e => setNewPlayer({ ...newPlayer, name: e.target.value })}
              className="px-3 py-2 rounded-lg bg-base-dark border border-highlight text-text-primary"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newPlayer.image_url}
              onChange={e => setNewPlayer({ ...newPlayer, image_url: e.target.value })}
              className="px-3 py-2 rounded-lg bg-base-dark border border-highlight text-text-primary"
            />
            <label className="flex items-center gap-2 text-text-primary">
              <input
                type="checkbox"
                checked={newPlayer.active}
                onChange={e => setNewPlayer({ ...newPlayer, active: e.target.checked })}
              />
              Active
            </label>
            <button
              onClick={handleAddPlayer}
              className="px-4 py-2 rounded-lg bg-accent-gradient text-white flex items-center gap-1"
            >
              <Plus size={14} /> Add
            </button>
          </div>
          <div className="space-y-4">
            {players.map(p => (
              <div key={p.id} className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={editStates[p.id]?.name || ''}
                  onChange={e => handleEditChange(p.id, 'name', e.target.value)}
                  className="px-3 py-2 rounded-lg bg-base-dark border border-highlight text-text-primary"
                />
                <input
                  type="text"
                  value={editStates[p.id]?.image_url || ''}
                  onChange={e => handleEditChange(p.id, 'image_url', e.target.value)}
                  className="px-3 py-2 rounded-lg bg-base-dark border border-highlight text-text-primary flex-1"
                />
                <label className="flex items-center gap-2 text-text-primary">
                  <input
                    type="checkbox"
                    checked={editStates[p.id]?.active ?? true}
                    onChange={e => handleEditChange(p.id, 'active', e.target.checked)}
                  />
                  Active
                </label>
                <button
                  onClick={() => handleSavePlayer(p.id)}
                  className="px-3 py-2 rounded-lg bg-accent-primary/20 hover:bg-accent-primary/30 text-accent-primary flex items-center gap-1"
                >
                  <Save size={14} /> Save
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Theme Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Theme</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme('default')}
              className={`px-4 py-2 rounded-lg font-semibold ${theme === 'default' ? 'bg-accent-gradient text-white' : 'bg-base-dark text-text-secondary hover:text-text-primary border border-highlight'}`}
            >
              Default
            </button>
            <button
              onClick={() => setTheme('winter')}
              className={`px-4 py-2 rounded-lg font-semibold ${theme === 'winter' ? 'bg-accent-gradient text-white' : 'bg-base-dark text-text-secondary hover:text-text-primary border border-highlight'}`}
            >
              Winter
            </button>
          </div>
        </div>

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
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedKit}
                onChange={e => setSelectedKit(e.target.value as KitId)}
                className="px-4 py-2 rounded-lg bg-base-dark border border-highlight text-text-primary"
              >
                <option value="" disabled>
                  Select a kit
                </option>
                {KITS.filter(kit => kit.id !== 'overall').map(kit => (
                  <option key={kit.id} value={kit.id}>
                    {kit.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleKitReset}
                disabled={!selectedKit}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-300 ${
                  selectedKit
                    ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 hover:border-yellow-400'
                    : 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 cursor-not-allowed'
                }`}
              >
                <Trash2 size={14} />
                Reset Selected Kit
              </button>
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