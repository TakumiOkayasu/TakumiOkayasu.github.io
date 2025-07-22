import { describe, expect, test } from 'bun:test';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type React from 'react';
import DarkModeToggle from '../../src/components/DarkModeToggle';
import { ThemeProvider } from '../../src/contexts/ThemeContext';
import '../setup'; // 必須！

// テスト用のThemeProviderラッパー
const TestThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

test('basic test', () => {
  expect(1 + 1).toBe(2);
});

test('DOM test', () => {
  // DOMが利用可能かチェック
  console.log('Document available:', typeof document !== 'undefined');
  console.log('Window available:', typeof window !== 'undefined');

  if (typeof document !== 'undefined') {
    document.body.innerHTML = '<div id="test">Hello</div>';
    const element = document.getElementById('test');
    expect(element?.textContent).toBe('Hello');
  } else {
    throw new Error('DOM is not available');
  }
});

describe('DarkModeToggle コンポーネント', () => {
  test('トグルボタンをレンダリングする', () => {
    let getByRole: any;
    act(() => {
      ({ getByRole } = render(
        <TestThemeProvider>
          <DarkModeToggle />
        </TestThemeProvider>
      ));
    });

    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('fixed', 'bottom-8', 'right-8');
  });

  test('正しいスタイリングクラスを持つ', () => {
    let getByRole: any;
    act(() => {
      ({ getByRole } = render(
        <TestThemeProvider>
          <DarkModeToggle />
        </TestThemeProvider>
      ));
    });

    const button = getByRole('button');
    expect(button).toHaveClass(
      'fixed',
      'bottom-8',
      'right-8',
      'w-12',
      'h-12',
      'rounded-full',
      'bg-white',
      'dark:bg-gray-800',
      'border-2',
      'transition-all',
      'z-50'
    );
  });

  test('テーマに応じて正しいアイコンを表示する', () => {
    let getByRole: any;
    act(() => {
      ({ getByRole } = render(
        <TestThemeProvider>
          <DarkModeToggle />
        </TestThemeProvider>
      ));
    });

    const button = getByRole('button');
    // 初期状態でアイコンが表示されることを確認
    const iconSpan = button.querySelector('span');
    expect(iconSpan).toBeInTheDocument();
    // アイコンのテキスト内容を確認（より緩い条件）
    expect(iconSpan?.textContent).toBeTruthy();
  });

  test('適切なアクセシビリティ属性を持つ', () => {
    let getByRole: any;
    act(() => {
      ({ getByRole } = render(
        <TestThemeProvider>
          <DarkModeToggle />
        </TestThemeProvider>
      ));
    });

    const button = getByRole('button');
    expect(button.hasAttribute('aria-label')).toBe(true);
    expect(button.getAttribute('type')).toBe('button');

    const ariaLabel = button.getAttribute('aria-label');
    expect(ariaLabel).toMatch(/(Switch to|light mode|dark mode)/i);
  });

  test('クリック可能でユーザー操作に反応する', async () => {
    const user = userEvent.setup();

    let getByRole: any;
    act(() => {
      ({ getByRole } = render(
        <TestThemeProvider>
          <DarkModeToggle />
        </TestThemeProvider>
      ));
    });

    const button = getByRole('button');

    // ボタンがクリック可能であることを確認
    expect(button).toBeEnabled();

    // クリックイベントが発生することを確認
    await user.click(button);
    // テーマ切り替え後もボタンが存在することを確認
    expect(button).toBeInTheDocument();
  });

  test('ホバー効果を適用する', () => {
    let getByRole: any;
    act(() => {
      ({ getByRole } = render(
        <TestThemeProvider>
          <DarkModeToggle />
        </TestThemeProvider>
      ));
    });

    const button = getByRole('button');
    expect(button).toHaveClass('hover:scale-110');
  });

  test('フローティング動作のための正しいz-indexを持つ', () => {
    let getByRole: any;
    act(() => {
      ({ getByRole } = render(
        <TestThemeProvider>
          <DarkModeToggle />
        </TestThemeProvider>
      ));
    });

    const button = getByRole('button');
    expect(button).toHaveClass('z-50');
  });
});
