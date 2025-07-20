import type React from 'react';
import { createContext, useContext } from 'react';
import { useTheme } from '../hooks/useTheme';

interface ThemeContextType {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeValue = useTheme();
  return <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
