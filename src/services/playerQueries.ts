// src/services/playerQueries.ts
import { supabase } from '../lib/supabase';
import { usePlayerStore } from '../store/playerStore';

type Row = {
  id: string;
  name: string;
  image_url: string | null;
  avatar: string | null;
  kitTiers: Record<string, any> | null;
  peakTiers?: Record<string, any> | null; // in case some envs still have it
  peaktiers?: Record<string, any> | null; // lowercase column (current)
  theme?: number | null;
  active?: number | boolean | null;
  created_at?: string;
  updated_at?: string;
};

export async function fetchAllPlayers(): Promise<any[]> {
  const { data, error } = await supabase
    .from('players')
    .select('id,name,image_url,avatar,kitTiers,peakTiers,peaktiers,theme,active,created_at,updated_at')
    .order('created_at', { ascending: true });

  if (error) throw error;

  // normalize peak tiers + active
  return (data as Row[]).map((r) => ({
    ...r,
    peakTiers: r.peaktiers ?? r.peakTiers ?? {},
    active: typeof r.active === 'number' ? r.active : r.active ? 1 : 0,
  }));
}

/** Pulls from DB and hydrates the store so every screen updates */
export async function refreshPlayersInStore() {
  const rows = await fetchAllPlayers();
  // minimal store update – assumes players is in store
  usePlayerStore.setState((s: any) => ({ ...s, players: rows }));
  return rows;
}
