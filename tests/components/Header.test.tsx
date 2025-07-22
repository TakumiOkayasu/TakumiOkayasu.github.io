import { describe, expect, test } from 'bun:test';
import { act, render } from '@testing-library/react';
import Header from '../../src/components/Header';
import '../../tests/setup'; // 必須！

describe('Header コンポーネント', () => {
  test('正しいタイトルでヘッダーをレンダリングする', () => {
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

  test('正しいスタイリングクラスを持つ', () => {
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

  test('ダークモードクラスを正しく適用する', () => {
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
