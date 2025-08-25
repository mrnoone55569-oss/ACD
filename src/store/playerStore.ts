import { create } from 'zustand';
import { Player, KitId, TierType, DisplayKitType } from '../types';
import { PLAYERS } from '../config/players';
import { supabase } from '../lib/supabase';
import { getTierIconConfig } from '../config/tierIcons';

const getTierPoints = (tier: TierType) => getTierIconConfig(tier).points;

interface PlayerState {
  players: Player[];
  filteredPlayers: Player[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  activeKit: DisplayKitType;
  setActiveKit: (kit: DisplayKitType) => void;
  setSearchQuery: (query: string) => void;
  updatePlayerTier: (playerId: string, kit: KitId, tier: TierType) => Promise<void>;
  resetAllRankings: () => Promise<void>;
  initializePlayers: () => Promise<void>;
  resetPlayerTiers: (playerId: string) => Promise<{ success: boolean; error?: string }>;
  resetKitForAll: (kitKey: KitId) => Promise<{ success: boolean; affected?: number; error?: string }>;
  resetAllTiers: () => Promise<{ success: boolean; affected?: number; error?: string }>;

  addPlayer: (name: string, image_url: string, active?: boolean) => Promise<{ success: boolean; error?: string }>;
  updatePlayerInfo: (
    playerId: string,
    updates: { name?: string; image_url?: string; active?: boolean }
  ) => Promise<{ success: boolean; error?: string }>;

}

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  players: [],
  filteredPlayers: [],
  searchQuery: '',
  isLoading: true,
  error: null,
  activeKit: 'overall',

  setActiveKit: (kit) => set({ activeKit: kit }),

  setSearchQuery: (query) => {
    const { players } = get();
    const base = players.filter(p => p.active !== false);
    const filteredPlayers = query.trim() === ''
      ? base
      : base.filter(player =>
          player.name.toLowerCase().includes(query.toLowerCase())
        );
    
    set({ 
      searchQuery: query,
      filteredPlayers 
    });
  },

