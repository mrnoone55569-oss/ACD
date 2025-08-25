// src/services/playerAdmin.ts
import { supabase } from '../lib/supabase';

// Safe id generator: "player-xxxxxxxx-...."
function genPlayerId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `player-${crypto.randomUUID()}`;
  }
  return `player-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function createPlayer(
  name: string,
  image_url: string,
  active: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const id = genPlayerId();
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('players')
      .insert([
        {
          id,
          name,
          image_url: image_url || null,
          active: !!active,
          kitTiers: {},   // camelCase in your DB
          peaktiers: {},  // lowercase in your DB
          updated_at: now,
          created_at: now,
        }
      ]);

    if (error) {
      console.error('createPlayer error:', error);
      return { success: false, error: error.message || 'Failed to create player' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('createPlayer exception:', err);
    return { success: false, error: err?.message || 'Failed to create player' };
  }
}

export async function updatePlayerBasics(
  id: string,
  fields: { name?: string; image_url?: string; active?: boolean }
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: Record<string, any> = { updated_at: new Date().toISOString() };
    if (typeof fields.name !== 'undefined') payload.name = fields.name;
    if (typeof fields.image_url !== 'undefined') payload.image_url = fields.image_url || null;
    if (typeof fields.active !== 'undefined') payload.active = !!fields.active;

    const { error } = await supabase.from('players').update(payload).eq('id', id);
    if (error) {
      console.error('updatePlayerBasics error:', error);
      return { success: false, error: error.message || 'Failed to update player' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('updatePlayerBasics exception:', err);
    return { success: false, error: err?.message || 'Failed to update player' };
  }
}

export async function resetSinglePlayerTiers(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('players')
      .update({
        kitTiers: {},   // camelCase
        peaktiers: {},  // lowercase
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('resetSinglePlayerTiers error:', error);
      return { success: false, error: error.message || 'Failed to reset player tiers' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('resetSinglePlayerTiers exception:', err);
    return { success: false, error: err?.message || 'Failed to reset player tiers' };
  }
}
