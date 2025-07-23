import type React from 'react';
import type { Project } from '../types/types';

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <article className="flex flex-col gap-3 pb-3 group">
      <div className="text-gray-400 dark:text-gray-500 text-4xl">📁</div>
      <h3 className="text-gray-900 dark:text-gray-100 text-base font-medium leading-normal">
        {project.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">
        {project.description}
      </p>
    </article>
  );
};

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  return (
    <section id="projects" className="transition-colors duration-300">
      <h2 className="text-gray-900 dark:text-gray-100 text-2xl font-bold leading-tight tracking-tight px-4 pb-3 pt-5">
        Projects
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
        {projects.map(project => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
