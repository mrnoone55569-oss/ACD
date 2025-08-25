import { create } from 'zustand';

type Theme = 'default' | 'winter';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>(set => ({
  theme: 'default',
  setTheme: theme => set({ theme })
}));
