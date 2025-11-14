import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MdWallet } from 'react-icons/md';
import { FaCompass } from 'react-icons/fa';
import { ROUTES } from '../../config/routes';
import { FaHeart } from 'react-icons/fa';
import { FaCrown } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';

const BottomNavigation: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname;
  const pathMappings = {
    wallet: [ROUTES.WALLET, ROUTES.TRANSACTION],
    discover: [ROUTES.DISCOVER, '/coins'],
    favorite: [ROUTES.FAVORITE],
    ranking: [ROUTES.RANKING],
    settings: [ROUTES.SETTINGS, '/profile'],
  };

  const isActive = (
    category: 'wallet' | 'discover' | 'favorite' | 'ranking' | 'settings',
  ): boolean => {
    return pathMappings[category].some((path) => {
      if (currentPath === path) return true;
      if (path !== '/' && currentPath.startsWith(path)) return true;
      return false;
    });
  };

  const NavItem = ({
    to,
    category,
    icon: Icon,
    label,
  }: {
    to: string;
    category: 'wallet' | 'discover' | 'favorite' | 'ranking' | 'settings';
    icon: React.ElementType;
    label: string;
  }) => {
    const active = isActive(category);

    return (
      <li className="flex-1 h-full">
        <Link
          to={to}
          className="flex flex-col items-center justify-center h-full w-full group relative touch-manipulation"
        >
          <div className="relative h-7 flex items-center transition-all duration-200 ease-in-out">
            <Icon
              className={`text-xl transition-all duration-200 ease-in-out ${active ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
            />
          </div>

          <span
            className={`text-xs mt-1 transition-all duration-200 ease-in-out ${active ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
          >
            {label}
          </span>

          {active && (
            <span className="absolute inset-x-0 top-0 h-0.5 bg-blue-500 rounded-full" />
          )}
        </Link>
      </li>
    );
  };

  return (
    <footer className="sticky bottom-0 left-0 right-0 max-w-[430px] w-full mx-auto backdrop-blur-md bg-white/70 dark:bg-black/40 z-10">
      <nav className="max-w-[430px] mx-auto">
        <ul className="flex h-16 w-full">
          <NavItem
            to={ROUTES.WALLET}
            category="wallet"
            icon={MdWallet}
            label={t('pages.wallet')}
          />
          <NavItem
            to={ROUTES.DISCOVER}
            category="discover"
            icon={FaCompass}
            label={t('pages.discover')}
          />
          <NavItem
            to={ROUTES.FAVORITE}
            category="favorite"
            icon={FaHeart}
            label={t('pages.favorites')}
          />
          <NavItem
            to={ROUTES.RANKING}
            category="ranking"
            icon={FaCrown}
            label={t('pages.rankings')}
          />
          <NavItem
            to={ROUTES.SETTINGS}
            category="settings"
            icon={IoMdSettings}
            label={t('pages.settings')}
          />
        </ul>
      </nav>
    </footer>
  );
};

export default BottomNavigation;
