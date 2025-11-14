import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../config/routes';
import {
  FaGithub,
  FaUser,
  FaSignOutAlt,
  FaInfoCircle,
  FaUserMinus,
  FaExclamationTriangle,
  FaBeer,
  FaSun,
  FaMoon,
} from 'react-icons/fa';
import DarkModeToggle from '../components/theme/DarkModeToggle';
import Modal from '../components/modal/Modal';
import { withdrawUser } from '../services/user';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LOG, UI } from '../config/constants';

const Settings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { darkMode } = useTheme();
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js';
    script.setAttribute('data-name', 'bmc-button');
    script.setAttribute('data-slug', '98xb810ibl');
    script.setAttribute('data-color', '#5F7FFF');
    script.setAttribute('data-emoji', '🍺');
    script.setAttribute('data-font', 'Inter');
    script.setAttribute('data-text', 'Buy me a beer');
    script.setAttribute('data-outline-color', '#000000');
    script.setAttribute('data-font-color', '#ffffff');
    script.setAttribute('data-coffee-color', '#FFDD00');
    script.async = true;

    const existingScript = document.querySelector(
      'script[data-name="bmc-button"]',
    );
    if (!existingScript) {
      document.body.appendChild(script);
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const openGitHubWiki = () => {
    window.open(
      'https://github.com/100-hours-a-week/7-team-secretjuju-kono-wiki/wiki',
      '_blank',
    );
  };

  const handleBuyMeABeer = () => {
    window.open('https://www.buymeacoffee.com/98xb810ibl', '_blank');
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(UI.OK.AUTH.LOGOUT);
    } catch (error) {
      console.error(LOG.ERR.USER.LOGOUT, error);
      toast.error(UI.ERR.USER.LOGOUT);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteAccountModal(true);
  };

  const closeDeleteAccountModal = () => {
    setShowDeleteAccountModal(false);
  };

  const confirmDeleteAccount = async () => {
    try {
      await withdrawUser();
      toast.success(UI.OK.USER.DELETE_ACCOUNT);
      closeDeleteAccountModal();
      window.location.href = ROUTES.AUTH.LOGIN;
    } catch (error) {
      console.error(LOG.ERR.USER.DELETE, error);
      if (error.response?.status === 401) {
        toast.error(UI.ERR.USER.WITHDRAW_UNAUTHORIZED);
      } else if (error.response?.status === 403) {
        toast.error(UI.ERR.USER.WITHDRAW_FORBIDDEN);
      } else {
        toast.error(UI.ERR.USER.WITHDRAW);
      }
      closeDeleteAccountModal();
    }
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950">
      <div className="mx-4 my-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 flex items-center">
          {darkMode ? (
            <FaMoon className="text-gray-500 dark:text-gray-400 text-xl mr-2" />
          ) : (
            <FaSun className="text-gray-500 dark:text-gray-400 text-xl mr-2" />
          )}
          <span className="flex-1">{t('settings.darkMode')}</span>
          <DarkModeToggle />
        </div>
      </div>

      <div className="mx-4 mb-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm  border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => navigate('/profile')}
          className="w-full text-left p-4 flex items-center"
        >
          <FaUser className="text-gray-500 dark:text-gray-400 mr-3" />
          <span className="text-base">{t('profile.edit')}</span>
        </button>
      </div>

      <div className="mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-4 border border-gray-200 dark:border-gray-700">
        <button
          onClick={handleBuyMeABeer}
          className="w-full text-left p-4 flex items-center"
        >
          <FaBeer className="text-gray-500 dark:text-gray-400 mr-3" />
          <span className="text-base">{t('settings.buyBeer')}</span>
        </button>
      </div>

      <div className="mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-4 border border-gray-200 dark:border-gray-700">
        <h2 className="p-4 border-b dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400">
          {t('settings.appInfo')}
        </h2>

        <button
          onClick={openGitHubWiki}
          className="w-full text-left p-4 flex items-center border-b dark:border-gray-700"
        >
          <FaGithub className="text-gray-500 dark:text-gray-400 mr-3" />
          <div>
            <span className="text-base block">
              {t('settings.developerInfo')}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              7-team-secretjuju
            </span>
          </div>
        </button>

        <div className="p-4 flex items-center">
          <FaInfoCircle className="text-gray-500 dark:text-gray-400 mr-3" />
          <div>
            <span className="text-base block">{t('settings.appVersion')}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              1.0.0
            </span>
          </div>
        </div>
      </div>

      <div className="mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-4 border border-gray-200 dark:border-gray-700">
        <h2 className="p-4 border-b dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400">
          {t('settings.account')}
        </h2>

        <button
          onClick={handleLogout}
          className="w-full text-left p-4 flex items-center text-red-500"
        >
          <FaSignOutAlt className="mr-3" />
          <span className="text-base">{t('auth.logout')}</span>
        </button>
      </div>

      <div className="mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <button
          onClick={handleDeleteAccount}
          className="flex items-center w-full text-left p-4 text-red-500"
        >
          <FaUserMinus className="mr-3" />
          <span className="text-base">{t('auth.deleteAccount')}</span>
        </button>
      </div>

      <Modal
        isOpen={showDeleteAccountModal}
        onClose={closeDeleteAccountModal}
        actions={
          <>
            <button
              onClick={closeDeleteAccountModal}
              className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={confirmDeleteAccount}
              className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              {t('auth.deleteAccount')}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <FaExclamationTriangle className="text-4xl text-red-500" />
          </div>
          <p className="text-center font-medium dark:text-white">
            {t('auth.deleteAccountConfirm')}
          </p>
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            {t('auth.deleteAccountWarning')}
          </p>
        </div>
      </Modal>

      <div className=" p-4 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>© 2025 KONO. All rights reserved.</p>
        <p className="mt-1">Made with full heart by Team Secret JuJu</p>
      </div>
    </div>
  );
};

export default Settings;
