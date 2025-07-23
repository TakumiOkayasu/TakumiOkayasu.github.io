import type React from 'react';
import { useEffect, useState } from 'react';
import type {
  ContactInfo,
  Experience,
  PersonalInfo,
  Project,
  SkillCategory,
} from '../types/types';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';
import DarkModeToggle from './DarkModeToggle';
import ExperienceSection from './ExperienceSection';
import HeroSection from './HeroSection';
import ProjectsSection from './ProjectsSection';
import SkillsSection from './SkillsSection';

const Portfolio: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [personalRes, skillsRes, experiencesRes, projectsRes, contactRes] = await Promise.all(
          [
            fetch('/data/personal.json'),
            fetch('/data/skills.json'),
            fetch('/data/experiences.json'),
            fetch('/data/projects.json'),
            fetch('/data/contact.json'),
          ]
        );

        const [personalData, skillsData, experiencesData, projectsData, contactData] =
          await Promise.all([
            personalRes.json(),
            skillsRes.json(),
            experiencesRes.json(),
            projectsRes.json(),
            contactRes.json(),
          ]);

        setPersonalInfo(personalData as PersonalInfo);
        setSkillCategories(skillsData as SkillCategory[]);
        setExperiences(experiencesData as Experience[]);
        setProjects(projectsData as Project[]);
        setContactInfo(contactData as ContactInfo);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading || !personalInfo || !contactInfo) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="text-gray-600 dark:text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <DarkModeToggle />
      <div
        className="relative flex flex-col bg-white dark:bg-gray-900 overflow-x-hidden transition-colors duration-300"
        style={{ fontFamily: "'Space Grotesk', 'Noto Sans', sans-serif" }}
      >
        <div className="flex flex-col">
          <main className="px-4 md:px-10 lg:px-40 flex justify-center py-5">
            <div className="flex flex-col max-w-4xl w-full">
              <HeroSection personalInfo={personalInfo} />
              <AboutSection personalInfo={personalInfo} />
              <SkillsSection skillCategories={skillCategories} />
              <ExperienceSection experiences={experiences} />
              <ProjectsSection projects={projects} />
              <ContactSection contactInfo={contactInfo} />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Portfolio;
