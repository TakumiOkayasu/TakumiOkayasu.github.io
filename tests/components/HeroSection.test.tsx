import { describe, expect, test } from 'bun:test';
import { act, render } from '@testing-library/react';
import HeroSection from '../../src/components/HeroSection';
import type { PersonalInfo } from '../../src/types/types';
import '../../tests/setup'; // 必須！

// モックデータ
const mockPersonalInfo: PersonalInfo = {
  name: 'Takumi Okayasu',
  title: 'Software Engineer',
  description:
    'Passionate software engineer with 5 years of experience in modern web technologies.',
  avatar: '/avatar.jpg',
  about: 'I am a dedicated software engineer...',
};

describe('HeroSection コンポーネント', () => {
  test('個人情報付きのヒーローセクションをレンダリングする', () => {
    let getByText: any;
    
    act(() => {
      const result = render(<HeroSection personalInfo={mockPersonalInfo} />);
      getByText = result.getByText;
    });

    // 名前が正しく表示されることを確認
    const name = getByText(mockPersonalInfo.name);
    expect(name).toBeInTheDocument();
    expect(name).toHaveClass('text-2xl', 'font-bold');

    // 職業が表示されることを確認
    const title = getByText(mockPersonalInfo.title);
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-blue-600', 'dark:text-blue-400');

    // 説明文が表示されることを確認
    const description = getByText(mockPersonalInfo.description);
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-gray-600', 'dark:text-gray-400');
  });

  test('正しい背景画像でアバターをレンダリングする', () => {
    act(() => {
      render(<HeroSection personalInfo={mockPersonalInfo} />);
    });

    // アバター要素を取得（background-imageを持つdiv）
    const avatarDiv = document.querySelector('[style*="background-image"]') as HTMLElement;
    expect(avatarDiv).toBeInTheDocument();
    expect(avatarDiv?.style.backgroundImage).toContain(mockPersonalInfo.avatar);
  });

  test('正しいレイアウトとスタイリングを持つ', () => {
    act(() => {
      render(<HeroSection personalInfo={mockPersonalInfo} />);
    });

    // メインセクションのクラスを確認
    const section = document.querySelector('section');
    expect(section).toHaveClass('flex', 'p-4');

    // アバターコンテナのクラスを確認
    const avatarDiv = document.querySelector('.rounded-full') as HTMLElement;
    expect(avatarDiv).toHaveClass(
      'bg-center',
      'bg-no-repeat',
      'aspect-square',
      'bg-cover',
      'rounded-full',
      'ring-4',
      'ring-gray-200',
      'dark:ring-gray-700'
    );
  });

  test('ダークモードスタイルを正しく適用する', () => {
    let getByText: any;
    
    act(() => {
      const result = render(<HeroSection personalInfo={mockPersonalInfo} />);
      getByText = result.getByText;
    });

    const name = getByText(mockPersonalInfo.name);
    expect(name.className).toContain('dark:text-gray-100');

    const title = getByText(mockPersonalInfo.title);
    expect(title.className).toContain('dark:text-blue-400');

    const description = getByText(mockPersonalInfo.description);
    expect(description.className).toContain('dark:text-gray-400');
  });

  test('レスポンシブデザインクラスを持つ', () => {
    let getByText: any;
    
    act(() => {
      const result = render(<HeroSection personalInfo={mockPersonalInfo} />);
      getByText = result.getByText;
    });

    const description = getByText(mockPersonalInfo.description);
    expect(description).toHaveClass('max-w-2xl');

    const avatarDiv = document.querySelector('.rounded-full') as HTMLElement;
    expect(avatarDiv).toHaveClass('min-h-32', 'w-32');
  });
});
