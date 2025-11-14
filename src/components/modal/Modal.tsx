import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions,
}: ModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 dark:bg-white dark:bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-11/12 max-w-xs dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl text-center font-bold mb-4">{title}</h3>
        <div className="mb-6">{children}</div>
        {actions ? (
          <div className="flex space-x-4">{actions}</div>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {t('common.confirm')}
          </button>
        )}
      </div>
    </div>
  );
}
