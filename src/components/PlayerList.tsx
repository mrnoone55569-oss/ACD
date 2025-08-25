import React, { useState } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { useAuthStore } from '../store/authStore';
import { useToast } from './ToastContainer';
import TierSelector from './TierSelector';
import LoginModal from './LoginModal';
import PlayerDetailModal from './PlayerDetailModal';
import ResetConfirmModal from './ResetConfirmModal';
import { KITS } from '../config/kits';
import { getTierIconConfig } from '../config/tierIcons';
import { getKitIcon } from '../config/kits';
import { KitId, TierType } from '../types';
import { Edit3, Trophy, Search, Trash2 } from 'lucide-react';

const PlayerList: React.FC = () => {
  const { filteredPlayers, activeKit, updatePlayerTier, resetPlayerTiers, searchQuery } = usePlayerStore();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { showToast } = useToast();
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [resetModal, setResetModal] = useState<{
    isOpen: boolean;
    playerId?: string;
    playerName?: string;
  }>({ isOpen: false });
  const [isResetting, setIsResetting] = useState(false);
  
  const handleTierSelect = (playerId: string, tier: TierType) => {
    if (activeKit !== 'overall') {
      updatePlayerTier(playerId, activeKit as KitId, tier);
    }
    setEditingPlayer(null);
  };
  
  const handleTierClick = (playerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    if (activeKit !== 'overall') {
      setEditingPlayer(playerId);
    }
  };

  const handlePlayerClick = (playerId: string) => {
    setSelectedPlayer(playerId);
  };

  const handlePlayerReset = (playerId: string, playerName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setResetModal({
      isOpen: true,
      playerId,
      playerName
    });
  };

  const handleResetConfirm = async () => {
    if (!resetModal.playerId) return;
    
    setIsResetting(true);
    try {
      const result = await resetPlayerTiers(resetModal.playerId);
      if (result.success) {
        showToast({
          type: 'success',
          title: 'Player Reset Successful',
          message: `All tiers reset for ${resetModal.playerName}`
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Reset Failed',
        message: error instanceof Error ? error.message : 'An error occurred'
      });
    } finally {
      setIsResetting(false);
      setResetModal({ isOpen: false });
    }
  };
  
  // Calculate points for sorting
  const getPlayerPoints = (player: typeof filteredPlayers[0]) => {
    if (activeKit === 'overall') {
      return KITS.filter(kit => kit.id !== 'overall').reduce((total, kit) => {
        const tier = player.kitTiers?.[kit.id as KitId] || 'UNRANKED';
        return total + getTierIconConfig(tier).points;
      }, 0);
    }
    
    const tier = player.kitTiers?.[activeKit as KitId] || 'UNRANKED';
    return getTierIconConfig(tier).points;
  };
  
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    const aPoints = getPlayerPoints(a);
    const bPoints = getPlayerPoints(b);
    return bPoints - aPoints;
  });

  const renderKitTiers = (player: typeof filteredPlayers[0]) => {
    if (activeKit === 'overall') {
      return KITS.filter(kit => kit.id !== 'overall').map(kit => {
        const tier = player.kitTiers?.[kit.id as KitId] || 'UNRANKED';
        const tierConfig = getTierIconConfig(tier);
        const peakTier = player.peakTiers?.[kit.id as KitId] || tier;
        const peakLabel = getTierIconConfig(peakTier).label;
        const KitIcon = getKitIcon(kit.id);

        return (
          <div key={kit.id} className="flex flex-col items-center min-w-[60px] group" title={`Peak: ${peakLabel}`}>
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center border-2 mb-2 transition-all duration-200 shadow-lg relative overflow-hidden"
              style={{
                backgroundColor: tierConfig.bgColor,
                borderColor: tierConfig.borderColor,
                boxShadow: `0 4px 12px ${tierConfig.color}25, inset 0 1px 0 rgba(255,255,255,0.1)`
              }}
            >
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  background: `linear-gradient(135deg, ${tierConfig.color}40, transparent)`
                }}
              />
              <KitIcon size={18} color={kit.color} strokeWidth={2} className="relative z-10" />
            </div>
            <span 
              className="text-xs font-mono font-bold leading-none tracking-wide"
              style={{ color: tierConfig.color }}
            >
              {tierConfig.label}
            </span>
          </div>
        );
      });
    } else {
      const tier = player.kitTiers?.[activeKit as KitId] || 'UNRANKED';
      const tierConfig = getTierIconConfig(tier);
      const peakTier = player.peakTiers?.[activeKit as KitId] || tier;
      const peakLabel = getTierIconConfig(peakTier).label;
      const KitIcon = getKitIcon(activeKit);

      return (
        <div className="flex items-center gap-4" title={`Peak: ${peakLabel}`}>
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-200 shadow-lg relative overflow-hidden"
            style={{
              backgroundColor: tierConfig.bgColor,
              borderColor: tierConfig.borderColor,
              boxShadow: `0 4px 12px ${tierConfig.color}25, inset 0 1px 0 rgba(255,255,255,0.1)`
            }}
          >
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: `linear-gradient(135deg, ${tierConfig.color}40, transparent)`
              }}
            />
            <KitIcon size={20} color={KITS.find(k => k.id === activeKit)?.color} strokeWidth={2} className="relative z-10" />
          </div>
          <div className="flex flex-col">
            <span 
              className="text-lg font-mono font-bold leading-none tracking-wide"
              style={{ color: tierConfig.color }}
            >
              {tierConfig.label}
            </span>
            <span className="text-xs text-text-muted mt-1">
              {KITS.find(k => k.id === activeKit)?.name} Kit
            </span>
          </div>
        </div>
      );
    }
  };

  // Show no results message when search has no matches
  if (searchQuery && sortedPlayers.length === 0) {
    return (
      <div className="bg-panel-gradient rounded-xl shadow-xl overflow-hidden border border-highlight">
        <div className="bg-base-dark py-4 px-6 border-b border-highlight">
          <h2 className="text-xl font-game font-bold text-text-primary flex items-center">
            <Trophy size={20} className="mr-2 text-yellow-500" />
            Player Rankings
            <span className="ml-2 text-sm text-text-muted font-normal">
              ({activeKit === 'overall' ? 'All Kits' : KITS.find(k => k.id === activeKit)?.name})
            </span>
          </h2>
        </div>
        
        <div className="py-12 px-6 text-center">
          <Search size={48} className="mx-auto mb-4 text-text-muted" />
          <h3 className="text-lg font-semibold text-text-secondary mb-2">No players found</h3>
          <p className="text-text-muted">
            No players match your search for "{searchQuery}". Try a different search term.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="bg-panel-gradient rounded-xl shadow-xl overflow-hidden border border-highlight">
        <div className="bg-base-dark py-4 px-6 border-b border-highlight">
          <h2 className="text-xl font-game font-bold text-text-primary flex items-center">
            <Trophy size={20} className="mr-2 text-yellow-500" />
            Player Rankings
            <span className="ml-2 text-sm text-text-muted font-normal">
              ({activeKit === 'overall' ? 'All Kits' : KITS.find(k => k.id === activeKit)?.name})
            </span>
            {searchQuery && (
              <span className="ml-2 text-sm text-accent-primary font-normal">
                - "{searchQuery}" ({sortedPlayers.length} result{sortedPlayers.length !== 1 ? 's' : ''})
              </span>
            )}
          </h2>
        </div>
        
        <div className="divide-y divide-highlight">
          {sortedPlayers.map((player, index) => (
            <div 
              key={player.id} 
              className="py-4 px-6 hover:bg-highlight/20 transition-all duration-200 group cursor-pointer"
              onClick={() => handlePlayerClick(player.id)}
            >
              <div className="flex items-center gap-4">
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-600 to-orange-600 text-white font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                </div>
                
                {/* Player Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-base-dark border-2 border-highlight shadow-lg">
                    <img 
                      src={player.image_url || player.avatar || `https://ui-avatars.com/api/?name=${player.name}&background=random`} 
                      alt={player.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Player Name */}
                <div className="flex-shrink-0 min-w-[120px]">
                  <div className="font-semibold text-text-primary text-lg">{player.name}</div>
                  <div className="text-xs text-text-muted font-mono">
                    {getPlayerPoints(player)} points
                  </div>
                </div>
                
                {/* Kit Tiers - Scrollable on mobile */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {renderKitTiers(player)}
                  </div>
                </div>
                
                {/* Edit Button (Admin only) */}
                {activeKit !== 'overall' && isAuthenticated && (
                  <div className="flex-shrink-0 relative">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => handleTierClick(player.id, e)}
                        className="p-2 rounded-lg bg-accent-primary/10 hover:bg-accent-primary/20 text-accent-primary hover:text-accent-light transition-all duration-200"
                        title="Edit Tier"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={(e) => handlePlayerReset(player.id, player.name, e)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200"
                        title="Reset All Tiers"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {editingPlayer === player.id && (
                      <TierSelector 
                        onSelect={(tier) => handleTierSelect(player.id, tier)}
                        onClose={() => setEditingPlayer(null)}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedPlayer && (
        <PlayerDetailModal 
          playerId={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
      
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
      
      <ResetConfirmModal
        isOpen={resetModal.isOpen}
        onClose={() => setResetModal({ isOpen: false })}
        onConfirm={handleResetConfirm}
        title="Reset Player Tiers"
        description="This will remove all tier rankings for this player across all kits."
        type="player"
        playerName={resetModal.playerName}
        isLoading={isResetting}
      />
    </>
  );
};

export default PlayerList;