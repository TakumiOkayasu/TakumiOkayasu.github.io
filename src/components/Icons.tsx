import type React from 'react';

interface IconProps {
  className?: string;
  isDarkMode?: boolean;
}

export const SunIcon: React.FC<IconProps> = () => {
  return (
    <img
      src="/sun.svg"
      alt="sun icon"
      className={`size-8 absolute inset-0 m-auto transition-all duration-500 opacity-100 rotate-0 invert`}
    />
  );
};

export const MoonIcon: React.FC<IconProps> = () => {
  return (
    <img
      src="/moon.svg"
      alt="moon icon"
      className={`size-8 absolute transition-all duration-500 opacity-100 rotate-0 brightness-0 invert`}
    />
  );
};

export const GitHubIcon: React.FC<IconProps> = ({ className, isDarkMode }) => {
  return (
    <img
      src="/github-icon.svg"
      alt="github icon"
      className={`${className || ''} brightness-0 ${isDarkMode ? ' invert' : ''} transition-all duration-300`}
    />
  );
};

export const EmailIcon: React.FC<IconProps> = ({ className, isDarkMode }) => {
  return (
    <img
      src="/email-icon.svg"
      alt="email icon"
      className={`${className || ''} brightness-0 ${isDarkMode ? ' invert' : ''} transition-all duration-300`}
    />
  );
};
