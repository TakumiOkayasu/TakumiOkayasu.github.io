import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DarkModeToggle from '../../src/components/DarkModeToggle';
import { ThemeProvider } from '../../src/contexts/ThemeContext';
import '../../tests/setup';

// シンプルなテストコンポーネント
const TestComponent = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <h1 className="text-gray-900 dark:text-gray-100">Test Content</h1>
        <p className="text-gray-600 dark:text-gray-400">Test description</p>
        <button
          type="button"
          className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700"
        >
          Test Button
        </button>
        <DarkModeToggle />
      </div>
    </ThemeProvider>
  );
};

describe('ダークモード シンプル統合テスト', () => {
  beforeEach(() => {
    // localStorageをクリア
    localStorage.clear();
    // DOM クリーンアップ
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    // クリーンアップ
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  test('初期状態でライトモードが適用されている', () => {
    let container: any;
    act(() => {
      ({ container } = render(<TestComponent />));
    });

    // 初期状態でダーククラスがないことを確認
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // 背景色のクラスを確認
    const mainDiv = container.querySelector('.min-h-screen');
    expect(mainDiv).toHaveClass('bg-white');
  });

  test('ダークモードトグルボタンをクリックするとダークモードに切り替わる', async () => {
    const user = userEvent.setup();

    let getByRole: any;
    act(() => {
      ({ getByRole } = render(<TestComponent />));
    });

    // トグルボタンを取得
    const toggleButton = getByRole('button', { name: /switch to dark mode/i });
    expect(toggleButton).toBeInTheDocument();

    // ダークモードに切り替え
    await act(async () => {
      await user.click(toggleButton);
    });

    // ダーククラスが追加されたことを確認
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    // aria-labelが更新されたことを確認
    expect(toggleButton.getAttribute('aria-label')).toMatch(/switch to light mode/i);
  });

  test('ダークモードからライトモードに戻すことができる', async () => {
    const user = userEvent.setup();

    // 初期状態をダークモードに設定
    localStorage.setItem('theme', 'true');
    document.documentElement.classList.add('dark');

    let getByRole: any;
    act(() => {
      ({ getByRole } = render(<TestComponent />));
    });

    // トグルボタンを取得（ライトモードへの切り替えボタン）
    const toggleButton = await waitFor(() => {
      return getByRole('button', { name: /switch to light mode/i });
    });

    // ライトモードに切り替え
    await act(async () => {
      await user.click(toggleButton);
    });

    // ダーククラスが削除されたことを確認
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  test('複数回の切り替えが正常に動作する', async () => {
    const user = userEvent.setup();

    let getByRole: any;
    act(() => {
      ({ getByRole } = render(<TestComponent />));
    });

    const toggleButton = getByRole('button', { name: /switch to/i });

    // 5回連続で切り替え
    for (let i = 0; i < 5; i++) {
      const isDarkBefore = document.documentElement.classList.contains('dark');

      await act(async () => {
        await user.click(toggleButton);
      });

      await waitFor(() => {
        const isDarkAfter = document.documentElement.classList.contains('dark');
        expect(isDarkAfter).toBe(!isDarkBefore);
      });
    }
  });

  test('テーマ切り替え時にTailwind CSSのdark:プレフィックスが機能する', async () => {
    const user = userEvent.setup();

    let getByRole: any, getByText: any, container: any;
    act(() => {
      ({ getByRole, getByText, container } = render(<TestComponent />));
    });

    const toggleButton = getByRole('button', { name: /switch to/i });
    const heading = getByText('Test Content');
    const description = getByText('Test description');
    const button = getByText('Test Button');

    // 初期状態（ライトモード）のクラスを確認
    expect(heading).toHaveClass('text-gray-900', 'dark:text-gray-100');
    expect(description).toHaveClass('text-gray-600', 'dark:text-gray-400');
    expect(button).toHaveClass('bg-blue-500', 'dark:bg-blue-600');

    // ダークモードに切り替え
    await act(async () => {
      await user.click(toggleButton);
    });

    // ダークモードが適用されたことを確認
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    // クラスは変わらないが、dark:プレフィックスが有効になる
    expect(heading).toHaveClass('text-gray-900', 'dark:text-gray-100');
    expect(description).toHaveClass('text-gray-600', 'dark:text-gray-400');
    expect(button).toHaveClass('bg-blue-500', 'dark:bg-blue-600');
  });

  test('localStorage にテーマ設定が保存される', async () => {
    const user = userEvent.setup();

    let getByRole: any;
    act(() => {
      ({ getByRole } = render(<TestComponent />));
    });

    const toggleButton = getByRole('button', { name: /switch to/i });

    // ダークモードに切り替え
    await act(async () => {
      await user.click(toggleButton);
    });

    // localStorageに保存されたことを確認
    await waitFor(() => {
      const savedTheme = localStorage.getItem('theme');
      expect(savedTheme).toBe('true');
    });

    // ライトモードに戻す
    await act(async () => {
      await user.click(toggleButton);
    });

    // localStorageが更新されたことを確認
    await waitFor(() => {
      const savedTheme = localStorage.getItem('theme');
      expect(savedTheme).toBe('false');
    });
  });

  test('ページリロード後もテーマが維持される（シミュレーション）', async () => {
    const user = userEvent.setup();

    // 最初のレンダリング - ダークモードに設定
    let getByRole: any, unmount: any;
    act(() => {
      ({ getByRole, unmount } = render(<TestComponent />));
    });

    const toggleButton = getByRole('button', { name: /switch to/i });

    await act(async () => {
      await user.click(toggleButton);
    });

    // ダークモードが設定されたことを確認
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(localStorage.getItem('theme')).toBe('true');
    });

    // コンポーネントをアンマウント
    unmount();

    // 再レンダリング（ページリロードをシミュレート）
    act(() => {
      ({ getByRole } = render(<TestComponent />));
    });

    // ダークモードが維持されていることを確認
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    // ボタンのaria-labelもダークモード用になっていることを確認
    const newToggleButton = getByRole('button', { name: /switch to/i });
    expect(newToggleButton.getAttribute('aria-label')).toMatch(/switch to light mode/i);
  });

  test('システム設定を考慮して初期テーマを設定する', () => {
    // システム設定がダークモードの場合をシミュレート
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = mock((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: mock(() => {}),
      removeListener: mock(() => {}),
      addEventListener: mock(() => {}),
      removeEventListener: mock(() => {}),
      dispatchEvent: mock(() => true),
    }));

    let container: any;
    act(() => {
      ({ container } = render(<TestComponent />));
    });

    // システム設定に基づいてダークモードが適用されることを確認
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // matchMediaを元に戻す
    window.matchMedia = originalMatchMedia;
  });
});
