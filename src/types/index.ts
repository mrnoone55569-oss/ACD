// Actual kit identifiers (excluding 'overall')
export type KitId = 'sword' | 'axe' | 'crystal' | 'uhc' | 'smp' | 'diasmp' | 'diapot' | 'npot' | 'mace' | 'shieldless';

// Display kit type (including 'overall' for UI)
export type DisplayKitType = 'overall' | KitId;

export type TierType = 'HT1' | 'LT1' | 'HT2' | 'LT2' | 'HT3' | 'LT3' | 'HT4' | 'LT4' | 'HT5' | 'LT5' | 'RHT1' | 'RLT1' | 'RHT2' | 'RLT2' | 'UNRANKED';

export interface Player {
  id: string;
  name: string;
  kitTiers: Record<KitId, TierType>;
  created_at?: string;
  updated_at?: string;
  avatar?: string;
  image_url?: string;
  full_body_url?: string;
  active?: boolean;
  peakTiers?: Record<KitId, TierType>;
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