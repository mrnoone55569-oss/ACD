import { supabase } from '../lib/supabase';
import type { KitId, TierType } from '../types';

type Json = Record<string, unknown> | null;

/** Update CURRENT tier (column: kitTiers) */
export async function setCurrentTier(
  playerId: string,
  kitId: KitId,
  tier: TierType
) {
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

/** Update PEAK tier (column: peaktiers) — note lowercase */
export async function setPeakTier(
  playerId: string,
  kitId: KitId,
  tier: TierType
) {
  const { data: existing, error: readErr } = await supabase
    .from('players')
    .select('peaktiers')
    .eq('id', playerId)
    .single();
  if (readErr) throw readErr;

  const prev = (existing?.peaktiers ?? {}) as Record<string, TierType>;
  const next = { ...prev, [kitId]: tier };

  const { error: writeErr } = await supabase
    .from('players')
    .update({ peaktiers: next as unknown as Json, updated_at: new Date().toISOString() })
    .eq('id', playerId);
  if (writeErr) throw writeErr;

  return next;
}
