import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'default' | 'winter';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'default',
      setTheme: (theme) => set({ theme })
    }),
    {
      name: 'global-theme-store',
    }
  )
);
