import type React from 'react';
import { useThemeContext } from '../contexts/ThemeContext';
import { MoonIcon, SunIcon } from './Icons';

const DarkModeToggle: React.FC = () => {
  const { theme, resolvedTheme, toggleTheme } = useThemeContext();

  const getAriaLabel = () => {
    if (theme === 'system') {
      return `Currently using system theme (${resolvedTheme}). Click to switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode.`;
    }
    return resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg dark:shadow-gray-900/50 z-50 group"
      aria-label={getAriaLabel()}
      title={getAriaLabel()}
    >
      {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

export default DarkModeToggle;
