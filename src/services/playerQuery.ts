// src/services/playerQuery.ts
import { supabase } from '../lib/supabase';
import { usePlayerStore } from '../store/playerStore';
import type { TierType } from '../types';

type DBRow = {
  id: string;
  name: string;
  image_url: string | null;
  avatar: string | null;
  kitTiers: any;       // may be {}, null, or 0 (bad)
  peaktiers: any;      // may be {}, null, or 0 (bad)  <-- DB column
  theme: 0 | 1 | null;
  active: 0 | 1 | boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const toTierMap = (v: any): Record<string, TierType> =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, TierType>) : {};

export async function fetchAllPlayers() {
  const { data, error } = await supabase
    .from('players')
    .select('id,name,image_url,avatar,active,theme,kitTiers,peaktiers,created_at,updated_at')
    .order('id', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((r: DBRow) => ({
    id: r.id,
    name: r.name,
    image_url: r.image_url ?? '',
    avatar: r.avatar ?? null,
    active: r.active ?? 1,
    theme: r.theme ?? 0,
    kitTiers: toTierMap(r.kitTiers),
    peakTiers: toTierMap(r.peaktiers), // <- normalized camelCase for UI
    created_at: r.created_at ?? null,
    updated_at: r.updated_at ?? null,
  }));
}

export async function refreshPlayersInStore(): Promise<void> {
  const players = await fetchAllPlayers();
  const store = usePlayerStore.getState() as any;
  if (typeof store.setPlayers === 'function') store.setPlayers(players);
  else usePlayerStore.setState({ players });
}
