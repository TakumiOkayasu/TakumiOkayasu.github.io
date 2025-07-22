import type React from 'react';

interface IconProps {
  className?: string;
  isDarkMode?: boolean;
}

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
