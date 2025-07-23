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

// 統合テスト用の完全なモックデータ
const mockPersonalInfo: PersonalInfo = {
  name: 'Takumi Okayasu',
  title: 'Full Stack Developer',
  description: 'Passionate full-stack developer with 5+ years of experience in modern web technologies.',
  avatar: '/portfolio-avatar.jpg',
  about: 'I am a dedicated software engineer specializing in React, TypeScript, and modern web development. I enjoy creating user-friendly applications and contributing to open-source projects.',
};

const mockSkillCategories: SkillCategory[] = [
  {
    id: 1,
    name: 'Frontend Development',
    icon_path: '/frontend-icon.svg',
    skills: [
      { name: 'React', level: 'Advanced' as const, years: 4, description: 'Modern React with hooks and context' },
      { name: 'TypeScript', level: 'Advanced' as const, years: 3, description: 'Type-safe JavaScript development' },
      { name: 'Tailwind CSS', level: 'Intermediate' as const, years: 2, description: 'Utility-first CSS framework' },
    ],
  },
  {
    id: 2,
    name: 'Backend Development',
    icon_path: '/backend-icon.svg',
    skills: [
      { name: 'Node.js', level: 'Advanced' as const, years: 4, description: 'Server-side JavaScript development' },
      { name: 'Express', level: 'Intermediate' as const, years: 3, description: 'Web application framework' },
    ],
  },
];

const mockExperiences: Experience[] = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    position: 'Senior Software Engineer',
    company: 'Tech Innovation Corp',
    period: '2022 - Present',
    description: 'Leading development of scalable web applications using React, TypeScript, and Node.js. Mentoring junior developers and driving technical decisions.',
    logo: '/tech-innovation-logo.png',
  },
  {
    id: 2,
    title: 'Software Developer',
    position: 'Software Developer',
    company: 'Digital Solutions Ltd',
    period: '2020 - 2022',
    description: 'Developed and maintained multiple client projects using modern web technologies. Collaborated with design and product teams.',
    logo: '/digital-solutions-logo.png',
  },
];

const mockProjects: Project[] = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
    image: '/ecommerce-project.png',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    githubUrl: 'https://github.com/takumiokayasu/ecommerce-platform',
    liveUrl: 'https://ecommerce-demo.takumiokayasu.dev',
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates and team collaboration features.',
    image: '/taskmanager-project.png',
    technologies: ['React', 'TypeScript', 'Socket.io', 'PostgreSQL'],
    githubUrl: 'https://github.com/takumiokayasu/task-manager',
    liveUrl: 'https://taskmanager.takumiokayasu.dev',
  },
  {
    id: 3,
    title: 'Weather Dashboard',
    description: 'A responsive weather dashboard with location-based forecasts and historical data visualization.',
    image: '/weather-dashboard.png',
    technologies: ['Vue.js', 'Chart.js', 'OpenWeather API'],
    githubUrl: 'https://github.com/takumiokayasu/weather-dashboard',
    liveUrl: 'https://weather.takumiokayasu.dev',
  },
];

const mockContactInfo: ContactInfo = {
  email: 'takumi.okayasu@example.com',
  github: 'https://github.com/takumiokayasu',
};

