import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type React from 'react';
import Portfolio from '../../src/components/Portfolio';
import { ThemeProvider } from '../../src/contexts/ThemeContext';
import type {
  ContactInfo,
  Experience,
  PersonalInfo,
  Project,
  SkillCategory,
} from '../../src/types/types';
import '../setup'; // 必須！

// テスト用のThemeProviderラッパー
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

// 基本的な統合テスト用のモックデータ
const mockPersonalInfo: PersonalInfo = {
  name: 'Takumi Okayasu',
  title: 'Software Engineer',
  description: 'Passionate developer with expertise in modern web technologies.',
  avatar: '/test-avatar.jpg',
  about: 'I specialize in React, TypeScript, and full-stack development.',
};

const mockSkillCategories: SkillCategory[] = [
  {
    id: 1,
    name: 'Frontend',
    skills: [
      { name: 'React', level: 'Advanced' as const, years: 4, description: 'UI framework' },
      { name: 'TypeScript', level: 'Advanced' as const, years: 3, description: 'Type-safe JS' },
    ],
  },
];

const mockExperiences: Experience[] = [
  {
    id: 1,
    title: 'Senior Developer',
    position: 'Senior Developer',
    company: 'TechCorp',
    period: '2022 - Present',
    description: 'Lead development of web applications.',
  },
];

const mockProjects: Project[] = [
  {
    id: 1,
    title: 'Portfolio Website',
    description: 'Personal portfolio built with React and TypeScript.',
    technologies: ['React', 'TypeScript', 'Tailwind'],
  },
];

const mockContactInfo: ContactInfo = {
  email: 'takumi@example.com',
  github: 'https://github.com/takumiokayasu',
};

describe('基本的な統合テスト', () => {
  let originalFetch: any;

  beforeEach(() => {
    localStorage.clear();
    
    // DOM classList操作をモック
    Object.defineProperty(document.documentElement, 'classList', {
      value: {
        contains: mock(() => false),
        add: mock(() => {}),
        remove: mock(() => {}),
        toggle: mock(() => {}),
      },
      writable: true,
    });

    // matchMediaをモック
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mock(() => ({
        matches: false,
        addListener: mock(() => {}),
        removeListener: mock(() => {}),
      })),
    });

    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    localStorage.clear();
  });

  test('ポートフォリオ全体の統合動作確認', async () => {
    // 正常なAPIレスポンスをモック
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock((url: string) => {
      const mockData = {
        '/data/personal.json': mockPersonalInfo,
        '/data/skills.json': mockSkillCategories,
        '/data/experiences.json': mockExperiences,
        '/data/projects.json': mockProjects,
        '/data/contact.json': mockContactInfo,
      };

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData[url as keyof typeof mockData]),
      } as Response);
    });

    let getByText: any, getByRole: any, queryByText: any;

    await act(async () => {
      const result = render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      getByText = result.getByText;
      getByRole = result.getByRole;
      queryByText = result.queryByText;
    });

    // データ読み込み完了を待機
    await waitFor(() => {
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    // ローディング状態が終了していることを確認
    expect(queryByText('Loading...')).not.toBeInTheDocument();

    // 主要セクションの存在確認
    expect(getByText('Tech Portfolio')).toBeInTheDocument(); // ヘッダー
    expect(getByText(mockPersonalInfo.title)).toBeInTheDocument(); // ヒーローセクション
    expect(getByText('About')).toBeInTheDocument(); // アバウトセクション
    expect(getByText('Skills')).toBeInTheDocument(); // スキルセクション
    expect(getByText('Work Experience')).toBeInTheDocument(); // 経験セクション
    expect(getByText('Projects')).toBeInTheDocument(); // プロジェクトセクション
    expect(getByText('Get in Touch')).toBeInTheDocument(); // コンタクトセクション

    // ダークモードトグルの存在確認
    const toggleButton = getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  test('ダークモード切り替え機能の統合確認', async () => {
    // 正常なAPIレスポンスをモック
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock((url: string) => {
      const mockData = {
        '/data/personal.json': mockPersonalInfo,
        '/data/skills.json': mockSkillCategories,
        '/data/experiences.json': mockExperiences,
        '/data/projects.json': mockProjects,
        '/data/contact.json': mockContactInfo,
      };

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData[url as keyof typeof mockData]),
      } as Response);
    });

    const user = userEvent.setup();
    let getByText: any, getByRole: any;

    await act(async () => {
      const result = render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      getByText = result.getByText;
      getByRole = result.getByRole;
    });

    // データ読み込み完了を待機
    await waitFor(() => {
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    const toggleButton = getByRole('button');
    
    // 初期状態の確認
    expect(localStorage.getItem('isDark')).toBe(null);
    
    // ダークモードに切り替え
    await act(async () => {
      await user.click(toggleButton);
    });

    // ダークモード状態の確認
    await waitFor(() => {
      expect(localStorage.getItem('isDark')).toBe('true');
    });

    // ライトモードに戻す
    await act(async () => {
      await user.click(toggleButton);
    });

    // ライトモード状態の確認
    await waitFor(() => {
      expect(localStorage.getItem('isDark')).toBe('false');
    });
  });

  test('エラーハンドリングの統合確認', async () => {
    // APIエラーをシミュレート
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock(() => Promise.reject(new Error('Network Error')));

    // consoleエラーをモック
    const originalConsoleError = console.error;
    const consoleSpy = mock(() => {});
    console.error = consoleSpy;

    let getByText: any, queryByText: any;

    await act(async () => {
      const result = render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      getByText = result.getByText;
      queryByText = result.queryByText;
    });

    // エラー時のローディング継続を確認
    await waitFor(() => {
      expect(getByText('Loading...')).toBeInTheDocument();
    }, { timeout: 3000 });

    // エラーログが出力されることを確認
    expect(consoleSpy).toHaveBeenCalledWith('Error loading data:', expect.any(Error));

    // console.errorを復元
    console.error = originalConsoleError;
  });

  test('レスポンシブデザインの統合確認', async () => {
    // 正常なAPIレスポンスをモック
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock((url: string) => {
      const mockData = {
        '/data/personal.json': mockPersonalInfo,
        '/data/skills.json': mockSkillCategories,
        '/data/experiences.json': mockExperiences,
        '/data/projects.json': mockProjects,
        '/data/contact.json': mockContactInfo,
      };

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData[url as keyof typeof mockData]),
      } as Response);
    });

    let getByText: any;

    await act(async () => {
      const result = render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      getByText = result.getByText;
    });

    // データ読み込み完了を待機
    await waitFor(() => {
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    // レスポンシブクラスの確認
    const mainElement = document.querySelector('main');
    expect(mainElement).toHaveClass('px-4', 'md:px-10', 'lg:px-40');

    const contentContainer = document.querySelector('.max-w-4xl');
    expect(contentContainer).toHaveClass('flex', 'flex-col', 'max-w-4xl', 'flex-1');
  });

  test('アクセシビリティの統合確認', async () => {
    // 正常なAPIレスポンスをモック
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock((url: string) => {
      const mockData = {
        '/data/personal.json': mockPersonalInfo,
        '/data/skills.json': mockSkillCategories,
        '/data/experiences.json': mockExperiences,
        '/data/projects.json': mockProjects,
        '/data/contact.json': mockContactInfo,
      };

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData[url as keyof typeof mockData]),
      } as Response);
    });

    let getByText: any, getByRole: any;

    await act(async () => {
      const result = render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      getByText = result.getByText;
      getByRole = result.getByRole;
    });

    // データ読み込み完了を待機
    await waitFor(() => {
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    // セマンティックHTML要素の確認
    const header = getByRole('banner');
    expect(header).toBeInTheDocument();

    // ヘッダー構造の確認
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    expect(headings.length).toBeGreaterThan(0);

    // ダークモードトグルのアクセシビリティ
    const toggleButton = getByRole('button');
    expect(toggleButton).toHaveAttribute('aria-label');
    expect(toggleButton).toHaveAttribute('type', 'button');

    // セクションIDの確認
    expect(document.querySelector('#about')).toBeInTheDocument();
    expect(document.querySelector('#skills')).toBeInTheDocument();
    expect(document.querySelector('#experience')).toBeInTheDocument();
    expect(document.querySelector('#projects')).toBeInTheDocument();
    expect(document.querySelector('#contact')).toBeInTheDocument();
  });

  test('データの表示内容確認', async () => {
    // 正常なAPIレスポンスをモック
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock((url: string) => {
      const mockData = {
        '/data/personal.json': mockPersonalInfo,
        '/data/skills.json': mockSkillCategories,
        '/data/experiences.json': mockExperiences,
        '/data/projects.json': mockProjects,
        '/data/contact.json': mockContactInfo,
      };

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData[url as keyof typeof mockData]),
      } as Response);
    });

    let getByText: any;

    await act(async () => {
      const result = render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      getByText = result.getByText;
    });

    // データ読み込み完了を待機
    await waitFor(() => {
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    // 個人情報の表示確認
    expect(getByText(mockPersonalInfo.about)).toBeInTheDocument();

    // スキル情報の表示確認
    expect(getByText('React')).toBeInTheDocument();
    expect(getByText('TypeScript')).toBeInTheDocument();

    // 経験情報の表示確認
    expect(getByText('Senior Developer')).toBeInTheDocument();
    // 複数の場所に表示される可能性があるため、存在確認のみ
    const companyPeriodElements = document.querySelectorAll('*');
    const hasCompanyPeriod = Array.from(companyPeriodElements).some(
      el => el.textContent?.includes('TechCorp | 2022 - Present')
    );
    expect(hasCompanyPeriod).toBe(true);

    // プロジェクト情報の表示確認
    expect(getByText('Portfolio Website')).toBeInTheDocument();

    // コンタクト情報の表示確認
    expect(getByText(mockContactInfo.email)).toBeInTheDocument();
    expect(getByText(mockContactInfo.github)).toBeInTheDocument();
  });
});