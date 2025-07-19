import type React from 'react';
import { useEffect, useState } from 'react';
import type {
  ContactInfo,
  Experience,
  PersonalInfo,
  Project,
  SkillCategorySimple,
} from '../types/types';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';
import DarkModeToggle from './DarkModeToggle';
import ExperienceSection from './ExperienceSection';
import Header from './Header';
import HeroSection from './HeroSection';
import ProjectsSection from './ProjectsSection';
import SkillsSection from './SkillsSection';

const Portfolio: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [skillCategories, setSkillCategories] = useState<SkillCategorySimple[]>([]);
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
        setSkillCategories(skillsData as SkillCategorySimple[]);
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
    return <div>Loading...</div>;
  }

  return (
    <>
      <DarkModeToggle />
      <div
        className="relative flex size-full min-h-screen flex-col bg-gray-50 dark:bg-gray-900 overflow-x-hidden transition-colors duration-300"
        style={{ fontFamily: "'Space Grotesk', 'Noto Sans', sans-serif" }}
      >
        <div className="flex h-full grow flex-col">
          <Header />
          <main className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
            <div className="flex flex-col max-w-4xl flex-1">
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
