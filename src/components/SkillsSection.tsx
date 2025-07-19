import type React from 'react';
import SkillBadge from './SkillBadge';

interface SkillCategory {
  title: string;
  skills: string[];
}

interface SkillsSectionProps {
  skillCategories: SkillCategory[];
}

const SkillCategorySection: React.FC<{ title: string; skills: string[] }> = ({ title, skills }) => {
  return (
    <>
      <h3 className="text-gray-900 dark:text-gray-100 text-lg font-bold leading-tight tracking-tight px-4 pb-2 pt-4 transition-colors duration-300">
        {title}
      </h3>
      <div className="flex gap-3 p-3 flex-wrap pr-4">
        {skills.map(skill => (
          <SkillBadge key={skill} skill={skill} />
        ))}
      </div>
    </>
  );
};

const SkillsSection: React.FC<SkillsSectionProps> = ({ skillCategories }) => {
  return (
    <section id="skills" className="transition-colors duration-300">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <div className="flex min-w-72 flex-col gap-3">
          <h2 className="text-gray-900 dark:text-gray-100 text-3xl font-bold leading-tight tracking-tight">
            Skills
          </h2>
        </div>
      </div>
      {skillCategories.map(category => (
        <SkillCategorySection
          key={category.title}
          title={category.title}
          skills={category.skills}
        />
      ))}
    </section>
  );
};

export default SkillsSection;
