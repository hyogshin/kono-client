import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IoIosClose } from 'react-icons/io';
import { formatAmount } from '../utils/formatter';
import { getFavoriteList } from '../services/favorite';
import useUpbitWebSocket from '../hooks/useUpbitWebSocket';
import { LOG } from '../config/constants';

export default function Favorites() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteList, setFavoriteList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  interface CoinData {
    key: string;
    name: string;
    ticker: string;
    accPrice: number;
    price: number;
    priceChange24h: number;
    rateChange24h: number;
  }

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favorites = await getFavoriteList();
        setFavoriteList(favorites);
        setIsLoading(false);
      } catch (error) {
        console.error(LOG.ERR.FAVORITES.GET_LIST, error);
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const tickers = favoriteList.map((item) => item.ticker);
  const { tickerData } = useUpbitWebSocket(tickers);

  const favoriteCoins: CoinData[] = useMemo(() => {
    if (
      !tickerData ||
      Object.keys(tickerData).length === 0 ||
      favoriteList.length === 0
    ) {
      return [];
    }

    return favoriteList
      .map((favorite) => {
        const marketCode = `KRW-${favorite.ticker}`;
        const data = tickerData[marketCode];

        if (!data) return null;

        return {
          key: favorite.ticker.toLowerCase(),
          name: favorite.coinName,
          ticker: favorite.ticker,
          accPrice: data.acc_trade_price_24h || 0,
          price: data.trade_price || 0,
          priceChange24h: data.signed_change_price || 0,
          rateChange24h: data.signed_change_rate * 100 || 0,
        };
      })
      .filter((coin): coin is CoinData => coin !== null);
  }, [tickerData, favoriteList]);

  const filteredCoins = favoriteCoins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.ticker.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      <div className="p-4 z-10 rounded-full">
        <div className="relative">
          <input
            type="text"
            placeholder={t('favorites.searchPlaceholder')}
            className="w-full p-3 bg-gray-200 dark:bg-gray-800 rounded-full px-6 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setSearchTerm('')}
            >
              <IoIosClose className="text-2xl text-gray-700" />
            </button>
          )}
        </div>
      </div>

      <div className="mx-4 rounded-2xl overflow-hidden mb-6 shadow-lg">
        {isLoading ? (
          <div className="p-8 text-center bg-white rounded-xl dark:bg-gray-800">
            <div className="text-gray-500 dark:text-gray-400">
              {t('common.loading')}
            </div>
          </div>
        ) : filteredCoins.length > 0 ? (
          filteredCoins.map((coin) => (
            <div
              key={coin.key}
              className="p-4 border-b border-gray-200 bg-white flex items-center last:border-0 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              onClick={() => navigate(`/coins/${coin.ticker}`)}
            >
              <img
                src={`https://static.upbit.com/logos/${coin.ticker}.png`}
                alt={coin.name}
                className="w-10 h-10 rounded-full mr-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/40';
                }}
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-medium">{coin.name}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {coin.ticker}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {t('discover.sortVolume')} {formatAmount(coin.accPrice)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {coin.price.toLocaleString()} {t('common.krw')}
                </div>
                <div
                  className={`text-sm ${
                    coin.rateChange24h >= 0 ? 'text-red-500' : 'text-blue-500'
                  }`}
                >
                  {coin.rateChange24h >= 0 ? '+' : ''}
                  {coin.rateChange24h.toFixed(2)}%
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-white rounded-xl dark:bg-gray-800">
            <div className="text-gray-500 mb-2 dark:text-gray-400">
              {t('favorites.noFavorites')}
            </div>
            <button
              className="text-blue-500 font-medium dark:text-blue-400"
              onClick={() => navigate('/discover')}
            >
              {t('favorites.exploreCoins')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
