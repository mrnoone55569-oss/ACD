// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { supabase } from './lib/supabase';
import { useThemeStore } from './store/themeStore';

type ThemeMode = 'default' | 'winter';

async function detectGlobalThemeFromDB(): Promise<ThemeMode> {
  // total players
  const { count: total, error: e1 } = await supabase
    .from('players')
    .select('id', { count: 'exact', head: true });
  if (e1) throw e1;

  if (!total || total === 0) return 'default';

  // how many rows are NOT theme=1 (winter)
  const { count: notOne, error: e2 } = await supabase
    .from('players')
    .select('id', { count: 'exact', head: true })
    .neq('theme', 1);
  if (e2) throw e2;

  // if all rows are 1 → winter, else default
  return notOne === 0 ? 'winter' : 'default';
}

(async () => {
  try {
    const mode = await detectGlobalThemeFromDB();
    // apply to local theme store before initial render (prevents flicker)
    useThemeStore.getState().setTheme(mode);
  } catch {
    // if anything fails, stay on default
    useThemeStore.getState().setTheme('default');
  } finally {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
})();
