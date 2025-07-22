import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { act, render, waitFor } from '@testing-library/react';
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
import '../../tests/setup'; // 必須！

// テスト用のThemeProviderラッパー
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

// モックデータ
const mockPersonalInfo: PersonalInfo = {
  name: 'Takumi Okayasu',
  title: 'Software Engineer',
  description: 'Passionate software engineer with experience in modern web technologies.',
  avatar: '/avatar.jpg',
  about: 'I am a dedicated software engineer with a passion for creating innovative solutions.',
};

const mockSkillCategories: SkillCategory[] = [
  {
    id: 1,
    name: 'Frontend',
    icon_path: '/frontend-icon.svg',
    skills: [
      { name: 'React', level: 'Advanced' as const, years: 3, description: 'Frontend framework' },
    ],
  },
];

const mockExperiences: Experience[] = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'Tech Corp',
    period: '2022 - Present',
    description: 'Developing web applications',
    logo: '/tech-logo.png',
    position: 'Software Engineer',
  },
];

const mockProjects: Project[] = [
  {
    id: 1,
    title: 'Portfolio Website',
    description: 'Personal portfolio built with React',
    image: '/portfolio.png',
    technologies: ['React', 'TypeScript'],
    githubUrl: 'https://github.com/example/portfolio',
    liveUrl: 'https://portfolio.example.com',
  },
];

const mockContactInfo: ContactInfo = {
  email: 'takumi@example.com',
  github: 'https://github.com/takumiokayasu',
};

describe('Portfolio コンポーネント', () => {
  beforeEach(() => {
    // fetchをモック化
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
    // モックをリセット
    if (global.fetch && 'mockRestore' in global.fetch) {
      (global.fetch as any).mockRestore();
    }
  });

  test('初期状態でローディング状態を表示する', () => {
    // fetchを遅延させるモックを作成
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock(() => {
      return new Promise(() => {
        // Promiseを解決しないことで、ローディング状態を維持
      });
    });

    const { getByText } = render(
      <TestWrapper>
        <Portfolio />
      </TestWrapper>
    );

    // ローディング状態が表示されることを確認
    const loadingText = getByText('Loading...');
    expect(loadingText).toBeInTheDocument();
    expect(loadingText).toHaveClass('text-gray-600', 'dark:text-gray-400');
  });

  test('データ読み込み後にすべてのセクションをレンダリングする', async () => {
    let getByText: any;
    await act(async () => {
      const result = render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      getByText = result.getByText;
    });

    // データロード後にすべてのセクションが表示されることを確認
    await waitFor(() => {
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    // 各セクションの確認
    expect(getByText('Skills')).toBeInTheDocument();
    expect(getByText('Work Experience')).toBeInTheDocument();
    expect(getByText('Projects')).toBeInTheDocument();
    expect(getByText('Get in Touch')).toBeInTheDocument();
  });

  test('ダークモードトグルをレンダリングする', async () => {
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

    await waitFor(() => {
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    // ダークモードトグルボタンが表示されることを確認
    const toggleButton = getByRole('button');
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveClass('fixed', 'bottom-8', 'right-8');
  });

  test('正しいレイアウトとスタイリングを適用する', async () => {
    let getByText: any;
    act(() => {
      const result = render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      getByText = result.getByText;
    });

    await waitFor(() => {
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    // メインコンテナのスタイルを確認
    const mainContainer = document.querySelector('.min-h-screen');
    expect(mainContainer).toHaveClass(
      'relative',
      'flex',
      'size-full',
      'min-h-screen',
      'flex-col',
      'bg-white',
      'dark:bg-gray-900'
    );

    // mainエリアのスタイルを確認
    const mainElement = document.querySelector('main');
    expect(mainElement).toHaveClass('px-4', 'md:px-10', 'lg:px-40');
  });

  test('カスタムフォントファミリを適用する', async () => {
    let getByText: any;
    act(() => {
      const result = render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      getByText = result.getByText;
    });

    await waitFor(() => {
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    // カスタムフォントが適用されていることを確認
    const mainContainer = document.querySelector('.min-h-screen') as HTMLElement;
    expect(mainContainer?.style.fontFamily).toBe('"Space Grotesk", "Noto Sans", sans-serif');
  });

  test('APIエラーを適切に処理する', async () => {
    // fetchエラーをモック
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock(() => Promise.reject(new Error('API Error')));

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

    // エラー時でもローディングが終了することを確認（タイムアウトを短く）
    await waitFor(
      () => {
        expect(getByText('Loading...')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // エラーログが出力されることを確認
    expect(consoleSpy).toHaveBeenCalledWith('Error loading data:', expect.any(Error));

    // console.errorを復元
    console.error = originalConsoleError;
  });

  test('必須データが欠けている場合ローディング状態を維持する', async () => {
    // 必須データが欠けている状態をモック
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock((url: string) => {
      if (url === '/data/personal.json') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(null),
        } as Response);
      }

      const mockData = {
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

    // personalInfoがnullの場合、ローディング状態が継続することを確認
    await waitFor(() => {
      expect(getByText('Loading...')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('レスポンシブデザインクラスを持つ', async () => {
    let getByText: any;
    await act(async () => {
      const result = render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      getByText = result.getByText;
    });

    await waitFor(() => {
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    // レスポンシブデザインのクラスを確認
    const mainElement = document.querySelector('main');
    expect(mainElement).toHaveClass('px-4', 'md:px-10', 'lg:px-40');

    const contentContainer = document.querySelector('.max-w-4xl');
    expect(contentContainer).toHaveClass('flex', 'flex-col', 'max-w-4xl', 'flex-1');
  });

  test('ダークモードトランジションクラスを適用する', async () => {
    let getByText: any;
    await act(async () => {
      const result = render(
        <TestWrapper>
          <Portfolio />
        </TestWrapper>
      );
      getByText = result.getByText;
    });

    await waitFor(() => {
      expect(getByText(mockPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    // ダークモードトランジションクラスを確認
    const mainContainer = document.querySelector('.min-h-screen');
    expect(mainContainer).toHaveClass('transition-colors', 'duration-300');
  });
});
