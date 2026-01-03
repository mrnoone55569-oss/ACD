import { supabase } from '../lib/supabase';

function genPlayerId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `player-${crypto.randomUUID()}`;
  }
  return `player-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function createPlayer(
  name: string,
  image_url: string,
  active: boolean,
  full_body_url?: string,
  minecraft_username?: string
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
          full_body_url: full_body_url || null,
          minecraft_username: minecraft_username?.trim() || null,
          active: active ? 1 : 0, // 0/1
          kitTiers: {},           // camelCase
          peaktiers: {},          // lowercase
          updated_at: now,
          created_at: now,
        },
      ]);

    if (error) {
      console.error('createPlayer error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Failed to create player' };
  }
}

export async function updatePlayerBasics(
  id: string,
  fields: { name?: string; image_url?: string; full_body_url?: string; minecraft_username?: string; active?: boolean }
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: Record<string, any> = { updated_at: new Date().toISOString() };
    if (fields.name !== undefined) payload.name = fields.name;
    if (fields.image_url !== undefined) payload.image_url = fields.image_url || null;
    if (fields.full_body_url !== undefined) payload.full_body_url = fields.full_body_url || null;
    if (fields.minecraft_username !== undefined) payload.minecraft_username = fields.minecraft_username?.trim() || null;
    if (fields.active !== undefined) payload.active = fields.active ? 1 : 0;

    const { error } = await supabase.from('players').update(payload).eq('id', id);
    if (error) {
      console.error('updatePlayerBasics error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Failed to update player' };
  }
}

export async function resetSinglePlayerTiers(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('players')
      .update({
        kitTiers: {},
        peaktiers: {},
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('resetSinglePlayerTiers error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Failed to reset player tiers' };
  }
}

export async function deletePlayer(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('players').delete().eq('id', id);
    if (error) {
      console.error('deletePlayer error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Failed to delete player' };
  }
}
