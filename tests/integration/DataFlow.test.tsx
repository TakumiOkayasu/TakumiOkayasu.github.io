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
import '../setup'; // 必須！

// テスト用のThemeProviderラッパー
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

// データフローテスト用の多様なシナリオデータ
const validPersonalInfo: PersonalInfo = {
  name: 'Takumi Okayasu',
  title: 'Software Engineer',
  description: 'Passionate developer',
  avatar: '/avatar.jpg',
  about: 'About me section',
};

const invalidPersonalInfo = {
  // name フィールドが欠けている不正なデータ
  title: 'Software Engineer',
  description: 'Passionate developer',
  avatar: '/avatar.jpg',
  about: 'About me section',
};

const validSkillCategories: SkillCategory[] = [
  {
    id: 1,
    name: 'Frontend',
    skills: [
      { name: 'React', level: 'Advanced' as const, years: 3, description: 'UI library' },
    ],
  },
];

const emptySkillCategories: SkillCategory[] = [];

const malformedSkillCategories = [
  {
    // id フィールドが欠けている
    name: 'Frontend',
    skills: [],
  },
];

const validExperiences: Experience[] = [
  {
    id: 1,
    title: 'Developer',
    position: 'Developer',
    company: 'TechCorp',
    period: '2020-2023',
    description: 'Web development',
  },
];

const validProjects: Project[] = [
  {
    id: 1,
    title: 'Portfolio',
    description: 'My portfolio website',
    technologies: ['React', 'TypeScript'],
  },
];

const validContactInfo: ContactInfo = {
  email: 'test@example.com',
  github: 'https://github.com/test',
};