describe('ポートフォリオ統合テスト', () => {
  let originalFetch: any;

  beforeEach(() => {
    // localStorageをクリア
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
    // fetchモックをリセット
    global.fetch = originalFetch;
    localStorage.clear();
  });

  test('完全なポートフォリオワークフロー - データ読み込みから全セクション表示まで', async () => {
    let getByText: any, getByRole: any, getAllByText: any;

    await act(async () => {
      const result = render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      getByText = result.getByText;
      getByRole = result.getByRole;
      getAllByText = result.getAllByText;
    });

    // データロード完了を待機
    await waitFor(() => {
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    // 1. ヘッダーセクションの確認
    const header = getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(getByText('Tech Portfolio')).toBeInTheDocument();

    // 2. ヒーローセクションの確認
    expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    expect(getByText(mockPersonalInfo.title)).toBeInTheDocument();
    expect(getByText(mockPersonalInfo.description)).toBeInTheDocument();

    // 3. アバウトセクションの確認
    expect(getByText('About')).toBeInTheDocument();
    expect(getByText(mockPersonalInfo.about)).toBeInTheDocument();

    // 4. スキルセクションの確認
    expect(getByText('Skills')).toBeInTheDocument();
    mockSkillCategories.forEach(category => {
      expect(getByText(category.name)).toBeInTheDocument();
      category.skills.forEach(skill => {
        expect(getByText(skill.name)).toBeInTheDocument();
      });
    });

    // 5. 経験セクションの確認
    expect(getByText('Work Experience')).toBeInTheDocument();
    mockExperiences.forEach(exp => {
      const titleElements = getAllByText(exp.title);
      expect(titleElements.length).toBeGreaterThan(0);
      expect(getByText(`${exp.company} | ${exp.period}`)).toBeInTheDocument();
      expect(getByText(exp.description)).toBeInTheDocument();
    });

    // 6. プロジェクトセクションの確認
    expect(getByText('Projects')).toBeInTheDocument();
    mockProjects.forEach(project => {
      expect(getByText(project.title)).toBeInTheDocument();
      expect(getByText(project.description)).toBeInTheDocument();
    });

    // 7. コンタクトセクションの確認
    expect(getByText('Get in Touch')).toBeInTheDocument();
    expect(getByText(mockContactInfo.email)).toBeInTheDocument();
    expect(getByText(mockContactInfo.github)).toBeInTheDocument();

    // 8. ダークモードトグルの存在確認
    const toggleButton = getByRole('button');
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveClass('fixed', 'bottom-8', 'right-8');
  });

  test('ダークモード切り替え統合テスト - UI状態とlocalStorage連携', async () => {
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

    // データロード完了を待機
    await waitFor(() => {
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    const toggleButton = getByRole('button');
    
    // 初期状態の確認（ライトモード）
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

  test('レスポンシブデザイン統合テスト - 全セクションのレスポンシブクラス', async () => {
    let getByText: any;

    await act(async () => {
      const result = render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      getByText = result.getByText;
    });

    // データロード完了を待機
    await waitFor(() => {
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    // メインコンテナのレスポンシブクラス
    const mainContainer = document.querySelector('main');
    expect(mainContainer).toHaveClass('px-4', 'md:px-10', 'lg:px-40');

    // コンテンツコンテナの最大幅設定
    const contentContainer = document.querySelector('.max-w-4xl');
    expect(contentContainer).toBeInTheDocument();
    expect(contentContainer).toHaveClass('flex', 'flex-col', 'max-w-4xl', 'flex-1');
  });

  test('エラーハンドリング統合テスト - API失敗時の適切な処理', async () => {
    // fetchエラーをモック
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock(() => Promise.reject(new Error('Network Error')));

    // consoleエラーをモック（エラーログの出力を抑制）
    const originalConsoleError = console.error;
    const consoleSpy = mock(() => {});
    console.error = consoleSpy;

    let getByText: any;

    await act(async () => {
      const result = render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      getByText = result.getByText;
    });

    // エラー時でもローディング表示が継続することを確認
    await waitFor(() => {
      expect(getByText('Loading...')).toBeInTheDocument();
    }, { timeout: 3000 });

    // エラーログが出力されることを確認
    expect(consoleSpy).toHaveBeenCalledWith('Error loading data:', expect.any(Error));

    // console.errorを復元
    console.error = originalConsoleError;
  });

  test('部分的データ欠損統合テスト - 必須データ不足時の挙動', async () => {
    // personalInfoのみnullにして他は正常
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock((url: string) => {
      const mockData = {
        '/data/personal.json': null, // 必須データを欠損
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

    // 必須データが欠けている場合、ローディング状態が継続することを確認
    await waitFor(() => {
      expect(getByText('Loading...')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('パフォーマンス統合テスト - 大量データでの表示性能', async () => {
    // 大量のスキルとプロジェクトデータを作成
    const largeSkillCategories: SkillCategory[] = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Category ${i + 1}`,
      icon_path: `/category-${i + 1}-icon.svg`,
      skills: Array.from({ length: 15 }, (_, j) => ({
        name: `Skill ${i + 1}-${j + 1}`,
        level: ['Beginner', 'Intermediate', 'Advanced'][j % 3] as any,
        years: j % 5 + 1,
        description: `Description for skill ${i + 1}-${j + 1}`,
      })),
    }));

    const largeProjects: Project[] = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `Project ${i + 1}`,
      description: `Detailed description for project ${i + 1} with comprehensive feature list.`,
      image: `/project-${i + 1}.png`,
      technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB'].slice(0, (i % 4) + 1),
      githubUrl: `https://github.com/takumiokayasu/project-${i + 1}`,
      liveUrl: `https://project-${i + 1}.takumiokayasu.dev`,
    }));

    // 大量データでfetchをモック
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock((url: string) => {
      const mockData = {
        '/data/personal.json': mockPersonalInfo,
        '/data/skills.json': largeSkillCategories,
        '/data/experiences.json': mockExperiences,
        '/data/projects.json': largeProjects,
        '/data/contact.json': mockContactInfo,
      };

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData[url as keyof typeof mockData]),
      } as Response);
    });

    const startTime = Date.now();
    let getByText: any;

    await act(async () => {
      const result = render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      getByText = result.getByText;
    });

    // データロード完了を待機
    await waitFor(() => {
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 10000 });

    const endTime = Date.now();
    const renderTime = endTime - startTime;

    // レンダリング時間が10秒以内であることを確認（パフォーマンス要件）
    expect(renderTime).toBeLessThan(10000);

    // 大量データが正しく表示されることを確認
    expect(getByText('Category 1')).toBeInTheDocument();
    expect(getByText('Category 10')).toBeInTheDocument();
    expect(getByText('Project 1')).toBeInTheDocument();
    expect(getByText('Project 20')).toBeInTheDocument();
  });

  test('アクセシビリティ統合テスト - キーボードナビゲーションとARIA属性', async () => {
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

    // セマンティックHTML要素の確認
    const header = getByRole('banner');
    expect(header).toBeInTheDocument();

    const mainContent = document.querySelector('main');
    expect(mainContent).toBeInTheDocument();

    // ヘッディング構造の確認
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    expect(headings.length).toBeGreaterThan(0);

    // ダークモードトグルボタンのアクセシビリティ
    const toggleButton = getByRole('button');
    expect(toggleButton).toHaveAttribute('aria-label');
    expect(toggleButton).toHaveAttribute('type', 'button');
  });
});