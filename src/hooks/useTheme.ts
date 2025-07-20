import { useEffect, useState } from 'react';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 初期設定
    const saved = localStorage.getItem('isDark');
    const initialDark = saved
      ? JSON.parse(saved)
      : window.matchMedia('(prefers-color-scheme: dark)').matches;

    setIsDark(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);
  }, []);

  const toggle = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('isDark', JSON.stringify(newIsDark));
  };

  return { isDark, toggle };
};
