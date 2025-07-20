import type React from 'react';
import { useThemeContext } from '../contexts/ThemeContext';

const DarkModeToggle: React.FC = () => {
  const { isDark, toggle } = useThemeContext();

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg dark:shadow-gray-900/50 z-50"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="text-xl">{isDark ? '☀️' : '🌙'}</span>
    </button>
  );
};

export default DarkModeToggle;
