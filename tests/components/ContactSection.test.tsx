import { describe, expect, test } from 'bun:test';
import { act, render } from '@testing-library/react';
import type React from 'react';
import ContactSection from '../../src/components/ContactSection';
import { ThemeProvider } from '../../src/contexts/ThemeContext';
import type { ContactInfo } from '../../src/types/types';
import '../../tests/setup'; // 必須！

// モックデータ
const mockContactInfo: ContactInfo = {
  email: 'takumi@example.com',
  github: 'https://github.com/takumiokayasu',
};

// テスト用のThemeProviderラッパー
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

describe('ContactSection コンポーネント', () => {
  test('renders contact section with title', () => {
    let getByText: any;
    
    act(() => {
      const result = render(
        <TestWrapper>
          <ContactSection contactInfo={mockContactInfo} />
        </TestWrapper>
      );
      getByText = result.getByText;
    });

    // セクション要素が存在することを確認
    const section = document.querySelector('#contact');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('id', 'contact');

    // メインタイトルが表示されることを確認
    const title = getByText('Get in Touch');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-3xl', 'font-bold');

    // 説明文が表示されることを確認
    const description = getByText('連絡先はこちら');
    expect(description).toBeInTheDocument();
  });

  test('renders contact information', () => {
    let getByText: any;
    
    act(() => {
      const result = render(
        <TestWrapper>
          <ContactSection contactInfo={mockContactInfo} />
        </TestWrapper>
      );
      getByText = result.getByText;
    });

    // メールアドレスが表示されることを確認
    const email = getByText(mockContactInfo.email);
    expect(email).toBeInTheDocument();

    // GitHubが表示されることを確認
    const github = getByText(mockContactInfo.github);
    expect(github).toBeInTheDocument();
  });

  test('renders contact items with proper styling', () => {
    act(() => {
      render(
        <TestWrapper>
          <ContactSection contactInfo={mockContactInfo} />
        </TestWrapper>
      );
    });

    // 連絡先アイテムのコンテナを確認
    const contactItems = document.querySelectorAll('.bg-gray-100');
    expect(contactItems.length).toBeGreaterThan(0);

    // ホバー効果のクラスを確認
    contactItems.forEach(item => {
      expect(item).toHaveClass(
        'flex',
        'items-center',
        'gap-4',
        'bg-gray-100',
        'dark:bg-gray-800',
        'hover:bg-gray-200',
        'dark:hover:bg-gray-700'
      );
    });
  });

  test('displays icons for contact items', () => {
    act(() => {
      render(
        <TestWrapper>
          <ContactSection contactInfo={mockContactInfo} />
        </TestWrapper>
      );
    });

    // アイコンコンテナが存在することを確認
    const iconContainers = document.querySelectorAll('.rounded-lg.size-10');
    expect(iconContainers.length).toBe(2); // email + github

    iconContainers.forEach(container => {
      expect(container).toHaveClass('bg-gray-300', 'dark:bg-gray-700', 'rounded-lg', 'size-10');
    });
  });

  test('applies full screen height', () => {
    act(() => {
      render(
        <TestWrapper>
          <ContactSection contactInfo={mockContactInfo} />
        </TestWrapper>
      );
    });

    const section = document.querySelector('#contact');
    expect(section).toHaveClass('min-h-screen');
  });

  test('has responsive layout', () => {
    act(() => {
      render(
        <TestWrapper>
          <ContactSection contactInfo={mockContactInfo} />
        </TestWrapper>
      );
    });

    // flex-1とmax-widthクラスを確認
    const container = document.querySelector('.max-w-4xl');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('flex', 'flex-col', 'max-w-4xl', 'flex-1');
  });

  test('applies dark mode styles', () => {
    let getByText: any;
    
    act(() => {
      const result = render(
        <TestWrapper>
          <ContactSection contactInfo={mockContactInfo} />
        </TestWrapper>
      );
      getByText = result.getByText;
    });

    const section = document.querySelector('#contact');
    expect(section).toHaveClass('transition-colors', 'duration-300');

    const title = getByText('Get in Touch');
    expect(title.className).toContain('dark:text-gray-100');

    const description = getByText('連絡先はこちら');
    expect(description.className).toContain('dark:text-gray-400');

    // 連絡先の値テキストのダークモードスタイル
    const email = getByText(mockContactInfo.email);
    expect(email.className).toContain('dark:text-gray-100');
  });

  test('handles text truncation for long contact info', () => {
    let getAllByText: any;
    
    act(() => {
      const result = render(
        <TestWrapper>
          <ContactSection contactInfo={mockContactInfo} />
        </TestWrapper>
      );
      getAllByText = result.getAllByText;
    });

    // 連絡先の値のテキスト要素を確認
    const contactValues = getAllByText(
      new RegExp(`${mockContactInfo.email}|${mockContactInfo.github}`)
    );
    contactValues.forEach(value => {
      expect(value).toHaveClass('flex-1', 'truncate');
    });
  });
});
