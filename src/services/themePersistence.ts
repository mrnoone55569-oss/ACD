// src/services/themePersistence.ts
import { supabase } from '../lib/supabase';

/**
 * Read the "global" theme (0 = default, 1 = winter).
 * We treat theme as global by mirroring it on all players
 * and reading the most recently updated row as source of truth.
 */
export async function fetchGlobalTheme(): Promise<0 | 1> {
  // If you prefer "any row", you could .limit(1) without ordering.
  const { data, error } = await supabase
    .from('players')
    .select('theme, updated_at')
    .order('updated_at', { ascending: false, nullsFirst: false })
    .limit(1);

  if (error) {
    console.error('fetchGlobalTheme error:', error);
    return 0; // fallback to default
  }

  const row = data?.[0];
  const themeVal = (row?.theme ?? 0) as 0 | 1;
  return themeVal === 1 ? 1 : 0;
}

/**
 * Persist the global theme by updating ALL rows in players.
 * Returns the number of affected rows.
 */
export async function saveGlobalTheme(theme: 0 | 1): Promise<number> {
  // Update every player row. PostgREST requires a filter; this matches all non-null ids.
  const { data, error } = await supabase
    .from('players')
    .update({ theme, updated_at: new Date().toISOString() })
    .not('id', 'is', null) // matches every row
    .select('id'); // get affected rows count

  if (error) {
    console.error('saveGlobalTheme error:', error);
    throw error;
  }

  return data?.length ?? 0;
}
