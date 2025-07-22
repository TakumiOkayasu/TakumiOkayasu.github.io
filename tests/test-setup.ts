// @testing-library/jest-dom をインポート
import '@testing-library/jest-dom';
import { afterAll, beforeEach } from 'bun:test';
import { GlobalRegistrator } from '@happy-dom/global-registrator';

// ブラウザ環境をシミュレート
GlobalRegistrator.register();

// テスト前にDOMをクリーンアップ
beforeEach(() => {
  document.body.innerHTML = '';

  // localStorage をモック
  Object.defineProperty(window, 'localStorage', {
    writable: true,
    value: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    },
  });

  // matchMedia をモック
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: () => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
});

// テスト後にクリーンアップ
afterAll(() => {
  GlobalRegistrator.unregister();
});
