import { describe, expect, test } from 'bun:test';
import { act, render, screen } from '@testing-library/react';
import ProjectsSection from '../../src/components/ProjectsSection';
import type { Project } from '../../src/types/types';
import '../../tests/setup'; // 必須！

// モックデータ
const mockProjects: Project[] = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce solution with React and Node.js',
    image: '/ecommerce-screenshot.png',
    technologies: ['React', 'Node.js', 'MongoDB'],
    githubUrl: 'https://github.com/TakumiOkayasu',
    liveUrl: 'https://ecommerce-demo.com',
  },
  {
    id: 2,
    title: 'Task Manager App',
    description: 'A productivity app for managing daily tasks',
    image: '', // 空の画像URLをテスト
    technologies: ['Vue.js', 'Express'],
    githubUrl: 'https://github.com/TakumiOkayasu',
    liveUrl: '',
  },
];

describe('ProjectsSection コンポーネント', () => {
  test('renders projects section with title', () => {
    let getByRole: any;
    act(() => {
      ({ getByRole } = render(<ProjectsSection projects={mockProjects} />));
    });

    // セクション要素が存在することを確認
    const section = document.querySelector('#projects');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('id', 'projects');

    // タイトルが正しく表示されることを確認
    const title = getByRole('heading', { name: 'Projects' });
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-2xl', 'font-bold');
  });

  test('renders all project cards', () => {
    let getByText: any;
    act(() => {
      ({ getByText } = render(<ProjectsSection projects={mockProjects} />));
    });

    // 各プロジェクトの情報が表示されることを確認
    mockProjects.forEach(project => {
      expect(getByText(project.title)).toBeInTheDocument();
      expect(getByText(project.description)).toBeInTheDocument();
    });
  });

  test('displays project image when available', () => {
    render(<ProjectsSection projects={mockProjects} />);

    // 画像URLが設定されているプロジェクトの背景画像を確認
    const projectWithImage = mockProjects.find(p => p.image);
    if (projectWithImage?.image) {
      const imageElement = document.querySelector(
        `[style*="${projectWithImage.image}"]`
      ) as HTMLElement;
      expect(imageElement).toBeInTheDocument();
      expect(imageElement?.style.backgroundImage).toContain(projectWithImage.image);
    }
  });

  test('displays placeholder icon when image is not available', () => {
    let getByText: any;
    act(() => {
      ({ getByText } = render(<ProjectsSection projects={mockProjects} />));
    });

    // 画像がないプロジェクトにプレースホルダーアイコンが表示されることを確認
    const placeholderIcon = getByText('📁');
    expect(placeholderIcon).toBeInTheDocument();
    expect(placeholderIcon).toHaveClass('text-gray-400', 'dark:text-gray-500');
  });

  test('applies correct grid layout', () => {
    render(<ProjectsSection projects={mockProjects} />);

    // グリッドレイアウトのクラスを確認
    const gridContainer = document.querySelector(
      '.grid-cols-\\[repeat\\(auto-fit\\,minmax\\(158px\\,1fr\\)\\)\\]'
    );
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('gap-3', 'p-4');
  });

  test('applies hover effects to project cards', () => {
    render(<ProjectsSection projects={mockProjects} />);

    // グループホバー効果のクラスを確認
    const projectCards = document.querySelectorAll('.group');
    expect(projectCards.length).toBe(mockProjects.length);

    // ホバー時のスケールとシャドウ効果を確認
    projectCards.forEach(card => {
      expect(card).toHaveClass('group');
      const imageContainer = card.querySelector('.group-hover\\:scale-105');
      expect(imageContainer).toBeInTheDocument();
    });
  });

  test('handles empty projects array', () => {
    let getByRole: any;
    act(() => {
      ({ getByRole } = render(<ProjectsSection projects={[]} />));
    });

    // セクションタイトルは表示される
    const title = getByRole('heading', { name: 'Projects' });
    expect(title).toBeInTheDocument();

    // グリッドコンテナは存在するが、プロジェクトカードは0個
    const gridContainer = document.querySelector(
      '.grid-cols-\\[repeat\\(auto-fit\\,minmax\\(158px\\,1fr\\)\\)\\]'
    );
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer?.children).toHaveLength(0);
  });

  test('applies dark mode styles correctly', () => {
    act(() => {
      render(<ProjectsSection projects={mockProjects} />);
    });

    const section = document.querySelector('#projects');
    expect(section).toHaveClass('transition-colors', 'duration-300');

    // ダークモードクラスが適用されていることを確認
    const title = document.querySelector('h2');
    expect(title?.className).toContain('text-2xl');

    // プロジェクトカードのダークモードスタイルを確認
    const projectCards = document.querySelectorAll('.group');
    expect(projectCards.length).toBeGreaterThan(0);
  });

  test('project image containers have correct styling', () => {
    render(<ProjectsSection projects={mockProjects} />);

    const imageContainers = document.querySelectorAll('.aspect-square');
    imageContainers.forEach(container => {
      expect(container).toHaveClass(
        'w-full',
        'bg-center',
        'bg-no-repeat',
        'aspect-square',
        'bg-cover',
        'rounded-xl',
        'transition-all'
      );
    });
  });
});
