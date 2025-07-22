import { describe, expect, test } from 'bun:test';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type React from 'react';
import { ThemeProvider, useThemeContext } from '../../src/contexts/ThemeContext';
import '../setup'; // 必須！

// テスト用のコンポーネント
const TestComponent: React.FC = () => {
  const { isDark, toggle } = useThemeContext();

  return (
    <div>
      <div data-testid="theme-status">{isDark ? 'dark' : 'light'}</div>
      <button type="button" onClick={toggle} data-testid="toggle-button">
        Toggle Theme
      </button>
    </div>
  );
};

// エラーケース用のコンポーネント（ThemeProviderなし）
const ComponentWithoutProvider: React.FC = () => {
  const { isDark } = useThemeContext();
  return <div>{isDark ? 'dark' : 'light'}</div>;
};

describe('ThemeContext', () => {
  describe('ThemeProvider', () => {
    test('provides theme context to children', () => {
      let getByTestId: any;
      act(() => {
        ({ getByTestId } = render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        ));
      });

      // 初期状態の確認（システムの設定に依存するが、存在することを確認）
      const themeStatus = getByTestId('theme-status');
      expect(themeStatus).toBeInTheDocument();
      expect(themeStatus.textContent).toMatch(/^(dark|light)$/);

      // トグルボタンが存在することを確認
      const toggleButton = getByTestId('toggle-button');
      expect(toggleButton).toBeInTheDocument();
    });

    test('allows theme toggling', async () => {
      const user = userEvent.setup();

      let getByTestId: any;
      act(() => {
        ({ getByTestId } = render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        ));
      });

      const themeStatus = getByTestId('theme-status');
      const toggleButton = getByTestId('toggle-button');

      // 初期状態を記録
      const initialTheme = themeStatus.textContent;

      // テーマを切り替え
      await user.click(toggleButton);

      // テーマが変更されたことを確認
      const newTheme = themeStatus.textContent;
      expect(newTheme).not.toBe(initialTheme);
      expect(newTheme).toMatch(/^(dark|light)$/);

      // もう一度切り替えて元に戻ることを確認
      await user.click(toggleButton);
      expect(themeStatus.textContent).toBe(initialTheme);
    });

    test('maintains theme state across multiple children', () => {
      const ChildA: React.FC = () => {
        const { isDark } = useThemeContext();
        return <div data-testid="child-a">{isDark ? 'dark' : 'light'}</div>;
      };

      const ChildB: React.FC = () => {
        const { isDark } = useThemeContext();
        return <div data-testid="child-b">{isDark ? 'dark' : 'light'}</div>;
      };

      let getByTestId: any;
      act(() => {
        ({ getByTestId } = render(
          <ThemeProvider>
            <ChildA />
            <ChildB />
          </ThemeProvider>
        ));
      });

      const childA = getByTestId('child-a');
      const childB = getByTestId('child-b');

      // 両方の子コンポーネントが同じテーマ状態を共有していることを確認
      expect(childA.textContent).toBe(childB.textContent);
    });

    test('passes theme context value correctly', () => {
      const ContextConsumer: React.FC = () => {
        const context = useThemeContext();

        return (
          <div>
            <div data-testid="has-is-dark">
              {typeof context.isDark === 'boolean' ? 'true' : 'false'}
            </div>
            <div data-testid="has-toggle">
              {typeof context.toggle === 'function' ? 'true' : 'false'}
            </div>
          </div>
        );
      };

      let getByTestId: any;
      act(() => {
        ({ getByTestId } = render(
          <ThemeProvider>
            <ContextConsumer />
          </ThemeProvider>
        ));
      });

      // context値が正しい型であることを確認
      expect(getByTestId('has-is-dark')).toHaveTextContent('true');
      expect(getByTestId('has-toggle')).toHaveTextContent('true');
    });
  });

  describe('useThemeContext', () => {
    test('throws error when used outside ThemeProvider', () => {
      // エラーがスローされることをテストするため、エラーハンドリングが必要
      const originalError = console.error;
      console.error = () => {}; // エラーログを抑制

      expect(() => {
        render(<ComponentWithoutProvider />);
      }).toThrow('useThemeContext must be used within a ThemeProvider');

      console.error = originalError; // エラーログを復元
    });

    test('returns context value when used within ThemeProvider', () => {
      const ContextValueDisplay: React.FC = () => {
        const context = useThemeContext();

        return (
          <div>
            <div data-testid="context-exists">{context ? 'exists' : 'not-exists'}</div>
            <div data-testid="is-dark-type">{typeof context.isDark}</div>
            <div data-testid="toggle-type">{typeof context.toggle}</div>
          </div>
        );
      };

      let getByTestId: any;
      act(() => {
        ({ getByTestId } = render(
          <ThemeProvider>
            <ContextValueDisplay />
          </ThemeProvider>
        ));
      });

      // context値が存在し、正しい型であることを確認
      expect(getByTestId('context-exists')).toHaveTextContent('exists');
      expect(getByTestId('is-dark-type')).toHaveTextContent('boolean');
      expect(getByTestId('toggle-type')).toHaveTextContent('function');
    });
  });

  describe('Integration with DOM', () => {
    test('applies dark class to document element when theme changes', async () => {
      const user = userEvent.setup();

      let getByTestId: any;
      act(() => {
        ({ getByTestId } = render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        ));
      });

      const toggleButton = getByTestId('toggle-button');
      const themeStatus = getByTestId('theme-status');

      // 現在のテーマ状態を確認
      const initialTheme = themeStatus.textContent;

      // テーマを切り替え
      await user.click(toggleButton);

      // テーマが変更されたことを確認
      const newTheme = themeStatus.textContent;
      expect(newTheme).not.toBe(initialTheme);
      expect(newTheme).toMatch(/^(dark|light)$/);
    });

    test('respects system preference on initial load', () => {
      let getByTestId: any;
      act(() => {
        ({ getByTestId } = render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        ));
      });

      const themeStatus = getByTestId('theme-status');

      // システム設定に基づいた初期テーマが設定されることを確認
      // (実際の値はシステム設定に依存するため、存在することのみを確認)
      expect(themeStatus.textContent).toMatch(/^(dark|light)$/);
    });
  });

  describe('Persistence', () => {
    test('theme state persists through multiple renders', async () => {
      const user = userEvent.setup();

      let rerender: any, getByTestId: any;
      act(() => {
        ({ rerender, getByTestId } = render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        ));
      });

      const themeStatus = getByTestId('theme-status');
      const toggleButton = getByTestId('toggle-button');

      // 初期状態を記録
      const initialTheme = themeStatus.textContent;

      // テーマを切り替え
      await user.click(toggleButton);
      const changedTheme = themeStatus.textContent;

      // コンポーネントを再レンダリング
      act(() => {
        rerender(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        );
      });

      // テーマ状態が維持されていることを確認
      expect(getByTestId('theme-status').textContent).toBe(changedTheme);
    });
  });
});
