import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';
import '../../tests/setup';

// モックデータ
const mockData = {
  '/data/personal.json': {
    name: 'Test User',
    title: 'Software Engineer',
    description: 'Test description',
    avatar: '/avatar.jpg',
    about: 'Test about',
  },
  '/data/skills.json': [],
  '/data/experiences.json': [],
  '/data/projects.json': [],
  '/data/contact.json': {
    email: 'test@example.com',
    github: 'https://github.com/test',
  },
};

describe('ダークモード統合テスト', () => {
  // localStorage と matchMedia のモック
  const localStorageMock = {
    getItem: mock((key: string) => null),
    setItem: mock((key: string, value: string) => {}),
    removeItem: mock((key: string) => {}),
    clear: mock(() => {}),
  };

  const matchMediaMock = mock((query: string) => ({
    matches: query === '(prefers-color-scheme: dark)' ? false : false,
    media: query,
    onchange: null,
    addListener: mock(() => {}),
    removeListener: mock(() => {}),
    addEventListener: mock(() => {}),
    removeEventListener: mock(() => {}),
    dispatchEvent: mock(() => true),
  }));

  beforeEach(() => {
    // fetchをモック化
    global.fetch = mock((url: string) => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData[url as keyof typeof mockData] || {}),
      } as Response);
    });

    // localStorage のモック設定
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // matchMedia のモック設定
    Object.defineProperty(window, 'matchMedia', {
      value: matchMediaMock,
      writable: true,
    });

    // DOM クリーンアップ
    document.documentElement.classList.remove('dark');

    // document.documentElement.classList.toggle のモック
    const originalToggle = document.documentElement.classList.toggle;
    document.documentElement.classList.toggle = mock((className: string, force?: boolean) => {
      if (className === 'dark') {
        if (force === true) {
          document.documentElement.classList.add('dark');
          return true;
        } else if (force === false) {
          document.documentElement.classList.remove('dark');
          return false;
        } else {
          // force が undefined の場合、現在の状態を切り替え
          if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            return false;
          } else {
            document.documentElement.classList.add('dark');
            return true;
          }
        }
      }
      return originalToggle.call(document.documentElement.classList, className, force);
    });

    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    matchMediaMock.mockClear();
  });

  afterEach(() => {
    // モックをリセット
    if (localStorageMock.getItem && 'mockRestore' in localStorageMock.getItem) {
      (localStorageMock.getItem as any).mockRestore();
    }
    if (localStorageMock.setItem && 'mockRestore' in localStorageMock.setItem) {
      (localStorageMock.setItem as any).mockRestore();
    }
    if (global.fetch && 'mockRestore' in global.fetch) {
      (global.fetch as any).mockRestore();
    }
  });

  test('ユーザーがボタンをクリックしてダークモードとライトモードを切り替えられる', async () => {
    const user = userEvent.setup();
    
    let getByRole: any, getByText: any;
    act(() => {
      ({ getByRole, getByText } = render(<App />));
    });

    // 初期状態の確認（ライトモード）
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    
    // ダークモードトグルボタンを探す
    const toggleButton = await waitFor(() => {
      return getByRole('button', { name: /switch to/i });
    });
    expect(toggleButton).toBeInTheDocument();

    // ダークモードに切り替え
    await act(async () => {
      await user.click(toggleButton);
    });

    // ダークモードが適用されたことを確認
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    // localStorageに保存されたことを確認
    expect(localStorageMock.setItem).toHaveBeenCalledWith('isDark', 'true');

    // ライトモードに戻す
    await act(async () => {
      await user.click(toggleButton);
    });

    // ライトモードが適用されたことを確認
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    // localStorageが更新されたことを確認
    expect(localStorageMock.setItem).toHaveBeenLastCalledWith('theme', 'false');
  });

  test('複数回の切り替えが正常に動作する', async () => {
    const user = userEvent.setup();
    
    let getByRole: any;
    act(() => {
      ({ getByRole } = render(<App />));
    });

    const toggleButton = await waitFor(() => {
      return getByRole('button', { name: /switch to/i });
    });

    // 5回連続で切り替えテスト
    for (let i = 0; i < 5; i++) {
      await act(async () => {
        await user.click(toggleButton);
      });

      const isDark = i % 2 === 0;
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(isDark);
      });
    }

    // localStorageが適切に更新されたことを確認
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(5);
  });

  test('localStorage から保存されたテーマを読み込む', async () => {
    // ダークモードが保存されている状態をシミュレート
    localStorageMock.getItem.mockReturnValue('true');

    let getByRole: any;
    act(() => {
      ({ getByRole } = render(<App />));
    });

    // 初期状態でダークモードが適用されていることを確認
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    // localStorageから読み込まれたことを確認
    expect(localStorageMock.getItem).toHaveBeenCalledWith('isDark');
  });

  test('システム設定がダークモードの場合、初期状態でダークモードになる', async () => {
    // システム設定がダークモードの状態をシミュレート
    matchMediaMock.mockReturnValue({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: mock(() => {}),
      removeListener: mock(() => {}),
      addEventListener: mock(() => {}),
      removeEventListener: mock(() => {}),
      dispatchEvent: mock(() => true),
    });

    let getByRole: any;
    act(() => {
      ({ getByRole } = render(<App />));
    });

    // 初期状態でダークモードが適用されていることを確認
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  test('UIコンポーネントがテーマ変更に応じて正しくスタイルを更新する', async () => {
    const user = userEvent.setup();
    
    let getByRole: any, container: any;
    act(() => {
      ({ getByRole, container } = render(<App />));
    });

    const toggleButton = await waitFor(() => {
      return getByRole('button', { name: /switch to/i });
    });

    // 初期状態（ライトモード）のスタイルを確認
    const mainElement = container.querySelector('.min-h-screen');
    expect(mainElement).toHaveClass('bg-white', 'dark:bg-gray-900');

    // ダークモードに切り替え
    await act(async () => {
      await user.click(toggleButton);
    });

    // クラスが正しく適用されていることを確認
    await waitFor(() => {
      expect(mainElement).toHaveClass('bg-white', 'dark:bg-gray-900');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  test('エラーハンドリング: localStorageが利用できない場合でも動作する', async () => {
    // localStorageをnullに設定してエラーをシミュレート
    Object.defineProperty(window, 'localStorage', {
      value: null,
      writable: true,
    });

    const user = userEvent.setup();
    
    let getByRole: any;
    act(() => {
      ({ getByRole } = render(<App />));
    });

    const toggleButton = await waitFor(() => {
      return getByRole('button', { name: /switch to/i });
    });

    // エラーが発生しても切り替えが動作することを確認
    await act(async () => {
      await user.click(toggleButton);
    });

    // DOMクラスは更新される（localStorageには保存されないが）
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  test('アクセシビリティ: aria-labelが正しく更新される', async () => {
    const user = userEvent.setup();
    
    let getByRole: any;
    act(() => {
      ({ getByRole } = render(<App />));
    });

    const toggleButton = await waitFor(() => {
      return getByRole('button', { name: /switch to/i });
    });

    // 初期状態のaria-labelを確認
    const initialAriaLabel = toggleButton.getAttribute('aria-label');
    expect(initialAriaLabel).toMatch(/switch to (dark mode|light mode)/i);

    // 切り替え後のaria-labelが更新されることを確認
    await act(async () => {
      await user.click(toggleButton);
    });

    await waitFor(() => {
      const updatedAriaLabel = toggleButton.getAttribute('aria-label');
      expect(updatedAriaLabel).not.toBe(initialAriaLabel);
      expect(updatedAriaLabel).toMatch(/switch to (dark mode|light mode)/i);
    });
  });

  test('リロード後もテーマ設定が維持される（シミュレーション）', async () => {
    const user = userEvent.setup();
    
    // 最初のレンダリング
    let getByRole: any, unmount: any;
    act(() => {
      ({ getByRole, unmount } = render(<App />));
    });

    const toggleButton = await waitFor(() => {
      return getByRole('button', { name: /switch to/i });
    });

    // ダークモードに切り替え
    await act(async () => {
      await user.click(toggleButton);
    });

    // localStorageに保存されたことを確認
    expect(localStorageMock.setItem).toHaveBeenCalledWith('isDark', 'true');

    // アンマウント（ページ離脱をシミュレート）
    unmount();

    // localStorageから読み込まれる値を設定
    localStorageMock.getItem.mockReturnValue('true');

    // 再レンダリング（ページリロードをシミュレート）
    act(() => {
      ({ getByRole } = render(<App />));
    });

    // ダークモードが維持されていることを確認
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });
});