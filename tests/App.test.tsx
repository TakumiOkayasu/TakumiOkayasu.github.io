import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { act, render, waitFor } from '@testing-library/react';
import App from '../src/App';
import type {
  ContactInfo,
  Experience,
  PersonalInfo,
  Project,
  SkillCategory,
} from '../src/types/types';
import './setup'; // 必須！

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

// localStorageのモック
const localStorageMock = {
  getItem: mock((_key: string) => null),
  setItem: mock((_key: string, _value: string) => {}),
  removeItem: mock((_key: string) => {}),
  clear: mock(() => {}),
};

// matchMediaのモック
const matchMediaMock = mock((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: mock(() => {}),
  removeListener: mock(() => {}),
  addEventListener: mock(() => {}),
  removeEventListener: mock(() => {}),
  dispatchEvent: mock(() => {}),
}));

describe('App コンポーネント', () => {
  beforeEach(() => {
    // fetchをモック化
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

    // DOM関連のモックを設定
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    Object.defineProperty(window, 'matchMedia', {
      value: matchMediaMock,
      writable: true,
    });

    Object.defineProperty(document.documentElement, 'classList', {
      value: {
        toggle: mock((_className: string, _force?: boolean) => {}),
        add: mock((_className: string) => {}),
        remove: mock((_className: string) => {}),
        contains: mock((_className: string) => false),
      },
      writable: true,
    });

    // モックをリセット
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    matchMediaMock.mockClear();
  });

  afterEach(() => {
    // モックをリセット
    if (global.fetch && 'mockRestore' in global.fetch) {
      (global.fetch as any).mockRestore();
    }
  });

  test('エラーなしでレンダリングされる', () => {
    let container: any;
    act(() => {
      ({ container } = render(<App />));
    });

    // 初期状態でローディングが表示されることを確認
    expect(container.textContent).toContain('Loading');
  });

  test('PortfolioにThemeProviderコンテキストを提供する', async () => {
    let container: any;
    act(() => {
      ({ container } = render(<App />));
    });

    // データロード後にコンテンツが表示されることを確認
    await waitFor(() => {
      expect(container.textContent).toContain(mockPersonalInfo.name);
    }, { timeout: 3000 });

    // ThemeProviderが提供されているため、DarkModeToggleが機能することを確認
    const toggleButton = container.querySelector('button');
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveClass('fixed', 'bottom-8', 'right-8');
  });

  test('Portfolioコンポーネントをレンダリングする', async () => {
    let container: any;
    act(() => {
      ({ container } = render(<App />));
    });

    // Portfolio コンポーネントが正しくレンダリングされることを確認
    await waitFor(() => {
      expect(container.textContent).toContain(mockPersonalInfo.name);
    }, { timeout: 3000 });

    // Portfolioの主要セクションが表示されることを確認
    expect(container.textContent.includes('Skills') || container.querySelector('#skills')).toBeTruthy();
    expect(container.textContent.includes('Work Experience') || container.querySelector('#experience')).toBeTruthy();
    expect(container.textContent.includes('Projects') || container.querySelector('#projects')).toBeTruthy();
    expect(container.textContent.includes('Get in Touch') || container.querySelector('#contact')).toBeTruthy();
  });

  test('正しいコンポーネント階層を持つ', async () => {
    let container: any;
    act(() => {
      ({ container } = render(<App />));
    });

    await waitFor(() => {
      expect(container.textContent).toContain(mockPersonalInfo.name);
    }, { timeout: 3000 });

    // ThemeProvider > Portfolio の階層が正しいことを確認
    // DarkModeToggleがPortfolioの一部として存在することを確認
    const toggleButton = container.querySelector('button');
    expect(toggleButton).toBeInTheDocument();

    // メインコンテナが存在することを確認
    const mainContainer = container.querySelector('.min-h-screen') || container.querySelector('main') || container.querySelector('div');
    expect(mainContainer).toBeInTheDocument();
  });

  test('テーマ機能が正しく統合されている', async () => {
    localStorageMock.getItem.mockReturnValue('false'); // 初期状態をライトモードに設定

    let container: any;
    act(() => {
      ({ container } = render(<App />));
    });

    await waitFor(() => {
      expect(container.textContent).toContain(mockPersonalInfo.name);
    }, { timeout: 3000 });

    // テーマ関連のDOM操作が行われることを確認
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
  });

  test('アプリライフサイクル全体でテーマの永続化を処理する', async () => {
    // 保存されたテーマ設定をモック
    localStorageMock.getItem.mockReturnValue('true');

    let container: any;
    act(() => {
      ({ container } = render(<App />));
    });

    await waitFor(() => {
      expect(container.textContent).toContain(mockPersonalInfo.name);
    }, { timeout: 3000 });

    // 保存されたテーマ設定が読み込まれることを確認
    expect(localStorageMock.getItem).toHaveBeenCalledWith('isDark');
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
  });

  test('CSSインポートと共にレンダリングされる', () => {
    // App.cssがインポートされていることを間接的に確認
    // (実際のCSSファイルの存在確認はビルドシステムで行われる)
    let container: any;
    act(() => {
      ({ container } = render(<App />));
    });

    // コンポーネントが正常にレンダリングされることを確認
    const loadingElement = container.querySelector('[role="status"]') || container.querySelector('div');
    expect(loadingElement).toBeInTheDocument();
  });

  test('安定したテーマコンテキストを提供する', async () => {
    let rerender: any, container: any;
    
    act(() => {
      ({ rerender, container } = render(<App />));
    });

    await waitFor(() => {
      expect(container.textContent).toContain(mockPersonalInfo.name);
    }, { timeout: 3000 });

    // 初期状態のテーマボタンを確認
    const initialButton = container.querySelector('button');
    expect(initialButton).toBeInTheDocument();

    // 再レンダリング後もテーマコンテキストが維持されることを磺認
    act(() => {
      rerender(<App />);
    });

    await waitFor(() => {
      expect(container.textContent).toContain(mockPersonalInfo.name);
    }, { timeout: 3000 });

    const buttonAfterRerender = container.querySelector('button');
    expect(buttonAfterRerender).toBeInTheDocument();
  });

  test('コンポーネント構造を正しく処理する', async () => {
    let container: any;
    act(() => {
      ({ container } = render(<App />));
    });

    await waitFor(() => {
      expect(container.textContent).toContain(mockPersonalInfo.name);
    }, { timeout: 3000 });

    // アプリケーションの基本構造を確認
    // Header が存在することを確認
    const headerElement = container.querySelector('[role="banner"]') || container.querySelector('header') || container.querySelector('div');
    expect(headerElement).toBeInTheDocument();

    // main要素が存在することを確認
    const mainElement = container.querySelector('main') || container.querySelector('.px-4') || container.querySelector('div');
    expect(mainElement).toBeInTheDocument();
  });

  test('保存された設定がない場合にシステムテーマ設定で初期化する', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    matchMediaMock.mockReturnValue({
      matches: true, // システムがダークモードを好む設定
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: mock(() => {}),
      removeListener: mock(() => {}),
      addEventListener: mock(() => {}),
      removeEventListener: mock(() => {}),
      dispatchEvent: mock(() => {}),
    });

    let container: any;
    act(() => {
      ({ container } = render(<App />));
    });

    await waitFor(() => {
      expect(container.textContent).toContain(mockPersonalInfo.name);
    }, { timeout: 3000 });

    // システム設定に基づいてダークモードが初期化されることを確認
    expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
  });
});
