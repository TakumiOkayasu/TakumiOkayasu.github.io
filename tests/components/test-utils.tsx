import { type RenderOptions, render } from '@testing-library/react';
import type React from 'react';
import { ThemeProvider } from '../../src/contexts/ThemeContext';

// テスト用のカスタムレンダラー
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };

// テスト用のモックデータ
export const mockPersonalInfo = {
  name: 'Takumi Okayasu',
  title: 'Software Engineer',
  description: 'Passionate software engineer with 5 years of experience',
  avatar: '/avatar.jpg',
  about: 'I am a dedicated software engineer with expertise in modern web technologies.',
};

export const mockContactInfo = {
  email: 'takumi@example.com',
  github: 'https://github.com/takumiokayasu',
};

export const mockExperiences = [
  {
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    period: '2022 - Present',
    description: 'Leading development of web applications using React and TypeScript.',
    logo: '/tech-corp-logo.png',
    position: 'Senior Software Engineer',
  },
  {
    title: 'Software Engineer',
    company: 'StartUp Inc',
    period: '2020 - 2022',
    description: 'Developed and maintained full-stack applications.',
    logo: '/startup-logo.png',
    position: 'Software Engineer',
  },
];

export const mockProjects = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce solution with React and Node.js',
    image: '/ecommerce-screenshot.png',
    technologies: ['React', 'Node.js', 'MongoDB'],
    githubUrl: 'https://github.com/user/ecommerce',
    liveUrl: 'https://ecommerce-demo.com',
  },
  {
    id: 2,
    title: 'Task Manager App',
    description: 'A productivity app for managing daily tasks',
    image: '',
    technologies: ['Vue.js', 'Express'],
    githubUrl: 'https://github.com/user/taskmanager',
    liveUrl: '',
  },
];

export const mockSkillCategories = [
  {
    title: 'Frontend',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'Python', 'PostgreSQL'],
  },
];

// テスト用のヘルパー関数（Bun Test用）
export const setupMatchMedia = (matches = false) => {
  const matchMediaMock = (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: matchMediaMock,
  });

  return matchMediaMock;
};

export const setupLocalStorage = () => {
  const localStorageMock = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  };

  Object.defineProperty(window, 'localStorage', {
    writable: true,
    value: localStorageMock,
  });

  return localStorageMock;
};

// クリーンアップヘルパー
export const cleanup = () => {
  // DOM をクリーンアップ
  document.body.innerHTML = '';

  // ローカルストレージをクリア
  if (window.localStorage) {
    window.localStorage.clear();
  }
};
