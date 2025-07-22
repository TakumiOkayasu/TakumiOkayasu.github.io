import { describe, expect, test } from 'bun:test';
import { act, render } from '@testing-library/react';
import AboutSection from '../../src/components/AboutSection';
import type { PersonalInfo } from '../../src/types/types';
import '../../tests/setup'; // 必須！

// モックデータ
const mockPersonalInfo: PersonalInfo = {
  name: 'Takumi Okayasu',
  title: 'Software Engineer',
  description: 'Passionate software engineer with 5 years of experience',
  avatar: '/avatar.jpg',
  about:
    'I am a dedicated software engineer with expertise in modern web technologies including React, TypeScript, and Node.js.',
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

describe('AboutSection コンポーネント', () => {
  test('renders about section with personal info', () => {
    let getByRole: any;
    let getByText: any;
    
    act(() => {
      const result = render(<AboutSection personalInfo={mockPersonalInfo} />);
      getByRole = result.getByRole;
      getByText = result.getByText;
    });

    // セクション要素が存在することを確認
    const section = document.querySelector('#about');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('id', 'about');

    // タイトルが正しく表示されることを確認
    const title = getByRole('heading', { name: 'About' });
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-2xl', 'font-bold');

    // 自己紹介文が表示されることを確認
    const aboutText = getByText(mockPersonalInfo.about);
    expect(aboutText).toBeInTheDocument();
  });

  test('has correct styling classes', () => {
    let getByRole: any;
    let getByText: any;
    
    act(() => {
      const result = render(<AboutSection personalInfo={mockPersonalInfo} />);
      getByRole = result.getByRole;
      getByText = result.getByText;
    });

    const section = document.querySelector('#about');
    expect(section).toHaveClass('transition-colors', 'duration-300');

    const title = getByRole('heading');
    expect(title).toHaveClass('text-gray-900', 'dark:text-gray-100');

    const aboutText = getByText(mockPersonalInfo.about);
    expect(aboutText).toHaveClass('text-gray-700', 'dark:text-gray-300');
  });

  test('applies responsive padding classes', () => {
    let getByRole: any;
    let getByText: any;
    
    act(() => {
      const result = render(<AboutSection personalInfo={mockPersonalInfo} />);
      getByRole = result.getByRole;
      getByText = result.getByText;
    });

    const title = getByRole('heading');
    expect(title).toHaveClass('px-4', 'pb-3', 'pt-5');

    const aboutText = getByText(mockPersonalInfo.about);
    expect(aboutText).toHaveClass('px-4', 'pb-3', 'pt-1');
  });
});
