import { supabase } from '../lib/supabase';
import type { KitId, TierType } from '../types';

// (optional) narrow type if you have Supabase types generated
type Json = Record<string, unknown> | null;

export interface PlayerRow {
  id: string;
  name?: string | null;
  kitTiers?: Record<string, TierType> | null;
  peakTiers?: Record<string, TierType> | null;
  image_url?: string | null;
  avatar?: string | null;
  theme?: 0 | 1 | null;
  created_at?: string;
  updated_at?: string;
}

/** Fetch a single player row by id */
export async function fetchPlayer(playerId: string): Promise<PlayerRow> {
  const { data, error } = await supabase
    .from('players')
    .select('id, name, kitTiers, peakTiers, image_url, avatar, theme, created_at, updated_at')
    .eq('id', playerId)
    .single();

  if (error) throw error;
  return data as PlayerRow;
}

/** Update CURRENT tier for a kit */
export async function setCurrentTier(
  playerId: string,
  kitId: KitId,
  tier: TierType
): Promise<Record<string, TierType>> {
  const { data: existing, error: readErr } = await supabase
    .from('players')
    .select('kitTiers')
    .eq('id', playerId)
    .single();

  if (readErr) throw readErr;

  const prev = (existing?.kitTiers ?? {}) as Record<string, TierType>;
  const next = { ...prev, [kitId]: tier };

  const { error: writeErr } = await supabase
    .from('players')
    .update({ kitTiers: next as unknown as Json, updated_at: new Date().toISOString() })
    .eq('id', playerId);

  if (writeErr) throw writeErr;
  return next;
}

/** Update PEAK tier for a kit */
export async function setPeakTier(
  playerId: string,
  kitId: KitId,
  tier: TierType
): Promise<Record<string, TierType>> {
  const { data: existing, error: readErr } = await supabase
    .from('players')
    .select('peakTiers')
    .eq('id', playerId)
    .single();

  if (readErr) throw readErr;

  const prev = (existing?.peakTiers ?? {}) as Record<string, TierType>;
  const next = { ...prev, [kitId]: tier };

  const { error: writeErr } = await supabase
    .from('players')
    .update({ peakTiers: next as unknown as Json, updated_at: new Date().toISOString() })
    .eq('id', playerId);

  if (writeErr) throw writeErr;
  return next;
}

/** Set theme (0 or 1) */
export async function setTheme(playerId: string, theme: 0 | 1): Promise<0 | 1> {
  const { error } = await supabase
    .from('players')
    .update({ theme, updated_at: new Date().toISOString() })
    .eq('id', playerId);

  if (error) throw error;
  return theme;
}
