import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface AuthState {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

// Admin credentials - in a real app, these would be in environment variables
const ADMIN_EMAIL = 'admin@acdtierlist.com';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        try {
          // Simple admin authentication
          if (email !== ADMIN_EMAIL) {
            return { success: false, error: 'Invalid credentials' };
          }

          // For demo purposes, we'll use a simple password
          if (password !== 'admin123') {
            return { success: false, error: 'Invalid credentials' };
          }

          set({ isAuthenticated: true });
          return { success: true };
        } catch (error) {
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to login' 
          };
        }
      },
      
      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({ isAuthenticated: false });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },
    }),
    {
      name: 'auth-store',
    }
  )
);

// Initialize auth state from Supabase session
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.setState({ isAuthenticated: !!session });
});

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  useAuthStore.setState({ isAuthenticated: !!session });
});