import type React from 'react';
import ThemeSelector from './ThemeSelector';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-10 py-3 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <h1 className="text-gray-900 dark:text-gray-100 text-lg font-bold leading-tight tracking-tight">
          Tech Portfolio
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeSelector />
      </div>
    </header>
  );
};

export default Header;
