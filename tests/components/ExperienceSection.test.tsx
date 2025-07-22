import { describe, expect, test } from 'bun:test';
import { act, render } from '@testing-library/react';
import ExperienceSection from '../../src/components/ExperienceSection';
import type { Experience } from '../../src/types/types';
import '../../tests/setup'; // 必須！

// モックデータ
const mockExperiences: Experience[] = [
  {
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    period: '2022 - Present',
    description: 'Leading development of web applications using React and TypeScript.',
    logo: '/tech-corp-logo.png',
    position: 'Senior Software Engineer',
    id: 0,
  },
  {
    title: 'Software Engineer',
    company: 'StartUp Inc',
    period: '2020 - 2022',
    description: 'Developed and maintained full-stack applications.',
    logo: '/startup-logo.png',
    position: 'Software Engineer',
    id: 0,
  },
];

describe('ExperienceSection コンポーネント', () => {
  test('タイトル付きの経験セクションをレンダリングする', () => {
    let getByText: any;
    
    act(() => {
      const result = render(<ExperienceSection experiences={mockExperiences} />);
      getByText = result.getByText;
    });

    // セクション要素が存在することを確認
    const section = document.querySelector('#experience');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('id', 'experience');

    // メインタイトルが表示されることを確認
    const mainTitle = getByText('Work Experience');
    expect(mainTitle).toBeInTheDocument();
    expect(mainTitle).toHaveClass('text-3xl', 'font-bold');

    // 説明文が表示されることを確認
    const description = getByText(/A timeline of my professional journey/);
    expect(description).toBeInTheDocument();
  });

  test('すべての経験項目をレンダリングする', () => {
    let getAllByText: any;
    let getByText: any;
    
    act(() => {
      const result = render(<ExperienceSection experiences={mockExperiences} />);
      getAllByText = result.getAllByText;
      getByText = result.getByText;
    });

    // 各経験項目のタイトルが表示されることを確認
    mockExperiences.forEach(exp => {
      // getAllByTextで重複したテキストも取得
      const titles = getAllByText(exp.title);
      expect(titles.length).toBeGreaterThan(0);
      const companyPeriods = getAllByText(`${exp.company} | ${exp.period}`);
      expect(companyPeriods.length).toBeGreaterThan(0);
      expect(getByText(exp.description)).toBeInTheDocument();
    });
  });

  test('経験タイムラインを正しくレンダリングする', () => {
    act(() => {
      render(<ExperienceSection experiences={mockExperiences} />);
    });

    // タイムライングリッドが存在することを確認
    const timelineGrid = document.querySelector('.grid-cols-\\[40px_1fr\\]');
    expect(timelineGrid).toBeInTheDocument();

    // ロゴが適切に設定されていることを確認
    mockExperiences.forEach(exp => {
      const logoElement = document.querySelector(`[style*="${exp.logo}"]`) as HTMLElement;
      expect(logoElement).toBeInTheDocument();
      expect(logoElement?.style.backgroundImage).toContain(exp.logo);
    });
  });

  test('経験項目に正しいスタイリングを適用する', () => {
    let getAllByText: any;
    
    act(() => {
      const result = render(<ExperienceSection experiences={mockExperiences} />);
      getAllByText = result.getAllByText;
    });

    // 会社名と期間のテキストスタイルを確認
    const companyPeriodElements = getAllByText(
      new RegExp(`${mockExperiences[0].company}.*${mockExperiences[0].period}`)
    );
    expect(companyPeriodElements[0]).toHaveClass('text-gray-600', 'dark:text-gray-400');
  });

  test('空の経験配列を処理する', () => {
    let getByText: any;
    
    act(() => {
      const result = render(<ExperienceSection experiences={[]} />);
      getByText = result.getByText;
    });

    // セクションタイトルは表示される
    const mainTitle = getByText('Work Experience');
    expect(mainTitle).toBeInTheDocument();

    // タイムラインコンテナは存在するが、アイテムは0個
    const timelineGrid = document.querySelector('.grid-cols-\\[40px_1fr\\]');
    expect(timelineGrid).toBeInTheDocument();
    expect(timelineGrid?.children).toHaveLength(0);
  });

  test('ダークモードスタイルを適用する', () => {
    let getByText: any;
    
    act(() => {
      const result = render(<ExperienceSection experiences={mockExperiences} />);
      getByText = result.getByText;
    });

    const section = document.querySelector('#experience');
    expect(section).toHaveClass('transition-colors', 'duration-300');

    const mainTitle = getByText('Work Experience');
    expect(mainTitle.className).toContain('dark:text-gray-100');

    const description = getByText(/A timeline of my professional journey/);
    expect(description.className).toContain('dark:text-gray-400');
  });

  test('タイムライン接続線を正しくレンダリングする', () => {
    act(() => {
      render(<ExperienceSection experiences={mockExperiences} />);
    });

    // タイムライン接続線のクラスを確認（最後のアイテム以外）
    const connectors = document.querySelectorAll('.bg-gray-300.dark\\:bg-gray-600');
    expect(connectors.length).toBe(mockExperiences.length - 1);
  });
});
