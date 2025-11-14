import React from 'react';
import { Switch } from '@headlessui/react';
import { useTheme } from '../../contexts/ThemeContext';

type DarkModeToggleProps = {
  label?: string;
  className?: string;
};

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  label = '',
  className = '',
}) => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-base dark:text-white">{label}</span>
      <Switch
        checked={darkMode}
        onChange={toggleDarkMode}
        className={`${
          darkMode ? 'bg-gray-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
      >
        <span
          className={`${
            darkMode ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
    </div>
  );
};

export default DarkModeToggle;
