import type React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-10 py-3 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <div className="text-gray-900 dark:text-gray-100 text-lg leading-tight tracking-tight">
          Tech Portfolio
        </div>
      </div>
    </header>
  );
};

export default Header;
