import type React from 'react';
import { useThemeContext } from '../contexts/ThemeContext';
import type { PersonalInfo } from '../types/types';

interface AboutSectionProps {
  personalInfo: PersonalInfo;
}

const AboutSection: React.FC<AboutSectionProps> = ({ personalInfo }) => {
  const { resolvedTheme } = useThemeContext();
  const isDarkMode = resolvedTheme === 'dark';

  return (
    <section id="about" className="transition-colors duration-300">
      <h2
        className={`text-gray-900 brightness-0 ${isDarkMode ? 'invert' : ''} dark:text-gray-100 text-2xl font-bold leading-tight tracking-tight px-4 pb-3 pt-5`}
      >
        About
      </h2>
      <p
        className={`text-gray-700 brightness-0 ${isDarkMode ? 'invert' : ''} dark:text-gray-300 text-base font-normal leading-relaxed pb-3 pt-1 px-4`}
      >
        {personalInfo.about}
      </p>
    </section>
  );
};

export default AboutSection;
