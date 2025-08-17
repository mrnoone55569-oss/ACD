import React from 'react';
import { Player, KitId, TierType } from '../types';
import { KITS } from '../config/kits';
import { getTierIconConfig } from '../config/tierIcons';
import TierIcon from './TierIcon';

interface TierIconRowProps {
  player: Player;
  activeKit?: KitId | 'overall';
  showPoints?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const TierIconRow: React.FC<TierIconRowProps> = ({ 
  player, 
  activeKit = 'overall',
  showPoints = true,
  size = 'md'
}) => {
  // Get all tiers for the player, sorted by tier order (best to worst)
  const getPlayerTiers = (): { tier: TierType; count: number }[] => {
    if (activeKit !== 'overall' && activeKit) {
      // Show single kit tier
      const tier = player.kitTiers?.[activeKit] || 'UNRANKED';
      return [{ tier, count: 1 }];
    }
    
    // Show all kit tiers, grouped and sorted
    const tierCounts: Record<TierType, number> = {};
    
    KITS.filter(kit => kit.id !== 'overall').forEach(kit => {
      const tier = player.kitTiers?.[kit.id as KitId] || 'UNRANKED';
      tierCounts[tier] = (tierCounts[tier] || 0) + 1;
    });
    
    // Only show non-unranked tiers, sorted by order
    return Object.entries(tierCounts)
      .filter(([tier]) => tier !== 'UNRANKED')
      .map(([tier, count]) => ({ tier: tier as TierType, count }))
      .sort((a, b) => {
        const aConfig = getTierIconConfig(a.tier);
        const bConfig = getTierIconConfig(b.tier);
        return aConfig.order - bConfig.order;
      });
  };
  
  // Calculate total points
  const calculatePoints = (): number => {
    if (activeKit !== 'overall' && activeKit) {
      const tier = player.kitTiers?.[activeKit] || 'UNRANKED';
      return getTierIconConfig(tier).points;
    }
    
    return KITS.filter(kit => kit.id !== 'overall').reduce((total, kit) => {
      const tier = player.kitTiers?.[kit.id as KitId] || 'UNRANKED';
      return total + getTierIconConfig(tier).points;
    }, 0);
  };
  
  const playerTiers = getPlayerTiers();
  const totalPoints = calculatePoints();
  
  // If no ranked tiers, show a clean "No Rankings" message
  if (playerTiers.length === 0) {
    return (
      <div className="flex items-center gap-4">
        {showPoints && (
          <div className="flex-shrink-0 w-16 text-right">
            <span className="text-lg font-bold text-gray-500 font-mono">0</span>
            <span className="text-xs text-gray-600 ml-1">pts</span>
          </div>
        )}
        <div className="text-gray-500 text-sm italic">
          No rankings yet
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-4">
      {showPoints && (
        <div className="flex-shrink-0 w-16 text-right">
          <span className="text-lg font-bold text-yellow-400 font-mono">
            {totalPoints}
          </span>
          <span className="text-xs text-gray-500 ml-1">pts</span>
        </div>
      )}
      
      <div className="flex items-center gap-4">
        {playerTiers.slice(0, 5).map(({ tier, count }) => (
          <div key={tier} className="flex items-center gap-2">
            <TierIcon tier={tier} size={size} showLabel={true} />
            {count > 1 && (
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 bg-darker px-2 py-1 rounded-full border border-gray-600">
                  ×{count}
                </span>
              </div>
            )}
          </div>
        ))}
        
        {playerTiers.length > 5 && (
          <div className="text-xs text-gray-500 bg-darker px-3 py-2 rounded-full border border-gray-600">
            +{playerTiers.length - 5} more
          </div>
        )}
      </div>
    </div>
  );
};

export default TierIconRow;