import { supabase } from '../lib/supabase';
import type { KitId, TierType } from '../types';

// Helper to check "undefined column" error from PostgREST
const isMissingColumn = (err: any) =>
  err && (err.code === '42703' || /does not exist/.test(String(err.message || '')));

type Json = Record<string, unknown> | null;

export interface PlayerRow {
  id: string;
  name?: string | null;
  // allow either casing to exist in DB; TypeScript will still use TierType map
  kitTiers?: Record<string, TierType> | null;
  peakTiers?: Record<string, TierType> | null;
  image_url?: string | null;
  avatar?: string | null;
  theme?: 0 | 1 | null;
  created_at?: string;
  updated_at?: string;
}

/** Fetch a single player row by id (tolerates column casing) */
export async function fetchPlayer(playerId: string): Promise<PlayerRow> {
  // First attempt: lowercase columns (common in Supabase)
  let sel = 'id,name,kittiers,peaktiers,image_url,avatar,theme,created_at,updated_at';
  try {
    const { data, error } = await supabase
      .from('players')
      .select(sel)
      .eq('id', playerId)
      .single();
    if (error) throw error;

    // Normalize to camel keys for app use
    const normalized: PlayerRow = {
      ...data,
      kitTiers: (data as any).kittiers ?? (data as any).kitTiers ?? null,
      peakTiers: (data as any).peaktiers ?? (data as any).peakTiers ?? null,
    };
    return normalized;
  } catch (err: any) {
    if (!isMissingColumn(err)) throw err;
    // Retry with camelCase columns
    sel = 'id,name,kitTiers,peakTiers,image_url,avatar,theme,created_at,updated_at';
    const { data, error } = await supabase
      .from('players')
      .select(sel)
      .eq('id', playerId)
      .single();
    if (error) throw error;
    return data as PlayerRow;
  }
}

/** Update CURRENT tier for a kit — tolerant to kittiers/kitTiers */
export async function setCurrentTier(
  playerId: string,
  kitId: KitId,
  tier: TierType
): Promise<Record<string, TierType>> {
  // Read existing (prefer lowercase)
  let existing: any;
  try {
    const { data, error } = await supabase
      .from('players')
      .select('kittiers')
      .eq('id', playerId)
      .single();
    if (error) throw error;
    existing = data?.kittiers ?? {};
    const next = { ...(existing as Record<string, TierType>), [kitId]: tier };

    const { error: writeErr } = await supabase
      .from('players')
      .update({ kittiers: next as unknown as Json, updated_at: new Date().toISOString() })
      .eq('id', playerId);
    if (writeErr) throw writeErr;
    return next;
  } catch (err: any) {
    if (!isMissingColumn(err)) throw err;
    // Fallback to camelCase column
    const { data, error } = await supabase
      .from('players')
      .select('kitTiers')
      .eq('id', playerId)
      .single();
    if (error) throw error;
    const prev = (data?.kitTiers ?? {}) as Record<string, TierType>;
    const next = { ...prev, [kitId]: tier };
    const { error: writeErr } = await supabase
      .from('players')
      .update({ kitTiers: next as unknown as Json, updated_at: new Date().toISOString() })
      .eq('id', playerId);
    if (writeErr) throw writeErr;
    return next;
  }
}

/** Update PEAK tier for a kit — tolerant to peaktiers/peakTiers */
export async function setPeakTier(
  playerId: string,
  kitId: KitId,
  tier: TierType
): Promise<Record<string, TierType>> {
  // Read existing (prefer lowercase)
  try {
    const { data, error } = await supabase
      .from('players')
      .select('peaktiers')
      .eq('id', playerId)
      .single();
    if (error) throw error;

    const prev = (data?.peaktiers ?? {}) as Record<string, TierType>;
    const next = { ...prev, [kitId]: tier };

    const { error: writeErr } = await supabase
      .from('players')
      .update({ peaktiers: next as unknown as Json, updated_at: new Date().toISOString() })
      .eq('id', playerId);
    if (writeErr) throw writeErr;

    return next;
  } catch (err: any) {
    if (!isMissingColumn(err)) throw err;
    // Fallback to camelCase column
    const { data, error } = await supabase
      .from('players')
      .select('peakTiers')
      .eq('id', playerId)
      .single();
    if (error) throw error;

    const prev = (data?.peakTiers ?? {}) as Record<string, TierType>;
    const next = { ...prev, [kitId]: tier };

    const { error: writeErr } = await supabase
      .from('players')
      .update({ peakTiers: next as unknown as Json, updated_at: new Date().toISOString() })
      .eq('id', playerId);
    if (writeErr) throw writeErr;

    return next;
  }
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
