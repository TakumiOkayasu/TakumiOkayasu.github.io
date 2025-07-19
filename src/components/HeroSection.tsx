import type React from 'react';
import { useThemeContext } from '../contexts/ThemeContext';
import type { PersonalInfo } from '../types/types';

interface HeroSectionProps {
  personalInfo: PersonalInfo;
}

const HeroSection: React.FC<HeroSectionProps> = ({ personalInfo }) => {
  const { resolvedTheme } = useThemeContext();
  const isDarkMode = resolvedTheme === 'dark';

  return (
    <section className="flex p-4">
      <div className="flex w-full flex-col gap-4 items-center">
        <div className="flex gap-4 flex-col items-center">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 ring-4 ring-gray-200 dark:ring-gray-700 transition-all duration-300"
            style={{ backgroundImage: `url('${personalInfo.avatar}')` }}
          />
          <div className="flex flex-col items-center justify-center ">
            <h2
              className={`text-gray-900 text-2xl font-bold leading-tight tracking-tight brightness-0 ${isDarkMode ? 'invert' : ''} dark:text-gray-100`}
            >
              {personalInfo.name}
            </h2>
            <p className={`text-blue-600 text-base font-normal leading-normal brightness-0 ${isDarkMode ? 'invert' : ''} dark:text-blue-400`}>
              {personalInfo.title}
            </p>
            <p className={`text-gray-600 text-center text-base font-normal leading-normal max-w-2xl brightness-0 ${isDarkMode ? 'invert' : ''} dark:text-gray-400`}>
              {personalInfo.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
