import React from 'react';
import { Snowflake, Sun } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  const toggleTheme = () => setTheme(theme === 'winter' ? 'default' : 'winter');

  return (
    <button
      onClick={toggleTheme}
      className="ml-auto flex items-center px-4 py-2 rounded-xl border border-highlight bg-base-dark hover:bg-highlight text-text-secondary hover:text-text-primary transition-all duration-300"
      title="Toggle Theme"
    >
      {theme === 'winter' ? <Sun size={16} className="mr-2" /> : <Snowflake size={16} className="mr-2" />}
      <span className="text-sm font-semibold">{theme === 'winter' ? 'Default' : 'Winter'}</span>
    </button>
  );
};

export default ThemeToggle;
