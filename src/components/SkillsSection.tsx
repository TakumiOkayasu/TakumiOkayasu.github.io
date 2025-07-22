import type React from 'react';
import type { SkillCategory, SkillsSectionProps } from 'src/types/types';

// どちらの型でも受け入れ可能

// スキル名とアイコンのマッピング
const skillIconMap: Record<string, string> = {
  // Frontend
  React: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  TypeScript:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  JavaScript:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'Vue.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  'Tailwind CSS':
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
  CSS: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  HTML: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',

  // Backend
  'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  Python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  Java: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'C++': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  Go: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
  Rust: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg',

  // Database
  PostgreSQL:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  MongoDB: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  MySQL: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  Redis: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',

  // DevOps
  Docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  Kubernetes: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
  AWS: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
  Git: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  GitHub: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  GitLab: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg',

  // その他
  GraphQL: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',
  Firebase: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
  Linux: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
  Ubuntu: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg',
  Vim: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vim/vim-original.svg',
};

interface SkillBadgeProps {
  skillName: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skillName }) => {
  if (!skillName) {
    return null;
  }

  const icon = skillIconMap[skillName];

  return (
    <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 pl-3 pr-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-gray-900/30">
      {icon ? (
        <img src={icon} alt={`${skillName} icon`} className="w-6 h-6 object-contain" />
      ) : (
        <span className="w-6 h-6 bg-gray-800 dark:bg-gray-100 rounded-full transition-colors duration-300 flex items-center justify-center text-xs font-bold text-gray-100 dark:text-gray-800">
          {skillName.charAt(0).toUpperCase()}
        </span>
      )}
      <p className="text-gray-900 dark:text-gray-100 text-sm font-medium leading-normal">
        {skillName}
      </p>
    </div>
  );
};

// 型ガード関数
function isSkillCategory(category: SkillCategory): category is SkillCategory {
  return 'id' in category && 'name' in category;
}

const SkillCategorySection: React.FC<{ category: SkillCategory; index: number }> = ({
  category,
  index,
}) => {
  // デバッグ用ログ
  console.log(`Category ${index}:`, category);

  const categoryName = category.name;

  // スキルの取得と正規化
  const skills = category.skills;
  const skillNames: string[] = skills
    .map(skill => (typeof skill === 'string' ? skill : skill.name))
    .filter(Boolean);

  console.log(`Skills for ${categoryName}:`, skillNames);

  if (skillNames.length === 0) {
    return null;
  }

  return (
    <div className="skill-category-section mb-6">
      <div className="flex items-center gap-3 px-4 pb-2 pt-4">
        {isSkillCategory(category) && category.icon_path && (
          <img
            src={category.icon_path}
            alt={`${categoryName} icon`}
            className="w-8 h-8 object-contain"
          />
        )}
        <h3 className="text-gray-900 dark:text-gray-100 text-lg font-bold leading-tight tracking-tight transition-colors duration-300">
          {categoryName}
        </h3>
      </div>
      <div className="flex gap-3 p-3 flex-wrap pr-4">
        {skillNames.map((skillName, skillIndex) => (
          <SkillBadge key={`cat-${index}-skill-${skillIndex}-${skillName}`} skillName={skillName} />
        ))}
      </div>
    </div>
  );
};

const SkillsSection: React.FC<SkillsSectionProps> = ({ skillCategories }) => {
  // デバッグ用ログ
  console.log('SkillsSection received:', skillCategories);
  console.log('Type of skillCategories:', typeof skillCategories);
  console.log('Is Array?', Array.isArray(skillCategories));

  if (!skillCategories || !Array.isArray(skillCategories) || skillCategories.length === 0) {
    console.log('No skill categories to render');
    return (
      <section id="skills" className="transition-colors duration-300">
        <div className="flex flex-wrap justify-between gap-3 p-4 mb-4">
          <div className="flex min-w-72 flex-col gap-3">
            <h2 className="text-gray-900 dark:text-gray-100 text-3xl font-bold leading-tight tracking-tight">
              Skills
            </h2>
            <p className="text-gray-600 dark:text-gray-400">No skills data available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="transition-colors duration-300">
      <div className="flex flex-wrap justify-between gap-3 p-4 mb-4">
        <div className="flex min-w-72 flex-col gap-3">
          <h2 className="text-gray-900 dark:text-gray-100 text-3xl font-bold leading-tight tracking-tight">
            Skills
          </h2>
        </div>
      </div>
      <div className="skill-categories-container">
        {skillCategories?.map((category, index) => {
          if (!category) return null;

          const key = isSkillCategory(category)
            ? `skill-category-${category.id}`
            : `skill-category-${index}`;

          return <SkillCategorySection key={key} category={category} index={index} />;
        })}
      </div>
    </section>
  );
};

export default SkillsSection;
