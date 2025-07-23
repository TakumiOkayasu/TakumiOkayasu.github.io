import React from 'react';
import type { Experience } from '../types/types';

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceTimeline: React.FC<{ experiences: Experience[] }> = ({ experiences }) => {
  return (
    <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4">
      {experiences.map((exp, index) => (
        <React.Fragment key={`${exp.company}-${index}`}>
          <div className="flex flex-col items-center gap-1 pt-1">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-6 ring-2 ring-gray-300 dark:ring-gray-600"
              style={{ backgroundImage: `url('${exp.logo}')` }}
            />
            {index < experiences.length - 1 && (
              <div className="w-[1.5px] bg-gray-300 dark:bg-gray-600 h-2 grow transition-colors duration-300" />
            )}
          </div>
          <div className="flex flex-1 flex-col py-3">
            <p className="text-gray-900 dark:text-gray-100 text-base font-medium leading-normal">
              {exp.title}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
              {exp.company} | {exp.period}
            </p>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  return (
    <section id="experience" className="transition-colors duration-300">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <div className="flex min-w-72 flex-col gap-3">
          <h2 className="text-gray-900 dark:text-gray-100 text-3xl font-bold leading-tight tracking-tight">
            Work Experience
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">
            A timeline of my professional journey in software engineering
          </p>
        </div>
      </div>
      <ExperienceTimeline experiences={experiences} />
      {experiences?.map(exp => (
        <div key={`${exp.company}-detail`}>
          <h3 className="text-gray-900 dark:text-gray-100 text-lg font-bold leading-tight tracking-tight px-4 pb-2 pt-4">
            {exp.company} | {exp.period}
          </h3>
          <p className="text-gray-700 dark:text-gray-100 text-base font-normal leading-normal pb-3 pt-1 px-4">
            {exp.description}
          </p>
        </div>
      ))}
    </section>
  );
};

export default ExperienceSection;
