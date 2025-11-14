import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">{t('common.pageNotFound')}</p>
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium"
          onClick={() => navigate('/')}
        >
          {t('common.goHome')}
        </button>
      </div>
    </div>
  );
}
