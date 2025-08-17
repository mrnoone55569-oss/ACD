import React from 'react';
import { X, Trophy, Star, Crown } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { KITS } from '../config/kits';
import { getTierIconConfig } from '../config/tierIcons';
import { getKitIcon } from '../config/kits';
import { KitId } from '../types';

interface PlayerDetailModalProps {
  playerId: string;
  onClose: () => void;
}

const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ playerId, onClose }) => {
  const { players } = usePlayerStore();
  const player = players.find(p => p.id === playerId);
  
  if (!player) return null;

  // Calculate total points
  const totalPoints = KITS.filter(kit => kit.id !== 'overall').reduce((total, kit) => {
    const tier = player.kitTiers?.[kit.id as KitId] || 'UNRANKED';
    return total + getTierIconConfig(tier).points;
  }, 0);

  // Get ranked kits (non-unranked)
  const rankedKits = KITS.filter(kit => kit.id !== 'overall' && player.kitTiers?.[kit.id as KitId] !== 'UNRANKED');
  const unrankedKits = KITS.filter(kit => kit.id !== 'overall' && player.kitTiers?.[kit.id as KitId] === 'UNRANKED');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-panel-gradient rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-highlight shadow-2xl shadow-accent-glow">
        {/* Header */}
        <div className="sticky top-0 bg-base-dark rounded-t-2xl p-6 border-b border-highlight flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-base-dark border-2 border-highlight shadow-lg">
              <img 
                src={player.image_url || player.avatar || `https://ui-avatars.com/api/?name=${player.name}&background=random`} 
                alt={player.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-game font-bold text-text-primary">{player.name}</h2>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center text-accent-primary">
                  <Trophy size={16} className="mr-1" />
                  <span className="font-mono font-bold">{totalPoints} points</span>
                </div>
                <div className="flex items-center text-accent-secondary">
                  <Star size={16} className="mr-1" />
                  <span className="text-sm">{rankedKits.length}/{KITS.length - 1} kits ranked</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-highlight transition-colors border border-transparent hover:border-accent-primary/30"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Ranked Kits */}
          {rankedKits.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-game font-bold text-text-primary mb-4 flex items-center">
                <Crown size={18} className="mr-2 text-accent-primary" />
                Ranked Kits ({rankedKits.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rankedKits
                  .sort((a, b) => {
                    const aTier = player.kitTiers?.[a.id as KitId] || 'UNRANKED';
                    const bTier = player.kitTiers?.[b.id as KitId] || 'UNRANKED';
                    const aPoints = getTierIconConfig(aTier).points;
                    const bPoints = getTierIconConfig(bTier).points;
                    return bPoints - aPoints;
                  })
                  .map(kit => {
                    const tier = player.kitTiers?.[kit.id as KitId] || 'UNRANKED';
                    const tierConfig = getTierIconConfig(tier);
                    const KitIcon = getKitIcon(kit.id);
                    
                    return (
                      <div 
                        key={kit.id}
                        className="bg-base-dark rounded-xl p-4 border border-highlight hover:border-accent-primary/50 transition-all duration-300 hover:shadow-accent-glow/20"
                      >
                        <div className="flex items-center gap-4">
                          {/* Kit Icon */}
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center border-2 shadow-lg relative overflow-hidden flex-shrink-0"
                            style={{
                              backgroundColor: `${kit.color}15`,
                              borderColor: kit.color
                            }}
                          >
                            <KitIcon size={20} color={kit.color} strokeWidth={2} />
                          </div>
                          
                          {/* Kit Info */}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-text-primary">{kit.name}</div>
                            <div className="text-sm text-text-secondary">Kit Category</div>
                          </div>
                          
                          {/* Tier Badge */}
                          <div className="flex flex-col items-end">
                            <div 
                              className="px-3 py-1.5 rounded-lg border-2 font-mono font-bold text-sm shadow-lg"
                              style={{
                                backgroundColor: tierConfig.bgColor,
                                borderColor: tierConfig.borderColor,
                                color: tierConfig.color
                              }}
                            >
                              {tierConfig.label}
                            </div>
                            <div className="text-xs text-text-muted mt-1">
                              {tierConfig.points} pts
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Unranked Kits */}
          {unrankedKits.length > 0 && (
            <div>
              <h3 className="text-lg font-game font-bold text-text-secondary mb-4 flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-600 mr-2"></div>
                Unranked Kits ({unrankedKits.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {unrankedKits.map(kit => {
                  const KitIcon = getKitIcon(kit.id);
                  
                  return (
                    <div 
                      key={kit.id}
                      className="bg-base-dark/50 rounded-lg p-3 border border-gray-700 text-center hover:border-accent-primary/30 transition-colors"
                    >
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-600 mx-auto mb-2"
                        style={{
                          backgroundColor: `${kit.color}10`,
                          borderColor: `${kit.color}30`
                        }}
                      >
                        <KitIcon size={16} color={`${kit.color}80`} strokeWidth={2} />
                      </div>
                      <div className="text-sm text-text-muted">{kit.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No rankings message */}
          {rankedKits.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-panel border border-highlight flex items-center justify-center mx-auto mb-4">
                <Crown size={24} className="text-text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-text-secondary mb-2">No Rankings Yet</h3>
              <p className="text-text-muted text-sm">This player hasn't been ranked in any kit categories.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailModal;