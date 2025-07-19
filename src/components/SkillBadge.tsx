import type React from 'react';

interface SkillBadgeProps {
  skill: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => {
  return (
    <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 pl-2 pr-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-gray-900/30">
      <span className="w-5 h-5 bg-gray-900 dark:bg-gray-100 rounded transition-colors duration-300" />
      <p className="text-gray-900 dark:text-gray-100 text-sm font-medium leading-normal">{skill}</p>
    </div>
  );
};

export default SkillBadge;
