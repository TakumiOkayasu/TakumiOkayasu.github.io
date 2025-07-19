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
      <SunIcon
        className={`absolute w-6 h-6 text-yellow-500 transition-all duration-300 ${
          resolvedTheme === 'dark'
            ? 'opacity-0 rotate-180 scale-0'
            : 'opacity-100 rotate-0 scale-100'
        }`}
      />
      <MoonIcon
        className={`absolute w-6 h-6 text-blue-400 transition-all duration-300 ${
          resolvedTheme === 'dark'
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 -rotate-180 scale-0'
        }`}
      />
      {/* システムテーマ使用時のインジケーター */}
      {theme === 'system' && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800 transition-colors duration-300" />
      )}
    </button>
  );
};

export default DarkModeToggle;
