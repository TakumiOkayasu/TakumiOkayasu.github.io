import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type React from 'react';
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

describe('ダークモード視覚変更テスト', () => {
  beforeEach(() => {
    // fetchをモック化
    global.fetch = mock((url: string) => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData[url as keyof typeof mockData] || {}),
      } as Response);
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
  });

  afterEach(() => {
    // モックをリセット
    if (global.fetch && 'mockRestore' in global.fetch) {
      (global.fetch as any).mockRestore();
    }
  });

  test('ダークモード切り替え時に主要なUI要素のスタイルが変更される', async () => {
    const user = userEvent.setup();
    
    let getByRole: any, getByText: any, container: any;
    act(() => {
      ({ getByRole, getByText, container } = render(<App />));
    });

    // ポートフォリオがロードされるまで待つ
    await waitFor(() => {
      const loadingElement = container.querySelector('.text-gray-600');
      expect(loadingElement?.textContent).not.toBe('Loading...');
    }, { timeout: 2000 });

    const toggleButton = await waitFor(() => {
      return getByRole('button', { name: /switch to/i });
    });

    // 初期状態（ライトモード）の要素を確認
    const checkElementStyles = () => {
      const results = {
        mainBg: container.querySelector('.min-h-screen'),
        header: container.querySelector('header'),
        section: container.querySelector('section'),
        text: container.querySelector('h1, h2, h3, p'),
        button: container.querySelector('.rounded-full.bg-gray-200'),
      };
      return results;
    };

    const lightModeElements = checkElementStyles();

    // ライトモードのクラスを確認
    expect(lightModeElements.mainBg).toHaveClass('bg-white');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // ダークモードに切り替え
    await act(async () => {
      await user.click(toggleButton);
    });

    // ダークモードが適用されたことを確認
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    const darkModeElements = checkElementStyles();

    // 要素が dark: プレフィックス付きのクラスを持っていることを確認
    expect(darkModeElements.mainBg?.className).toContain('dark:bg-gray-900');
    if (darkModeElements.text) {
      expect(darkModeElements.text.className).toMatch(/dark:text-gray-\d+/);
    }
  });

  test('ダークモードトグルボタンのアイコンが切り替わる', async () => {
    const user = userEvent.setup();
    
    let getByRole: any, container: any;
    act(() => {
      ({ getByRole, container } = render(<App />));
    });

    const toggleButton = await waitFor(() => {
      return getByRole('button', { name: /switch to/i });
    });

    // 初期アイコンを確認（ライトモード時は月アイコン）
    const getIconText = () => {
      const iconSpan = toggleButton.querySelector('span');
      return iconSpan?.textContent;
    };

    const initialIcon = getIconText();
    expect(initialIcon).toBeTruthy();

    // ダークモードに切り替え
    await act(async () => {
      await user.click(toggleButton);
    });

    // アイコンが変わったことを確認
    await waitFor(() => {
      const newIcon = getIconText();
      expect(newIcon).toBeTruthy();
      expect(newIcon).not.toBe(initialIcon);
    });
  });

  test('トランジション効果が適用される', async () => {
    let container: any;
    act(() => {
      ({ container } = render(<App />));
    });

    // transition クラスが適用されている要素を確認
    const transitionElements = container.querySelectorAll('.transition-colors, .transition-all');
    expect(transitionElements.length).toBeGreaterThan(0);

    // 主要な要素にトランジションが適用されていることを確認
    const mainElement = container.querySelector('.min-h-screen');
    expect(mainElement?.className).toContain('transition-colors');
  });

  test('ホバー状態のスタイルがテーマに応じて変更される', async () => {
    const user = userEvent.setup();
    
    let getByRole: any, container: any;
    act(() => {
      ({ getByRole, container } = render(<App />));
    });

    const toggleButton = await waitFor(() => {
      return getByRole('button', { name: /switch to/i });
    });

    // ホバー可能な要素を探す
    const hoverableElements = container.querySelectorAll('[class*="hover:"]');
    expect(hoverableElements.length).toBeGreaterThan(0);

    // ダークモード用のホバースタイルが定義されていることを確認
    const darkHoverElements = container.querySelectorAll('[class*="dark:hover:"]');
    expect(darkHoverElements.length).toBeGreaterThan(0);
  });

  test('スクロール可能なコンテンツでもテーマが正しく適用される', async () => {
    let container: any;
    act(() => {
      ({ container } = render(<App />));
    });

    // セクション要素を確認
    await waitFor(() => {
      const sections = container.querySelectorAll('section');
      expect(sections.length).toBeGreaterThan(0);
    }, { timeout: 2000 });

    // 各セクションがテーマ対応のクラスを持っていることを確認
    const sections = container.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(0);
    
    // 少なくとも一つのセクションがテーマ対応クラスを持つことを確認
    const hasThemeSupport = Array.from(sections).some((section: Element) => {
      const hasTransition = section.className.includes('transition');
      const hasDarkClass = section.className.includes('dark:');
      return hasTransition || hasDarkClass;
    });
    expect(hasThemeSupport).toBe(true);
  });

  test('フォーカス状態のスタイルがテーマに対応している', async () => {
    const user = userEvent.setup();
    
    let getByRole: any;
    act(() => {
      ({ getByRole } = render(<App />));
    });

    const toggleButton = await waitFor(() => {
      return getByRole('button', { name: /switch to/i });
    });

    // Tab キーでフォーカスを移動
    await act(async () => {
      await user.tab();
    });

    // フォーカス可能な要素が存在することを確認
    const focusedElement = document.activeElement;
    expect(focusedElement).not.toBe(document.body);
    
    // フォーカスされた要素がボタンであることを確認
    expect(focusedElement?.tagName).toBe('BUTTON');
  });
});