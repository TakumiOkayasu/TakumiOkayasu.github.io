export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  years: number;
  description: string;
}

export interface SkillCategory {
  id: number;
  name: string;
  icon: string;
  skills: Skill[];
}

export interface SkillsData {
  meta: {
    title: string;
    description: string;
    lastUpdated: string;
  };
  categories: SkillCategory[];
}

export interface Experience {
  id: number;
  title: string;
  position: string;
  company: string;
  period: string;
  description: string;
  logo?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface ContactInfo {
  email: string;
  linkedin: string;
  github: string;
  phone?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  description: string;
  avatar: string;
  about: string;
}

export interface SkillCategorySimple {
  title: string;
  skills: string[];
}
