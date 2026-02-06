import { supabase } from '../lib/supabase';
import { calculateMultiPlayerEloChanges } from './eloCalculation';

export interface Tournament {
  id: string;
  name: string;
  date: string;
  min_elo: number;
  max_elo: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TournamentParticipant {
  id: string;
  tournament_id: string;
  player_id: string;
  placement?: number;
  elo_before: number;
  elo_after: number;
  elo_change: number;
  created_at: string;
}

export const createTournament = async (
  name: string,
  date: string,
  minElo: number = 500,
  maxElo: number = 5000
): Promise<{ success: boolean; data?: Tournament; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('tournaments')
      .insert({
        name,
        date,
        min_elo: minElo,
        max_elo: maxElo,
        status: 'draft',
        created_by: user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create tournament' };
  }
};

export const fetchTournaments = async (): Promise<{ success: boolean; data?: Tournament[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return { success: true, data: data as Tournament[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch tournaments' };
  }
};

export const updateTournamentStatus = async (
  tournamentId: string,
  status: 'draft' | 'active' | 'completed' | 'cancelled'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('tournaments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', tournamentId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update tournament' };
  }
};

export const addTournamentParticipant = async (
  tournamentId: string,
  playerId: string,
  eloBefore: number
): Promise<{ success: boolean; data?: TournamentParticipant; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('tournament_participants')
      .insert({
        tournament_id: tournamentId,
        player_id: playerId,
        elo_before: eloBefore,
        elo_after: eloBefore,
        elo_change: 0
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to add participant' };
  }
};

export const fetchTournamentParticipants = async (
  tournamentId: string
): Promise<{ success: boolean; data?: TournamentParticipant[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('tournament_participants')
      .select('*')
      .eq('tournament_id', tournamentId);

    if (error) throw error;
    return { success: true, data: data as TournamentParticipant[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch participants' };
  }
};

export const applyTournamentResults = async (
  tournamentId: string,
  placements: Array<{ player_id: string; placement: number }>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: participants, error: fetchError } = await supabase
      .from('tournament_participants')
      .select('*, player_id')
      .eq('tournament_id', tournamentId);

    if (fetchError) throw fetchError;

    const { data: playerData, error: playerError } = await supabase
      .from('players')
      .select('id, elo')
      .in('id', participants?.map(p => p.player_id) || []);

    if (playerError) throw playerError;

    const playerEloMap = new Map(playerData?.map(p => [p.id, p.elo]) || []);

    const placementsWithElo = placements.map(p => ({
      playerId: p.player_id,
      elo: playerEloMap.get(p.player_id) || 1200,
      placement: p.placement
    }));

    const eloChanges = calculateMultiPlayerEloChanges(placementsWithElo);

    const updates = await Promise.all(
      eloChanges.map(async (change) => {
        const participant = participants?.find(p => p.player_id === change.playerId);
        const oldElo = participant?.elo_before || 1200;
        const newElo = oldElo + change.eloChange;

        const { error: updateError } = await supabase
          .from('tournament_participants')
          .update({
            elo_after: newElo,
            elo_change: change.eloChange,
            placement: placements.find(p => p.player_id === change.playerId)?.placement
          })
          .eq('tournament_id', tournamentId)
          .eq('player_id', change.playerId);

        if (updateError) throw updateError;

        await supabase
          .from('players')
          .update({
            elo: newElo,
            peak_elo: Math.max(newElo, (await supabase.from('players').select('peak_elo').eq('id', change.playerId).single()).data?.peak_elo || 1200)
          })
          .eq('id', change.playerId);

        await supabase
          .from('elo_history')
          .insert({
            player_id: change.playerId,
            tournament_id: tournamentId,
            old_elo: oldElo,
            new_elo: newElo
          });
      })
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to apply tournament results' };
  }
};

export const fetchPlayerTournamentHistory = async (
  playerId: string
): Promise<{ success: boolean; data?: TournamentParticipant[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('tournament_participants')
      .select('*')
      .eq('player_id', playerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: data as TournamentParticipant[] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch tournament history' };
  }
};
