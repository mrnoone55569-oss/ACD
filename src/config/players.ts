import { Player, KitType, TierType } from '../types';

// Initialize all players with unranked in all categories
const initializeRankings = (): Record<KitType, TierType> => {
  return {
    sword: 'UNRANKED',
    axe: 'UNRANKED',
    crystal: 'UNRANKED',
    uhc: 'UNRANKED',
    smp: 'UNRANKED',
    diasmp: 'UNRANKED',
    diapot: 'UNRANKED',
    npot: 'UNRANKED',
    mace: 'UNRANKED',
    shieldless: 'UNRANKED'
  };
};

// Mix of provided players and random Minecraft characters
export const PLAYERS: Player[] = [
  { id: 'player-1', name: 'Sycthy', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Sycthy' },
  { id: 'player-2', name: 'Ellies V', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Ellies_V' },
  { id: 'player-3', name: 'Wido', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Wido' },
  { id: 'player-4', name: 'Neo H', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Neo_H' },
  { id: 'player-5', name: 'Rexo', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Rexo' },
  { id: 'player-6', name: 'Evo', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Evo' },
  { id: 'player-7', name: 'Darky', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Darky' },
  { id: 'player-8', name: 'Blom', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Blom' },
  { id: 'player-9', name: 'Blazo', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Blazo' },
  { id: 'player-10', name: 'Spectro', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Spectro' },
  { id: 'player-11', name: 'Doni', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Doni' },
  { id: 'player-12', name: 'Reterno', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Reterno' },
  { id: 'player-13', name: 'Kelk', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Kelk' },
  { id: 'player-14', name: 'Me', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Me' },
  { id: 'player-15', name: 'Yolo', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Yolo' },
  { id: 'player-16', name: 'Big A', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Big_A' },
  { id: 'player-17', name: 'Unded', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Unded' },
  { id: 'player-18', name: 'Unio', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Unio' },
  { id: 'player-19', name: 'Winder', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Winder' },
  { id: 'player-20', name: 'Vran', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Vran' },
  { id: 'player-21', name: 'Crysto', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Crysto' },
  { id: 'player-22', name: 'Morpho', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Morpho' },
  { id: 'player-23', name: 'Void', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Void' },
  { id: 'player-24', name: 'Ravv', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Ravv' },
  { id: 'player-25', name: 'Polo', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Polo' },
  { id: 'player-26', name: 'Retoro', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Retoro' },
  { id: 'player-27', name: 'Rutner', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Rutner' },
  { id: 'player-28', name: 'Raivo', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Raivo' },
  { id: 'player-29', name: 'Tron T', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Tron_T' },
  { id: 'player-30', name: 'Inferno', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Inferno' },
  { id: 'player-31', name: 'Crysteo', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Crysteo' },
  { id: 'player-32', name: 'Jka', kitTiers: initializeRankings(), avatar: 'https://mc-heads.net/avatar/Jka' }
];