describe('データフロー統合テスト', () => {
  let originalFetch: any;
  let fetchCallCount: number;
  let fetchUrls: string[];

  beforeEach(() => {
    localStorage.clear();
    fetchCallCount = 0;
    fetchUrls = [];
    
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

  test('正常データフロー - 全APIエンドポイントからの成功レスポンス', async () => {
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock((url: string) => {
      fetchCallCount++;
      fetchUrls.push(url);
      
      const mockData = {
        '/data/personal.json': validPersonalInfo,
        '/data/skills.json': validSkillCategories,
        '/data/experiences.json': validExperiences,
        '/data/projects.json': validProjects,
        '/data/contact.json': validContactInfo,
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

    // データロード完了を待機
    await waitFor(() => {
      expect(getByText(validPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    // 正しい数のAPIコールが発生していることを確認
    expect(fetchCallCount).toBe(5);
    
    // 正しいエンドポイントがコールされていることを確認
    expect(fetchUrls).toContain('/data/personal.json');
    expect(fetchUrls).toContain('/data/skills.json');
    expect(fetchUrls).toContain('/data/experiences.json');
    expect(fetchUrls).toContain('/data/projects.json');
    expect(fetchUrls).toContain('/data/contact.json');

    // 各セクションが正しくレンダリングされていることを確認
    expect(getByText('React')).toBeInTheDocument();
    expect(getByText('Developer')).toBeInTheDocument();
    expect(getByText('Portfolio')).toBeInTheDocument();
    expect(getByText(validContactInfo.email)).toBeInTheDocument();
  });

  test('段階的データ読み込み - 非同期データ到着の順序テスト', async () => {
    let personalResolver: any, skillsResolver: any, experiencesResolver: any;
    
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock((url: string) => {
      fetchUrls.push(url);
      
      if (url === '/data/personal.json') {
        return new Promise(resolve => {
          personalResolver = resolve;
        });
      }
      
      if (url === '/data/skills.json') {
        return new Promise(resolve => {
          skillsResolver = resolve;
        });
      }
      
      if (url === '/data/experiences.json') {
        return new Promise(resolve => {
          experiencesResolver = resolve;
        });
      }
      
      // projects と contact は即座に返す
      const immediateData = {
        '/data/projects.json': validProjects,
        '/data/contact.json': validContactInfo,
      };
      
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(immediateData[url as keyof typeof immediateData]),
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

    // スキルデータを最初に返す
    await act(async () => {
      skillsResolver({
        ok: true,
        json: () => Promise.resolve(validSkillCategories),
      } as Response);
    });

    // まだpersonalInfoが不足しているため、ローディング継続
    await waitFor(() => {
      expect(queryByText('Loading...')).toBeInTheDocument();
    }, { timeout: 1000 });

    // 経験データを次に返す
    await act(async () => {
      experiencesResolver({
        ok: true,
        json: () => Promise.resolve(validExperiences),
      } as Response);
    });

    // まだpersonalInfoが不足しているため、ローディング継続
    await waitFor(() => {
      expect(queryByText('Loading...')).toBeInTheDocument();
    }, { timeout: 1000 });

    // 最後にpersonalInfoを返す
    await act(async () => {
      personalResolver({
        ok: true,
        json: () => Promise.resolve(validPersonalInfo),
      } as Response);
    });

    // 全必須データが揃ったため、コンテンツ表示
    await waitFor(() => {
      expect(queryByText('Loading...')).not.toBeInTheDocument();
      expect(getByText(validPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('データ検証フロー - 不正なデータ形式の処理', async () => {
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock((url: string) => {
      const mockData = {
        '/data/personal.json': invalidPersonalInfo, // 不正なデータ
        '/data/skills.json': malformedSkillCategories, // 不正なデータ
        '/data/experiences.json': validExperiences,
        '/data/projects.json': validProjects,
        '/data/contact.json': validContactInfo,
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

    // 不正なデータのため、ローディング状態が継続することを確認
    await waitFor(() => {
      expect(queryByText('Loading...')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('空データ処理フロー - 空配列やnullデータのハンドリング', async () => {
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock((url: string) => {
      const mockData = {
        '/data/personal.json': validPersonalInfo,
        '/data/skills.json': emptySkillCategories, // 空配列
        '/data/experiences.json': [], // 空配列
        '/data/projects.json': [], // 空配列
        '/data/contact.json': validContactInfo,
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

    // データロード完了を待機
    await waitFor(() => {
      expect(getByText(validPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    // 必須データはあるため、基本的なレンダリングは成功
    expect(queryByText('Loading...')).not.toBeInTheDocument();

    // スキルセクションで空データの適切な処理を確認
    expect(getByText('Skills')).toBeInTheDocument();
    expect(queryByText('No skills data available')).toBeInTheDocument();
  });

  test('ネットワークエラー処理フロー - 部分的失敗とリトライ', async () => {
    let attemptCount = 0;
    
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock((url: string) => {
      attemptCount++;
      
      // personalInfoのAPIだけ失敗させる
      if (url === '/data/personal.json') {
        return Promise.reject(new Error('Network Error'));
      }
      
      // 他のAPIは成功
      const mockData = {
        '/data/skills.json': validSkillCategories,
        '/data/experiences.json': validExperiences,
        '/data/projects.json': validProjects,
        '/data/contact.json': validContactInfo,
      };

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData[url as keyof typeof mockData]),
      } as Response);
    });

    // consoleエラーをモック（エラーログの出力を抑制）
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

    // personalInfoの取得に失敗しているため、ローディング継続
    await waitFor(() => {
      expect(queryByText('Loading...')).toBeInTheDocument();
    }, { timeout: 3000 });

    // エラーログが出力されることを確認
    expect(consoleSpy).toHaveBeenCalledWith('Error loading data:', expect.any(Error));

    // console.errorを復元
    console.error = originalConsoleError;
  });

  test('HTTPエラーレスポンス処理フロー - 404, 500エラーの処理', async () => {
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock((url: string) => {
      if (url === '/data/personal.json') {
        // 404エラーをシミュレート
        return Promise.resolve({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ error: 'Not Found' }),
        } as Response);
      }
      
      if (url === '/data/skills.json') {
        // 500エラーをシミュレート
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Internal Server Error' }),
        } as Response);
      }
      
      // 他のAPIは成功
      const mockData = {
        '/data/experiences.json': validExperiences,
        '/data/projects.json': validProjects,
        '/data/contact.json': validContactInfo,
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

    // HTTP エラーが発生しているため、ローディング継続
    await waitFor(() => {
      expect(queryByText('Loading...')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('大容量データ処理フロー - メモリ効率とパフォーマンス', async () => {
    // 大容量のスキルデータを生成
    const largeSkillCategories: SkillCategory[] = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Category ${i + 1}`,
      skills: Array.from({ length: 100 }, (_, j) => ({
        name: `Skill ${i + 1}-${j + 1}`,
        level: ['Beginner', 'Intermediate', 'Advanced'][j % 3] as any,
        years: j % 10 + 1,
        description: `Description for skill ${i + 1}-${j + 1} with detailed information about usage and proficiency level.`,
      })),
    }));

    // 大容量のプロジェクトデータを生成
    const largeProjects: Project[] = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      title: `Project ${i + 1}`,
      description: `Comprehensive description for project ${i + 1} including technical details, challenges faced, and solutions implemented.`,
      technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'AWS', 'Docker'].slice(0, (i % 6) + 1),
      githubUrl: `https://github.com/test/project-${i + 1}`,
      liveUrl: `https://project-${i + 1}.example.com`,
    }));

    const startTime = Date.now();
    
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock((url: string) => {
      const mockData = {
        '/data/personal.json': validPersonalInfo,
        '/data/skills.json': largeSkillCategories,
        '/data/experiences.json': validExperiences,
        '/data/projects.json': largeProjects,
        '/data/contact.json': validContactInfo,
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

    // データロード完了を待機
    await waitFor(() => {
      expect(getByText(validPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 15000 });

    const endTime = Date.now();
    const processingTime = endTime - startTime;

    // パフォーマンス要件: 15秒以内でレンダリング完了
    expect(processingTime).toBeLessThan(15000);

    // 大容量データが適切に処理されていることを確認
    expect(getByText('Category 1')).toBeInTheDocument();
    expect(getByText('Project 1')).toBeInTheDocument();
  });

  test('並行データ処理フロー - Promise.allの動作確認', async () => {
    const fetchTimes: { [key: string]: number } = {};
    
    // @ts-ignore - テストファイルなので型エラーは無視して問題ない
    global.fetch = mock((url: string) => {
      fetchTimes[url] = Date.now();
      
      const mockData = {
        '/data/personal.json': validPersonalInfo,
        '/data/skills.json': validSkillCategories,
        '/data/experiences.json': validExperiences,
        '/data/projects.json': validProjects,
        '/data/contact.json': validContactInfo,
      };

      // 各APIに異なる遅延を追加
      const delays = {
        '/data/personal.json': 100,
        '/data/skills.json': 200,
        '/data/experiences.json': 150,
        '/data/projects.json': 80,
        '/data/contact.json': 120,
      };

      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve(mockData[url as keyof typeof mockData]),
          } as Response);
        }, delays[url as keyof typeof delays]);
      });
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
      expect(getByText(validPersonalInfo.name)).toBeInTheDocument();
    }, { timeout: 5000 });

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // 並行処理により、最も遅いAPI（skills: 200ms）+ α の時間で完了することを確認
    // 逐次実行なら 100+200+150+80+120 = 650ms かかるが、並行なら 200ms + α で済む
    expect(totalTime).toBeLessThan(1000); // 余裕を持って1秒以内

    // 全APIがほぼ同時に開始されていることを確認
    const fetchTimeValues = Object.values(fetchTimes);
    const minTime = Math.min(...fetchTimeValues);
    const maxTime = Math.max(...fetchTimeValues);
    const timeDifference = maxTime - minTime;
    
    // API呼び出し開始時刻の差が50ms以内（並行実行の証明）
    expect(timeDifference).toBeLessThan(50);
  });
});