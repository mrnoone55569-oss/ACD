import { getTierPoints } from '../config/tiers';
import { Player, KitId } from '../types';

export const calculatePlayerPoints = (player: Player): number => {
  if (!player.kitTiers) return 0;
  
  return Object.values(player.kitTiers).reduce((total, tier) => {
    return total + getTierPoints(tier);
  }, 0);
};

export const calculateKitPoints = (player: Player, kitId: KitId): number => {
  if (!player.kitTiers || !player.kitTiers[kitId]) return 0;
  
  return getTierPoints(player.kitTiers[kitId]);
};

export const getAveragePoints = (players: Player[]): number => {
  if (players.length === 0) return 0;
  
  const totalPoints = players.reduce((sum, player) => {
    return sum + calculatePlayerPoints(player);
  }, 0);
  
  return totalPoints / players.length;
};