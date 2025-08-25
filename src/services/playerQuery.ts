import { supabase } from '../lib/supabase';
import { usePlayerStore } from '../store/playerStore';

export type PlayerRow = {
  id: string;
  name: string;
  image_url: string | null;
  avatar: string | null;
  kitTiers: Record<string, any> | null;   // camelCase in your DB
  peaktiers: Record<string, any> | null;  // lowercase in your DB
  theme: 0 | 1 | null;
  active: 0 | 1 | boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export async function fetchAllPlayers(): Promise<PlayerRow[]> {
  const { data, error } = await supabase
    .from('players')
    .select('id,name,image_url,avatar,kitTiers,peaktiers,theme,active,created_at,updated_at')
    .order('id', { ascending: true });

  if (error) throw error;
  return (data ?? []) as PlayerRow[];
}

/** Pull fresh rows from DB and drop them into the store. */
export async function refreshPlayersInStore(): Promise<void> {
  const rows = await fetchAllPlayers();

  // Normalize DB → app shape the store probably expects:
  // - peakTiers camelized from peaktiers
  const normalized = rows.map((r) => ({
    ...r,
    peakTiers: (r as any).peaktiers ?? null,
  }));

  // Zustand lets us set state directly
  usePlayerStore.setState({ players: normalized as any });
}
