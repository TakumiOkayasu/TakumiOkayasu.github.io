import type React from 'react';
import iconImage from '/icon.webp';
import type { PersonalInfo } from '../types/types';

interface HeroSectionProps {
  personalInfo: PersonalInfo;
}

const HeroSection: React.FC<HeroSectionProps> = ({ personalInfo }) => {
  return (
    <section className="flex p-4">
      <div className="flex w-full flex-col gap-4 items-center">
        <div className="flex gap-4 flex-col items-center">
          <img
            src={iconImage}
            alt="profile"
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 ring-4 ring-gray-200 dark:ring-gray-700 transition-all duration-300"
          />
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-gray-900 dark:text-gray-100 text-2xl font-bold leading-tight tracking-tight">
              {personalInfo.name}
            </h2>
            <p className="text-blue-600 dark:text-blue-400 text-base font-normal leading-normal">
              {personalInfo.title}
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-base font-normal leading-normal max-w-2xl">
              {personalInfo.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
