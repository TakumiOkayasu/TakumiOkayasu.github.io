import { describe, expect, test } from 'bun:test';
import { act, render } from '@testing-library/react';
import SkillsSection from '../../src/components/SkillsSection';
import type { SkillCategory } from '../../src/types/types';
import '../../tests/setup'; // 必須！


// モックデータ（SkillCategory形式）
const mockSkillCategories: SkillCategory[] = [
  {
    id: 1,
    name: 'Frontend',
    icon_path: '/frontend-icon.svg',
    skills: [
      {
        name: 'React',
        level: 'Advanced' as const,
        years: 0,
        description: '',
      },
      {
        name: 'TypeScript',
        level: 'Intermediate' as const,
        years: 0,
        description: '',
      },
    ],
  },
  {
    id: 2,
    name: 'Backend',
    icon_path: '/backend-icon.svg',
    skills: [
      {
        name: 'Node.js',
        level: 'Advanced' as const,
        years: 0,
        description: '',
      },
    ],
  },
];

describe('SkillsSection コンポーネント', () => {
  test('タイトル付きのスキルセクションをレンダリングする', () => {
    let getByRole: any;
    act(() => {
      ({ getByRole } = render(<SkillsSection skillCategories={mockSkillCategories} />));
    });

    // セクション要素が存在することを確認
    const section = document.querySelector('#skills');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('id', 'skills');

    // メインタイトルが表示されることを確認
    const title = getByRole('heading', { name: 'Skills' });
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-3xl', 'font-bold');
  });

  test('シンプル形式でスキルカテゴリをレンダリングする', () => {
    let getByText: any;
    act(() => {
      ({ getByText } = render(<SkillsSection skillCategories={mockSkillCategories} />));
    });

    // カテゴリタイトルが表示されることを確認
    mockSkillCategories.forEach(category => {
      const categoryTitle = getByText(category.name);
      expect(categoryTitle).toBeInTheDocument();

      // カテゴリ内のスキルが表示されることを確認
      category.skills.forEach(skill => {
        expect(getByText(skill.name)).toBeInTheDocument();
      });
    });
  });

  test('フル形式でスキルカテゴリをレンダリングする', () => {
    let getByText: any;
    act(() => {
      ({ getByText } = render(<SkillsSection skillCategories={mockSkillCategories} />));
    });

    // カテゴリ名が表示されることを確認
    mockSkillCategories.forEach(category => {
      expect(getByText(category.name)).toBeInTheDocument();

      // スキル名が表示されることを確認
      category.skills.forEach(skill => {
        expect(getByText(skill.name)).toBeInTheDocument();
      });
    });
  });

  test('適切なスタイリングでスキルバッジを表示する', () => {
    act(() => {
      render(<SkillsSection skillCategories={mockSkillCategories} />);
    });

    // スキルバッジのコンテナを確認
    const skillBadges = document.querySelectorAll('.rounded-full.bg-gray-200');
    expect(skillBadges.length).toBeGreaterThan(0);

    skillBadges.forEach(badge => {
      expect(badge).toHaveClass(
        'flex',
        'items-center',
        'justify-center',
        'rounded-full',
        'bg-gray-200',
        'dark:bg-gray-800',
        'hover:bg-gray-300',
        'dark:hover:bg-gray-700'
      );
    });
  });

  test('スキルバッジにホバー効果を適用する', () => {
    act(() => {
      render(<SkillsSection skillCategories={mockSkillCategories} />);
    });

    const skillBadges = document.querySelectorAll('.hover\\:bg-gray-300');
    expect(skillBadges.length).toBeGreaterThan(0);

    skillBadges.forEach(badge => {
      expect(badge).toHaveClass('hover:-translate-y-0.5');
      expect(badge).toHaveClass('hover:shadow-md');
    });
  });

  test('利用可能な場合スキルのアイコンを表示する', () => {
    act(() => {
      render(<SkillsSection skillCategories={mockSkillCategories} />);
    });

    // React スキルのアイコン（CDN から取得される）が表示されることを確認
    const reactIcon = document.querySelector('img[alt*="React"]');
    expect(reactIcon).toBeInTheDocument();

    // TypeScript スキルのアイコンが表示されることを確認
    const typescriptIcon = document.querySelector('img[alt*="TypeScript"]');
    expect(typescriptIcon).toBeInTheDocument();
  });

  test('アイコンがないスキルのフォールバックを表示する', () => {
    const customSkills = [
      {
        id: 1,
        name: 'Frontend',
        icon_path: '/frontend-icon.svg',
        skills: [
          {
            name: 'custom',
            level: 'Advanced' as const,
            years: 0,
            description: '',
          },
        ],
      },
    ];

    let getByText: any;
    act(() => {
      ({ getByText } = render(<SkillsSection skillCategories={customSkills} />));
    });

    // フォールバックアイコン（最初の文字）が表示されることを確認
    const fallbackIcon = getByText('C'); // custom の C
    expect(fallbackIcon).toBeInTheDocument();
  });

  test('空のスキル配列を処理する', () => {
    let getByText: any, getByRole: any;
    act(() => {
      ({ getByText, getByRole } = render(<SkillsSection skillCategories={[]} />));
    });

    // "No skills data available" メッセージが表示されることを確認
    const noDataMessage = getByText('No skills data available');
    expect(noDataMessage).toBeInTheDocument();

    // メインタイトルは表示される
    const title = getByRole('heading', { name: 'Skills' });
    expect(title).toBeInTheDocument();
  });

  test('nullまたはundefinedのskillCategoriesを処理する', () => {
    let getByText: any;
    act(() => {
      // @ts-ignore - テスト目的で意図的にnullを渡す
      ({ getByText } = render(<SkillsSection skillCategories={null} />));
    });

    const noDataMessage = getByText('No skills data available');
    expect(noDataMessage).toBeInTheDocument();
  });

  test('ダークモードスタイルを適用する', () => {
    let getByRole: any, getAllByText: any;
    act(() => {
      ({ getByRole, getAllByText } = render(<SkillsSection skillCategories={mockSkillCategories} />));
    });

    const section = document.querySelector('#skills');
    expect(section).toHaveClass('transition-colors', 'duration-300');

    const title = getByRole('heading', { name: 'Skills' });
    expect(title.className).toContain('dark:text-gray-100');

    // カテゴリタイトルのダークモードスタイル
    const categoryTitles = getAllByText(/Frontend|Backend/);
    categoryTitles.forEach((title: HTMLElement) => {
      expect(title.className).toContain('dark:text-gray-100');
    });
  });

  test('適切なレスポンシブレイアウトを持つ', () => {
    act(() => {
      render(<SkillsSection skillCategories={mockSkillCategories} />);
    });

    // フレックスラップのコンテナを確認
    const flexWrapContainer = document.querySelector('.flex-wrap');
    expect(flexWrapContainer).toBeInTheDocument();

    // スキルバッジコンテナのフレックスラップを確認
    const skillBadgeContainers = document.querySelectorAll('.flex-wrap');
    expect(skillBadgeContainers.length).toBeGreaterThan(0);
  });
});