  initializePlayers: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Set up real-time subscription
      supabase
        .channel('players_channel')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'players' 
          },
          async () => {
            const { data: updatedPlayers } = await supabase
              .from('players')
              .select('*')
              .order('name');
            
            if (updatedPlayers) {
              const { searchQuery } = get();
              const base = (updatedPlayers as Player[]).filter(p => p.active !== false);
              const filteredPlayers = searchQuery.trim() === ''
                ? base
                : base.filter(player =>
                    player.name.toLowerCase().includes(searchQuery.toLowerCase())
                  );

              set({
                players: updatedPlayers as Player[],
                filteredPlayers
              });
            }
          }
        )
        .subscribe();

      // Check if we have any players
      const { data: existingPlayers } = await supabase
        .from('players')
        .select('id')
        .limit(1);

      // If no players exist, insert initial data
      if (!existingPlayers || existingPlayers.length === 0) {
        const playersToInsert = PLAYERS.map(player => ({
          id: player.id,
          name: player.name,
          kitTiers: player.kitTiers,
          avatar: player.avatar,
          active: true,
          peakTiers: player.kitTiers
        }));

        const { error: insertError } = await supabase
          .from('players')
          .insert(playersToInsert);

        if (insertError) throw insertError;
      }

      // Fetch all players
      const { data: players, error } = await supabase
        .from('players')
        .select('*')
        .order('name');

      if (error) throw error;

      const playerList = players as Player[];

      set({
        players: playerList,
        filteredPlayers: playerList.filter(p => p.active !== false),
        isLoading: false
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false,
        players: [],
        filteredPlayers: []
      });
    }
  },

  updatePlayerTier: async (playerId, kit, tier) => {
    try {
      const player = get().players.find(p => p.id === playerId);
      if (!player) return;

      const updatedKitTiers = {
        ...(player.kitTiers || {}),
        [kit]: tier
      };

      const currentPeak = player.peakTiers?.[kit];
      const currentPeakPoints = currentPeak ? getTierPoints(currentPeak) : -1;
      const newTierPoints = getTierPoints(tier);
      const updatedPeakTiers = {
        ...(player.peakTiers || {}),
        [kit]: currentPeakPoints > newTierPoints ? currentPeak : tier
      };

      const { error } = await supabase
        .from('players')
        .update({ kitTiers: updatedKitTiers, peakTiers: updatedPeakTiers })
        .eq('id', playerId);

      if (error) throw error;

      const updatedPlayers = get().players.map(p =>
        p.id === playerId
          ? { ...p, kitTiers: updatedKitTiers, peakTiers: updatedPeakTiers }
          : p
      );

      const { searchQuery } = get();
      const filteredPlayers = searchQuery.trim() === '' 
        ? updatedPlayers
        : updatedPlayers.filter(player => 
            player.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

      set({
        players: updatedPlayers,
        filteredPlayers
      });
    } catch (error) {
      console.error('Error updating player tier:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update player tier' 
      });
    }
  },

  resetAllRankings: async () => {
    try {
      const defaultKitTiers = PLAYERS[0].kitTiers;

      const { error } = await supabase
        .from('players')
        .update({ kitTiers: defaultKitTiers })
        .neq('id', '0');

      if (error) throw error;

      const updatedPlayers = get().players.map(player => ({
        ...player,
        kitTiers: defaultKitTiers
      }));

      const { searchQuery } = get();
      const filteredPlayers = searchQuery.trim() === '' 
        ? updatedPlayers
        : updatedPlayers.filter(player => 
            player.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

      set({
        players: updatedPlayers,
        filteredPlayers
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to reset rankings' 
      });
    }
  },

  resetPlayerTiers: async (playerId: string) => {
    try {
      const { error } = await supabase
        .from('players')
        .update({
          kitTiers: {},
          peakTiers: {},
          updated_at: new Date().toISOString()
        })
        .eq('id', playerId);

      if (error) throw error;

      // Update local state
      const updatedPlayers = get().players.map(player => 
        player.id === playerId
          ? { ...player, kitTiers: {} as Record<KitId, TierType>, peakTiers: {} as Record<KitId, TierType> }
          : player
      );

      const { searchQuery } = get();
      const filteredPlayers = searchQuery.trim() === '' 
        ? updatedPlayers
        : updatedPlayers.filter(player => 
            player.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

      set({
        players: updatedPlayers,
        filteredPlayers
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reset player tiers'
      };
    }
  },

  resetKitForAll: async (kitKey: KitId) => {
    try {
      const { data: affected, error } = await supabase
        .rpc('reset_kit', { k: kitKey });

      if (error) throw error;

      // Update local state - remove the kit from all players
      const updatedPlayers = get().players.map(player => {
        const newKitTiers = { ...player.kitTiers };
        delete newKitTiers[kitKey];
        const newPeakTiers = { ...(player.peakTiers || {}) };
        delete newPeakTiers[kitKey];
        return { ...player, kitTiers: newKitTiers, peakTiers: newPeakTiers };
      });

      const { searchQuery } = get();
      const filteredPlayers = searchQuery.trim() === '' 
        ? updatedPlayers
        : updatedPlayers.filter(player => 
            player.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

      set({
        players: updatedPlayers,
        filteredPlayers
      });

      return { success: true, affected: affected || 0 };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reset kit for all players'
      };
    }
  },

  resetAllTiers: async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .update({
          kitTiers: {},
          peakTiers: {},
          updated_at: new Date().toISOString()
        })
        .select('id');

      if (error) throw error;

      const affected = data?.length || 0;

      // Update local state
      const updatedPlayers = get().players.map(player => ({
        ...player,
        kitTiers: {} as Record<KitId, TierType>,
        peakTiers: {} as Record<KitId, TierType>
      }));

      const { searchQuery } = get();
      const filteredPlayers = searchQuery.trim() === ''
        ? updatedPlayers
        : updatedPlayers.filter(player =>
            player.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

      set({
        players: updatedPlayers,
        filteredPlayers
      });

      return { success: true, affected };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reset all tiers'
      };
    }
  },

  addPlayer: async (name, image_url, active = true) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .insert({ name, image_url, kitTiers: {}, peakTiers: {}, active })
        .select('*')
        .single();

      if (error) throw error;

      const newPlayer = data as Player;
      set(state => {
        const players = [...state.players, newPlayer];
        const filteredPlayers = players.filter(p =>
          p.active !== false && p.name.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
        return { players, filteredPlayers };
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to add player' };
    }
  },

  updatePlayerInfo: async (playerId, updates) => {
    try {
      const { error } = await supabase
        .from('players')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', playerId);

      if (error) throw error;

      set(state => {
        const players = state.players.map(p =>
          p.id === playerId ? { ...p, ...updates } : p
        );
        const filteredPlayers = players.filter(p =>
          p.active !== false && p.name.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
        return { players, filteredPlayers };
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update player' };
    }
  }
}));

// Initialize players when the store is first used
usePlayerStore.getState().initializePlayers();