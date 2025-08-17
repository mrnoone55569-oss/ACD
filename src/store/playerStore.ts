import { create } from 'zustand';
import { Player, KitId, TierType, DisplayKitType } from '../types';
import { PLAYERS } from '../config/players';
import { supabase } from '../lib/supabase';

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
    const filteredPlayers = query.trim() === '' 
      ? players 
      : players.filter(player => 
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
      const subscription = supabase
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
              const filteredPlayers = searchQuery.trim() === '' 
                ? updatedPlayers as Player[]
                : (updatedPlayers as Player[]).filter(player => 
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
          avatar: player.avatar
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

      set({ 
        players: players as Player[], 
        filteredPlayers: players as Player[],
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

      const { error } = await supabase
        .from('players')
        .update({ kitTiers: updatedKitTiers })
        .eq('id', playerId);

      if (error) throw error;

      const updatedPlayers = get().players.map(p => 
        p.id === playerId 
          ? { ...p, kitTiers: updatedKitTiers }
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
  }
}));

// Initialize players when the store is first used
usePlayerStore.getState().initializePlayers();