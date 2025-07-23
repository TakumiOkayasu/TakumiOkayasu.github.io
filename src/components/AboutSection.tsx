import type React from 'react';
import type { PersonalInfo } from '../types/types';

interface AboutSectionProps {
  personalInfo: PersonalInfo;
}

const AboutSection: React.FC<AboutSectionProps> = ({ personalInfo }) => {
  return (
    <section id="about" className="transition-colors duration-300">
      <h2 className="text-gray-900 dark:text-gray-100 text-2xl font-bold leading-tight tracking-tight px-4 pb-3 pt-5">
        About
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-base font-normal leading-relaxed pb-3 pt-1 px-4">
        {personalInfo.about}
      </p>
    </section>
  );
};

export default AboutSection;
