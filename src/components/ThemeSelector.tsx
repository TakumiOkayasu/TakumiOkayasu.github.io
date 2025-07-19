import type React from 'react';
import { useState } from 'react';
import { type Theme, useThemeContext } from '../contexts/ThemeContext';
import { MoonIcon, SunIcon } from './Icons';

const SystemIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className || 'w-6 h-6'}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label="System theme icon"
    role="img"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const ThemeSelector: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useThemeContext();
  const [isOpen, setIsOpen] = useState(false);

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <SunIcon className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <MoonIcon className="w-4 h-4" /> },
    { value: 'system', label: 'System', icon: <SystemIcon className="w-4 h-4" /> },
  ];

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const currentThemeData = themes.find(t => t.value === theme);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        aria-label="Select theme"
        aria-expanded={isOpen}
      >
        {currentThemeData?.icon}
        <span>{currentThemeData?.label}</span>
        {theme === 'system' && (
          <span className="text-xs text-gray-500 dark:text-gray-400">({resolvedTheme})</span>
        )}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-label="Expand dropdown"
          role="img"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* オーバーレイ */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} aria-hidden="true" />

          {/* ドロップダウンメニュー */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-20">
            <div className="py-1">
              {themes.map(themeOption => (
                <button
                  key={themeOption.value}
                  type="button"
                  onClick={() => handleThemeChange(themeOption.value)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-200 ${
                    theme === themeOption.value
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {themeOption.icon}
                  <span className="flex-1 text-left">{themeOption.label}</span>
                  {themeOption.value === 'system' && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({resolvedTheme})
                    </span>
                  )}
                  {theme === themeOption.value && (
                    <svg
                      className="w-4 h-4 text-blue-600 dark:text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-label="Selected"
                      role="img"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
