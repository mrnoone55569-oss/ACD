// src/services/playerQuery.ts
import { supabase } from '../lib/supabase';
import { usePlayerStore } from '../store/playerStore';
import type { TierType } from '../types';

export type PlayerRow = {
  id: string;
  name: string;
  image_url: string | null;
  avatar: string | null;
  kitTiers: Record<string, TierType> | null;
  peakTiers: Record<string, TierType> | null; // aliased from DB peaktiers
  theme: 0 | 1 | null;
  active: 0 | 1 | boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export async function fetchAllPlayers(): Promise<PlayerRow[]> {
  const { data, error } = await supabase
    .from('players')
    .select(`
      id,
      name,
      image_url,
      avatar,
      kitTiers,
      peakTiers:peaktiers,  -- <-- alias DB 'peaktiers' to camelCase
      theme,
      active,
      created_at,
      updated_at
    `)
    .order('id', { ascending: true });

  if (error) throw error;

  // ensure objects, not nulls
  return (data ?? []).map((r: any) => ({
    ...r,
    kitTiers: r.kitTiers ?? {},
    peakTiers: r.peakTiers ?? {},
  })) as PlayerRow[];
}

/** Pull fresh rows from DB and drop them into the store. */
export async function refreshPlayersInStore(): Promise<void> {
  const players = await fetchAllPlayers();
  // prefer a setter if your store has one; fallback to setState
  const store = usePlayerStore.getState() as any;
  if (typeof store.setPlayers === 'function') {
    store.setPlayers(players as any);
  } else {
    usePlayerStore.setState({ players: players as any });
  }
}
