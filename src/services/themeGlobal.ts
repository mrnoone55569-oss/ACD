// src/services/themeGlobal.ts
import { supabase } from '../lib/supabase';
import { useThemeStore } from '../store/themeStore';

export type ThemeMode = 'default' | 'winter';

/** Set theme (0/1) on ALL players and also update local store immediately. */
export async function setGlobalThemeForAll(mode: ThemeMode): Promise<{ success: boolean; error?: string }> {
  try {
    const flag = mode === 'winter' ? 1 : 0;

    // PostgREST requires a filter; this targets all rows (id IS NOT NULL)
    const { error } = await supabase
      .from('players')
      .update({ theme: flag, updated_at: new Date().toISOString() })
      .not('id', 'is', null);

    if (error) return { success: false, error: error.message };

    // reflect locally so current session updates immediately
    useThemeStore.getState().setTheme(mode);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Failed to update theme' };
  }
}

/** Detect global theme by checking if ALL rows have theme = 1 (winter). Empty table → default. */
export async function detectGlobalThemeFromDB(): Promise<ThemeMode> {
  // total rows
  const { count: total, error: e1 } = await supabase
    .from('players')
    .select('id', { count: 'exact', head: true });
  if (e1) throw e1;

  if (!total || total === 0) return 'default';

  // rows that are NOT 1
  const { count: notOne, error: e2 } = await supabase
    .from('players')
    .select('id', { count: 'exact', head: true })
    .neq('theme', 1);
  if (e2) throw e2;

  return notOne === 0 ? 'winter' : 'default';
}

/** Read DB theme and apply to the local theme store. Call this on page load. */
export async function applyThemeFromDB(): Promise<ThemeMode> {
  try {
    const mode = await detectGlobalThemeFromDB();
    useThemeStore.getState().setTheme(mode);
    return mode;
  } catch (e) {
    // fallback to default if anything goes wrong
    useThemeStore.getState().setTheme('default');
    return 'default';
  }
}
