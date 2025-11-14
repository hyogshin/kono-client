import React from 'react';
import { useTranslation } from 'react-i18next';
import type { FilterType } from '../../types';

interface FilterModalProps {
  isOpen: boolean;
  activeFilter: FilterType;
  onClose: () => void;
  onFilterChange: (filter: FilterType) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  activeFilter,
  onClose,
  onFilterChange,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const filters: FilterType[] = [
    t('transactions.all'),
    t('trade.buy'),
    t('trade.sell'),
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 dark:bg-gray-800 dark:bg-opacity-50">
      <div className="bg-white rounded-xl w-full max-w-[390px] p-4 dark:bg-gray-800">
        <div className="text-lg text-center font-bold mb-4">
          {t('common.filter')}
        </div>

        {filters.map((filter) => (
          <button
            key={filter}
            className={`w-full text-left p-3 mb-2 rounded-xl ${
              activeFilter === filter
                ? 'bg-blue-50 text-blue-500 dark:bg-blue-900 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </button>
        ))}

        <button
          className="w-full py-3 mt-2 rounded-xl bg-gray-200 text-gray-700 font-medium dark:bg-gray-700 dark:text-gray-300"
          onClick={onClose}
        >
          {t('common.cancel')}
        </button>
      </div>
    </div>
  );
};

export default FilterModal;
