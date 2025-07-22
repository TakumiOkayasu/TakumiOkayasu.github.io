import { describe, expect, test } from 'bun:test';
import { act, render } from '@testing-library/react';
import Header from '../../src/components/Header';
import '../../tests/setup'; // 必須！

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

describe('Header Component', () => {
  test('renders header with correct title', () => {
    let getByRole: any;
    let getByText: any;
    
    act(() => {
      const result = render(<Header />);
      getByRole = result.getByRole;
      getByText = result.getByText;
    });

    // ヘッダー要素が存在することを確認
    const header = getByRole('banner');
    expect(header).toBeInTheDocument();

    // タイトルテキストが正しく表示されることを確認
    const title = getByText('Tech Portfolio');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-lg', 'font-bold');
  });

  test('has correct styling classes', () => {
    let getByRole: any;
    
    act(() => {
      const result = render(<Header />);
      getByRole = result.getByRole;
    });

    const header = getByRole('banner');
    expect(header).toHaveClass(
      'flex',
      'items-center',
      'justify-between',
      'border-b',
      'bg-white',
      'dark:bg-gray-900',
      'transition-colors'
    );
  });

  test('applies dark mode classes correctly', () => {
    let getByRole: any;
    
    act(() => {
      const result = render(<Header />);
      getByRole = result.getByRole;
    });

    const header = getByRole('banner');
    // ダークモード用のクラスが存在することを確認
    expect(header.className).toContain('dark:bg-gray-900');
    expect(header.className).toContain('dark:border-gray-700');
  });
});
