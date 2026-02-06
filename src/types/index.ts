// Actual kit identifiers (excluding 'overall')
export type KitId = 'sword' | 'axe' | 'crystal' | 'uhc' | 'smp' | 'diasmp' | 'diapot' | 'npot' | 'mace' | 'shieldless';

// Display kit type (including 'overall' for UI)
export type DisplayKitType = 'overall' | KitId;

export type TierType = 'HT1' | 'LT1' | 'HT2' | 'LT2' | 'HT3' | 'LT3' | 'HT4' | 'LT4' | 'HT5' | 'LT5' | 'RHT1' | 'RLT1' | 'RHT2' | 'RLT2' | 'UNRANKED';

export type RankType = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Combat Grandmaster';

export interface Player {
  id: string;
  name: string;
  kitTiers: Record<KitId, TierType>;
  created_at?: string;
  updated_at?: string;
  avatar?: string;
  image_url?: string;
  full_body_url?: string;
  minecraft_username?: string;
  active?: boolean;
  peakTiers?: Record<KitId, TierType>;
  elo?: number;
  peak_elo?: number;
}

export interface EloRank {
  id: string;
  rank_name: RankType;
  elo_min: number;
  elo_max?: number;
  color: string;
  badge_type?: string;
  order: number;
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  min_elo: number;
  max_elo: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TournamentParticipant {
  id: string;
  tournament_id: string;
  player_id: string;
  placement?: number;
  elo_before: number;
  elo_after: number;
  elo_change: number;
  created_at: string;
}

export interface EloHistoryEntry {
  id: string;
  player_id: string;
  tournament_id?: string;
  old_elo: number;
  new_elo: number;
  placement?: number;
  date: string;
}

export interface TierConfig {
  id: TierType;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  points: number;
}

export interface KitConfig {
  id: DisplayKitType;
  name: string;
  icon: string;
  color: string;
}