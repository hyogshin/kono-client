import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFilter } from 'react-icons/fa';
import FilterModal, { FilterType } from '../components/modal/FilterModal';
import { formatDate, formatCurrency } from '../utils/formatter';
import {
  getTransactions,
  Transaction as TransactionType,
} from '../services/transaction';
import { LOG } from '../config/constants';

export default function Transaction() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>(
    t('transactions.all'),
  );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getTransactions();

        setTransactions(data);
        setError(null);
      } catch (error) {
        console.error(LOG.ERR.TRANSACTIONS.GET_HISTORY, error);
        setError(t('transactions.failedLoad'));
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [t]);

  const filteredTransactions = transactions.filter((transaction) => {
    if (activeFilter === t('transactions.all')) return true;
    return (
      transaction.orderType ===
      (activeFilter === t('trade.buy') ? 'buy' : 'sell')
    );
  });

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => window.location.reload()}
            >
              {t('common.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const changeFilter = (filter: FilterType) => {
    setActiveFilter(filter);
    setShowFilterModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      <div className="mx-4 mt-4 bg-white p-4 border-b flex justify-between rounded-t-xl dark:bg-gray-800 dark:text-white dark:border-gray-700">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">
            {t('common.filter')}:
          </span>
          <span className="text-sm font-medium">{activeFilter}</span>
        </div>
        <button onClick={toggleFilterModal} className="p-1">
          <FaFilter className="text-xl" />
        </button>
      </div>

      {filteredTransactions.length > 0 ? (
        <div className="flex-1 rounded-xl mx-4 mb-6">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.transactionId}
              className="p-4 border-b bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <img
                    src={`https://static.upbit.com/logos/${transaction.ticker}.png`}
                    alt={transaction.coinName}
                    className="w-10 h-10 rounded-full mr-3"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/40';
                    }}
                  />
                  <div>
                    <div className="font-medium">{transaction.coinName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.ticker}
                    </div>
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded-md text-sm font-medium ${
                    transaction.orderType === 'buy'
                      ? 'bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-400'
                      : 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-400'
                  }`}
                >
                  {transaction.orderType === 'buy'
                    ? t('trade.buy')
                    : t('trade.sell')}
                </div>
              </div>

              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">
                  {t('trade.quantity')}
                </span>
                <span>
                  {transaction.orderQuantity} {transaction.ticker}
                </span>
              </div>

              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">
                  {t('trade.price')}
                </span>
                <span>{formatCurrency(transaction.orderPrice)}</span>
              </div>

              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">
                  {t('trade.total')}
                </span>
                <span className="font-medium">
                  {formatCurrency(transaction.orderAmount)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  {t('transactions.date')}
                </span>
                <span>{formatDate(transaction.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-xl font-bold mb-2">
            {t('transactions.noTrades')}
          </div>
          <div className="text-gray-500 text-center mb-6 dark:text-gray-400">
            {t('transactions.firstTrade')}
          </div>
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium dark:bg-blue-400"
            onClick={() => navigate('/discover')}
          >
            {t('wallet.exploreCoins')}
          </button>
        </div>
      )}

      <FilterModal
        isOpen={showFilterModal}
        activeFilter={activeFilter}
        onClose={() => setShowFilterModal(false)}
        onFilterChange={changeFilter}
      />
    </div>
  );
}
