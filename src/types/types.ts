export interface Experience {
  id: number;
  title: string;
  position: string;
  company: string;
  period: string;
  description: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
}

export interface ContactInfo {
  email: string;
  github: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  description: string;
  about: string;
}

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  years: number;
  description: string;
}

export interface SkillCategory {
  id: number;
  title: string;
  icon_path?: string;
  skills: Skill[];
}

export interface SkillsSectionProps {
  skillCategories: SkillCategory[];
}