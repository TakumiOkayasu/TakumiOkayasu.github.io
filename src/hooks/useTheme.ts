import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface UseThemeReturn {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useTheme = (): UseThemeReturn => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // システムのダークモード設定を監視
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }, []);

  // テーマを解決（system の場合はシステム設定を使用）
  const resolveTheme = useCallback(
    (currentTheme: Theme): 'light' | 'dark' => {
      if (currentTheme === 'system') {
        return getSystemTheme();
      }
      return currentTheme;
    },
    [getSystemTheme]
  );

  // DOMにテーマクラスを適用
  const applyTheme = useCallback((resolvedTheme: 'light' | 'dark') => {
    const root = document.documentElement;

    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  // テーマを設定
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  };

  // ライト/ダークを切り替え（systemの場合は現在の解決済みテーマの逆に設定）
  const toggleTheme = () => {
    if (theme === 'system') {
      // システムテーマの場合は、現在の解決済みテーマの逆に明示的に設定
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      // 明示的なテーマの場合は逆に切り替え
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  // 初期化とシステムテーマ変更の監視
  useEffect(() => {
    // ローカルストレージからテーマを読み込み
    const savedTheme = localStorage.getItem('theme') as Theme;
    const initialTheme = savedTheme || 'system';

    setThemeState(initialTheme);

    const resolved = resolveTheme(initialTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);

    // システムテーマの変更を監視
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // systemテーマが選択されている場合のみ反映
      if (initialTheme === 'system') {
        const newResolvedTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(newResolvedTheme);
        applyTheme(newResolvedTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [applyTheme, resolveTheme]);

  // テーマが変更された時にシステムテーマの監視を更新
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        const newResolvedTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(newResolvedTheme);
        applyTheme(newResolvedTheme);
      };

      mediaQuery.addEventListener('change', handleSystemThemeChange);

      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    }
  }, [theme, applyTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };
};
