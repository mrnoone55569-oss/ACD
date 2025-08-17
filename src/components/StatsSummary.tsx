import React from 'react';
import { usePlayerStore } from '../store/playerStore';
import { getTierIconConfig } from '../config/tierIcons';
import { TierType, KitId } from '../types';
import { KITS } from '../config/kits';
import { Users, Trophy, Target, TrendingUp } from 'lucide-react';

const StatsSummary: React.FC = () => {
  const { filteredPlayers, activeKit, searchQuery } = usePlayerStore();
  
  // Use filtered players for stats when searching
  const playersToAnalyze = filteredPlayers;
  
  // Calculate average points
  const calculateAveragePoints = (): number => {
    if (playersToAnalyze.length === 0) return 0;
    
    const totalPoints = playersToAnalyze.reduce((sum, player) => {
      if (activeKit === 'overall') {
        return sum + KITS.filter(kit => kit.id !== 'overall').reduce((kitSum, kit) => {
          const tier = player.kitTiers?.[kit.id as KitId] || 'UNRANKED';
          return kitSum + getTierIconConfig(tier).points;
        }, 0);
      } else {
        const tier = player.kitTiers?.[activeKit as KitId] || 'UNRANKED';
        return sum + getTierIconConfig(tier).points;
      }
    }, 0);
    
    return Math.round(totalPoints / playersToAnalyze.length);
  };
  
  // Count players in each tier for the active kit
  const tierCounts = playersToAnalyze.reduce<Record<TierType, number>>((counts, player) => {
    if (activeKit === 'overall') {
      // For overall, count each tier across all kits
      KITS.filter(kit => kit.id !== 'overall').forEach(kit => {
        const tier = player.kitTiers?.[kit.id as KitId] || 'UNRANKED';
        counts[tier] = (counts[tier] || 0) + 1;
      });
    } else {
      const tier = player.kitTiers?.[activeKit as KitId] || 'UNRANKED';
      counts[tier] = (counts[tier] || 0) + 1;
    }
    return counts;
  }, {} as Record<TierType, number>);
  
  // Get counts for top tiers (HT1, LT1, HT2)
  const topTiersCount = (tierCounts['HT1'] || 0) + (tierCounts['LT1'] || 0) + (tierCounts['HT2'] || 0);
  
  // Calculate highest scoring player
  const getHighestScore = (): number => {
    if (playersToAnalyze.length === 0) return 0;
    
    return Math.max(...playersToAnalyze.map(player => {
      if (activeKit === 'overall') {
        return KITS.filter(kit => kit.id !== 'overall').reduce((sum, kit) => {
          const tier = player.kitTiers?.[kit.id as KitId] || 'UNRANKED';
          return sum + getTierIconConfig(tier).points;
        }, 0);
      } else {
        const tier = player.kitTiers?.[activeKit as KitId] || 'UNRANKED';
        return getTierIconConfig(tier).points;
      }
    }));
  };
  
  const stats = [
    {
      icon: Users,
      label: searchQuery ? 'Matching Players' : 'Total Players',
      value: playersToAnalyze.length,
      color: 'text-text-primary',
      bgColor: 'bg-panel-gradient',
      iconColor: 'text-accent-primary'
    },
    {
      icon: Trophy,
      label: 'Top Tier Count',
      value: topTiersCount,
      color: 'text-accent-primary',
      bgColor: 'bg-panel-gradient',
      iconColor: 'text-accent-primary',
      subtitle: 'HT1, LT1, HT2'
    },
    {
      icon: Target,
      label: 'Highest Score',
      value: getHighestScore(),
      color: 'text-green-400',
      bgColor: 'bg-panel-gradient',
      iconColor: 'text-green-400',
      subtitle: 'points'
    },
    {
      icon: TrendingUp,
      label: 'Average Points',
      value: calculateAveragePoints(),
      color: 'text-blue-400',
      bgColor: 'bg-panel-gradient',
      iconColor: 'text-blue-400',
      subtitle: 'per player'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-panel-gradient rounded-xl p-6 border border-highlight shadow-lg shadow-accent-glow/10 hover:shadow-accent-glow/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <stat.icon size={24} className={stat.iconColor} strokeWidth={2} />
            <div className="w-2 h-2 bg-accent-primary rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-text-secondary text-sm mb-2 font-medium">{stat.label}</h3>
          <p className={`text-3xl font-bold ${stat.color} font-mono`}>{stat.value}</p>
          {stat.subtitle && (
            <p className="text-xs text-text-muted mt-1">{stat.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsSummary;