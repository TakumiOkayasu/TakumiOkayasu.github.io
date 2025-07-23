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

// ユーザージャーニーテスト用のリアルなモックデータ
const mockPersonalInfo: PersonalInfo = {
  name: 'Takumi Okayasu',
  title: 'Full Stack Developer',
  description: 'Creating innovative web solutions with modern technologies and best practices.',
  avatar: '/takumi-avatar.jpg',
  about: 'I am passionate about building scalable web applications and contributing to the developer community. With expertise in React, Node.js, and cloud technologies, I strive to create exceptional user experiences.',
};

const mockSkillCategories: SkillCategory[] = [
  {
    id: 1,
    name: 'Frontend Technologies',
    icon_path: '/frontend.svg',
    skills: [
      { name: 'React', level: 'Advanced' as const, years: 4, description: 'Component-based UI development' },
      { name: 'TypeScript', level: 'Advanced' as const, years: 3, description: 'Type-safe development' },
      { name: 'Next.js', level: 'Intermediate' as const, years: 2, description: 'Full-stack React framework' },
    ],
  },
  {
    id: 2,
    name: 'Backend & Database',
    icon_path: '/backend.svg',
    skills: [
      { name: 'Node.js', level: 'Advanced' as const, years: 4, description: 'Server-side JavaScript' },
      { name: 'PostgreSQL', level: 'Intermediate' as const, years: 2, description: 'Relational database' },
    ],
  },
];

const mockExperiences: Experience[] = [
  {
    id: 1,
    title: 'Senior Full Stack Developer',
    position: 'Senior Full Stack Developer',
    company: 'TechCorp Solutions',
    period: '2022 - Present',
    description: 'Leading full-stack development projects and mentoring team members.',
    logo: '/techcorp-logo.png',
  },
];

const mockProjects: Project[] = [
  {
    id: 1,
    title: 'Portfolio Website',
    description: 'Modern portfolio website built with React and TypeScript.',
    image: '/portfolio-preview.jpg',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    githubUrl: 'https://github.com/takumiokayasu/portfolio',
    liveUrl: 'https://takumiokayasu.dev',
  },
];

const mockContactInfo: ContactInfo = {
  email: 'hello@takumiokayasu.dev',
  github: 'https://github.com/takumiokayasu',
};

describe('ユーザージャーニー統合テスト', () => {
  let originalFetch: any;
  
  beforeEach(() => {
    // テスト環境の初期化
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

    // fetchをモック化
    originalFetch = global.fetch;
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
  });

  afterEach(() => {
    global.fetch = originalFetch;
    localStorage.clear();
  });

  test('新規訪問者のジャーニー - 初回訪問からコンタクトまで', async () => {
    const user = userEvent.setup();
    let getByText: any, getByRole: any, queryByText: any;

    // 1. 初回アクセス - ローディング状態から開始
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

    // ローディング状態を確認（最初の瞬間をキャッチ）
    // すぐにデータが返るため、最初にローディングが表示されるかもしれない
    // ここではローディングの初期チェックはスキップし、データ読み込み完了を待つ

    // 2. データロード完了 - ヒーローセクションが表示
    await waitFor(() => {
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    // ローディングが消えていることを確認
    expect(queryByText('Loading...')).not.toBeInTheDocument();

    // 3. プロフィール情報の確認
    expect(getByText(mockPersonalInfo.title)).toBeInTheDocument();
    expect(getByText(mockPersonalInfo.description)).toBeInTheDocument();

    // 4. アバウトセクションの詳細を確認
    expect(getByText('About')).toBeInTheDocument();
    expect(getByText(mockPersonalInfo.about)).toBeInTheDocument();

    // 5. スキルセクションでの技術スタック確認
    expect(getByText('Skills')).toBeInTheDocument();
    expect(getByText('React')).toBeInTheDocument();
    expect(getByText('TypeScript')).toBeInTheDocument();
    expect(getByText('Node.js')).toBeInTheDocument();

    // 6. 経験セクションでの職歴確認
    expect(getByText('Work Experience')).toBeInTheDocument();
    expect(getByText('Senior Full Stack Developer')).toBeInTheDocument();
    expect(getByText('TechCorp Solutions | 2022 - Present')).toBeInTheDocument();

    // 7. プロジェクトセクションでの実績確認
    expect(getByText('Projects')).toBeInTheDocument();
    expect(getByText('Portfolio Website')).toBeInTheDocument();

    // 8. コンタクト情報へのアクセス
    expect(getByText('Get in Touch')).toBeInTheDocument();
    expect(getByText(mockContactInfo.email)).toBeInTheDocument();
    expect(getByText(mockContactInfo.github)).toBeInTheDocument();

    // 9. ダークモードの発見と試用
    const toggleButton = getByRole('button');
    expect(toggleButton).toBeInTheDocument();
    
    // ダークモードに切り替え
    await act(async () => {
      await user.click(toggleButton);
    });

    // ダークモード状態がlocalStorageに保存されることを確認
    await waitFor(() => {
      expect(localStorage.getItem('isDark')).toBe('true');
    });

    // 10. 再度ライトモードに戻す（好みの確認）
    await act(async () => {
      await user.click(toggleButton);
    });

    await waitFor(() => {
      expect(localStorage.getItem('isDark')).toBe('false');
    });
  });

  test('リピート訪問者のジャーニー - 保存されたテーマ設定の復元', async () => {
    // 事前にダークモード設定を保存（リピート訪問者の状況をシミュレート）
    localStorage.setItem('isDark', 'true');
    
    // DOMクラスリストを更新してダークモード状態をシミュレート
    const mockClassList = {
      contains: mock((className: string) => className === 'dark'),
      add: mock(() => {}),
      remove: mock(() => {}),
      toggle: mock(() => {}),
    };
    
    Object.defineProperty(document.documentElement, 'classList', {
      value: mockClassList,
      writable: true,
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

    // データロード完了を待機
    await waitFor(() => {
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    // ダークモードの設定が保持されていることを確認
    expect(localStorage.getItem('isDark')).toBe('true');

    // ダークモードトグルボタンの状態確認
    const toggleButton = getByRole('button');
    expect(toggleButton).toBeInTheDocument();
    
    // aria-labelでダークモード状態を推測
    const ariaLabel = toggleButton.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });

  test('モバイルユーザーのジャーニー - タッチインタラクションとレスポンシブ表示', async () => {
    const user = userEvent.setup();
    let getByText: any, getByRole: any;

    // モバイル画面サイズをシミュレート
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    });

    await act(async () => {
      const result = render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      getByText = result.getByText;
      getByRole = result.getByRole;
    });

    // データロード完了を待機
    await waitFor(() => {
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    // レスポンシブクラスの適用確認
    const mainElement = document.querySelector('main');
    expect(mainElement).toHaveClass('px-4'); // モバイル用パディング

    // タッチフレンドリーなダークモードトグル
    const toggleButton = getByRole('button');
    expect(toggleButton).toHaveClass('w-12', 'h-12'); // 十分なタッチターゲットサイズ
    
    // タッチイベントのシミュレート
    await act(async () => {
      await user.click(toggleButton);
    });

    // タッチ操作後の状態変更確認
    await waitFor(() => {
      expect(localStorage.getItem('isDark')).toBe('true');
    });
  });

  test('アクセシビリティ重視ユーザーのジャーニー - スクリーンリーダー対応', async () => {
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

    // データロード完了を待機
    await waitFor(() => {
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    // セマンティックHTML構造の確認
    const banner = getByRole('banner');
    expect(banner).toBeInTheDocument();

    const mainContent = document.querySelector('main');
    expect(mainContent).toBeInTheDocument();

    // 見出し構造の確認（スクリーンリーダー向け）
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    expect(headings.length).toBeGreaterThan(0);

    // ボタンのアクセシビリティ属性確認
    const toggleButton = getByRole('button');
    expect(toggleButton).toHaveAttribute('aria-label');
    expect(toggleButton).toHaveAttribute('type', 'button');

    // セクションIDの確認（アンカーリンク対応）
    const aboutSection = document.querySelector('#about');
    expect(aboutSection).toBeInTheDocument();

    const skillsSection = document.querySelector('#skills');
    expect(skillsSection).toBeInTheDocument();

    const experienceSection = document.querySelector('#experience');
    expect(experienceSection).toBeInTheDocument();

    const projectsSection = document.querySelector('#projects');
    expect(projectsSection).toBeInTheDocument();

    const contactSection = document.querySelector('#contact');
    expect(contactSection).toBeInTheDocument();
  });

  test('低速ネットワークユーザーのジャーニー - 段階的コンテンツ表示', async () => {
    let resolvePersonal: any, resolveSkills: any;
    
    // 低速ネットワークをシミュレート（段階的にデータを返す）
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock((url: string) => {
      if (url === '/data/personal.json') {
        return new Promise(resolve => {
          resolvePersonal = resolve;
        });
      }
      
      if (url === '/data/skills.json') {
        return new Promise(resolve => {
          resolveSkills = resolve;
        });
      }
      
      // 他のデータは即座に返す
      const mockData = {
        '/data/experiences.json': mockExperiences,
        '/data/projects.json': mockProjects,
        '/data/contact.json': mockContactInfo,
      };
      
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData[url as keyof typeof mockData]),
      } as Response);
    });

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

    // 初期ローディング状態
    expect(getByText('Loading...')).toBeInTheDocument();

    // personalInfoを段階的に返す
    await act(async () => {
      resolvePersonal({
        ok: true,
        json: () => Promise.resolve(mockPersonalInfo),
      } as Response);
    });

    // まだcontactInfoが不足しているため、ローディング継続
    await waitFor(() => {
      expect(queryByText('Loading...')).toBeInTheDocument();
    }, { timeout: 1000 });

    // skillsデータを返す
    await act(async () => {
      resolveSkills({
        ok: true,
        json: () => Promise.resolve(mockSkillCategories),
      } as Response);
    });

    // 全データが揃ったため、コンテンツ表示開始
    await waitFor(() => {
      expect(queryByText('Loading...')).not.toBeInTheDocument();
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});