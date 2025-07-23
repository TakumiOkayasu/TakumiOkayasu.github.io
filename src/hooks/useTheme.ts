import { useEffect, useState } from 'react';

export const useTheme = () => {
  // 同期的に初期値を計算する関数
  const getInitialTheme = () => {
    // SSR環境対応
    if (typeof window === 'undefined') return false;
    
    const saved = localStorage.getItem('isDark');
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.warn('Failed to parse theme from localStorage:', error);
        localStorage.removeItem('isDark');
      }
    }
    
    // システムのテーマ設定を取得
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // 同期的に正しい初期値を設定
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    // DOMクラスを現在の状態と同期
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDark]);

  const toggle = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('isDark', JSON.stringify(newIsDark));
  };

  return { isDark, toggle };
};
