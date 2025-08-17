import { supabase } from '../lib/supabase';
import { PLAYERS } from '../config/players';
import type { KitType, TierType } from '../types';

export const insertInitialPlayers = async () => {
  try {
    // First check if we already have players
    const { data: existingPlayers, error: checkError } = await supabase
      .from('players')
      .select('id')
      .limit(1);

    if (checkError) throw checkError;
    
    // If we already have players, don't insert again
    if (existingPlayers && existingPlayers.length > 0) {
      throw new Error('Players already exist in the database');
    }

    // Convert the players data to match the database schema
    const playersToInsert = PLAYERS.map(player => ({
      id: player.id,
      name: player.name,
      kitTiers: Object.keys(player.rankings).reduce((acc, kit) => {
        acc[kit as KitType] = player.rankings[kit as KitType];
        return acc;
      }, {} as Record<KitType, TierType>)
    }));

    const { error: insertError } = await supabase
      .from('players')
      .insert(playersToInsert);

    if (insertError) throw insertError;

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to insert players'
    };
  }
};