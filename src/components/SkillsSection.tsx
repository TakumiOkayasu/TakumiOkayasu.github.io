import type React from 'react';
import type { SkillCategory, SkillsSectionProps } from 'src/types/types';

// どちらの型でも受け入れ可能

// スキル名とアイコンのマッピング
const skillIconMap: Record<string, string> = {
  // Programming Languages
  'C言語': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
  'C++': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  'C#': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
  Java: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  Swift: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
  JavaScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  TypeScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  Python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  VBA: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg',
  'VB.Net': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg',
  PHP: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  Kotlin: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
  Go: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',

  // Frameworks & Libraries
  React: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  Django: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
  Laravel: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg',
  CakePHP: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cakephp/cakephp-original.svg',
  Flutter: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
  'Jetpack Compose': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',

  // Databases
  MySQL: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  PostgreSQL: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  SQLServer: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg',
  'Oracle Database': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg',
  Redis: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',

  // Tools
  Git: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  Docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  Biome: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', // Biome用の代替アイコン
  uv: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', // uv用の代替アイコン
  Vim: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vim/vim-original.svg',
  prettier: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', // prettier用の代替アイコン
  eslint: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg',
  GitHub: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  GitLab: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg',

  // Platforms
  Linux: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
  macOS: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg',
  Windows: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg',
  Android: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
  iOS: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg',

  // Others
  Slack: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg',
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
      <p className="text-gray-600 dark:text-gray-200 text-sm font-medium leading-normal">
        {skillName}
      </p>
    </div>
  );
};

// 型ガード関数
function isSkillCategory(category: SkillCategory): category is SkillCategory {
  return 'id' in category && 'name' in category;
}

// カテゴリ名を取得するヘルパー関数
function getCategoryName(category: SkillCategory): string {
  // titleプロパティがある場合（JSONデータの場合）
  if ('title' in category && typeof category.title === 'string') {
    return category.title;
  }
  // nameプロパティがある場合（SkillCategory型の場合）
  if ('name' in category && typeof category.name === 'string') {
    return category.name;
  }
  return 'Unknown Category';
}

const SkillCategorySection: React.FC<{ category: SkillCategory; index: number }> = ({
  category,
  index,
}) => {
  const categoryName = getCategoryName(category);

  // スキルの取得と正規化
  const skills = category.skills;
  const skillNames: string[] = skills
    .map(skill => (typeof skill === 'string' ? skill : skill.name))
    .filter(Boolean);

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
        <h3 className="text-gray-900 dark:text-gray-300 text-lg font-bold leading-tight tracking-tight transition-colors duration-300">
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
