import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IoIosClose } from 'react-icons/io';
import useUpbitWebSocket from '../hooks/useUpbitWebSocket';
import { formatAmount } from '../utils/formatter';
import { getCoins } from '../services/coin';
import { LOG } from '../config/constants';

type SortType = 'volume' | 'price' | 'change';

interface Coin {
  id: string;
  name: string;
  ticker: string;
  accPrice: number;
  price: number;
  priceChange24h: number;
  rateChange24h: number;
}

interface CoinInfo {
  ticker: string;
  coinName: string;
}

const SORT_TYPES: SortType[] = ['volume', 'price', 'change'];

const PLACEHOLDER = 'https://static.upbit.com/logos/BTC.png';

export default function Discover() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<SortType>('volume');
  const [coinInfo, setCoinInfo] = useState<CoinInfo[]>([]);
  const [tickers, setTickers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    getCoins()
      .then((res) => {
        const data: CoinInfo[] = res;
        setCoinInfo(data);

        const tickerList = data.map((coin) => coin.ticker);
        setTickers(tickerList);
      })
      .catch((err) => {
        console.error(LOG.ERR.COINS.FETCH_DATA, err);
        setError(t('discover.failedLoad'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [t]);

  const { tickerData } = useUpbitWebSocket(tickers);

  const coins = useMemo(() => {
    if (!coinInfo.length || !Object.keys(tickerData).length) {
      return [];
    }

    return Object.entries(tickerData)
      .map(([code, data]) => {
        const ticker = code.split('-')[1];
        const info = coinInfo.find((coin) => coin.ticker === ticker);

        if (!info) return null;

        return {
          id: code,
          name: info.coinName,
          ticker: ticker,
          accPrice: data.acc_trade_price_24h || 0,
          price: data.trade_price || 0,
          priceChange24h: data.signed_change_price || 0,
          rateChange24h: data.signed_change_rate * 100 || 0,
        };
      })
      .filter(Boolean) as Coin[];
  }, [tickerData, coinInfo]);

  const filteredCoins = useMemo(() => {
    if (!searchTerm.trim()) return coins;

    return coins.filter(
      (coin) =>
        coin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.ticker?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [coins, searchTerm]);

  const sortedCoins = useMemo(() => {
    return [...filteredCoins].sort((a, b) => {
      if (activeTab === 'volume') {
        return b.accPrice - a.accPrice;
      } else if (activeTab === 'price') {
        return b.price - a.price;
      } else {
        return b.rateChange24h - a.rateChange24h;
      }
    });
  }, [filteredCoins, activeTab]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleTabChange = (tab: SortType) => {
    setActiveTab(tab);
  };

  const handleCoinClick = (ticker: string) => {
    navigate(`/coins/${ticker}`);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      <SearchBar
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onClear={handleClearSearch}
        placeholder={t('discover.searchPlaceholder')}
      />

      <SortTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <CoinList
        coins={sortedCoins}
        isLoading={isLoading}
        error={error}
        onCoinClick={handleCoinClick}
      />
    </div>
  );
}

function SearchBar({
  searchTerm,
  onSearch,
  onClear,
  placeholder,
}: {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder: string;
}) {
  return (
    <div className="p-4 z-10 rounded-xl">
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full p-3 bg-gray-200 dark:bg-gray-800 rounded-full px-6"
          value={searchTerm}
          onChange={onSearch}
        />
        {searchTerm && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 "
            onClick={onClear}
          >
            <IoIosClose className="text-2xl text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
}

function SortTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: SortType;
  onTabChange: (tab: SortType) => void;
}) {
  const { t } = useTranslation();

  const getSortLabel = (tab: SortType) => {
    switch (tab) {
      case 'volume':
        return t('discover.sortVolume');
      case 'price':
        return t('discover.sortPrice');
      case 'change':
        return t('discover.sortChange');
      default:
        return tab;
    }
  };

  return (
    <div className="flex mx-4 border-b bg-white top-[116px] z-10 rounded-t-xl shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-700">
      {SORT_TYPES.map((tab) => (
        <button
          key={tab}
          className={`flex-1 py-3 text-center ${
            activeTab === tab
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500'
          }`}
          onClick={() => onTabChange(tab)}
        >
          {getSortLabel(tab)}
        </button>
      ))}
    </div>
  );
}

function CoinItem({
  coin,
  onClick,
}: {
  coin: Coin;
  onClick: (ticker: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <div
      className="p-4 border-b border-gray-200 bg-white flex items-center dark:border-gray-700 dark:bg-gray-800 dark:text-white last:border-0"
      onClick={() => onClick(coin.ticker)}
    >
      <img
        src={`https://static.upbit.com/logos/${coin.ticker}.png`}
        alt={coin.name}
        className="w-10 h-10 rounded-full mr-4"
        onError={(e) => {
          (e.target as HTMLImageElement).src = PLACEHOLDER;
        }}
      />
      <div className="flex-1">
        <div className="flex items-center">
          <span className="font-medium">{coin.name}</span>
          <span className="text-gray-500 text-sm ml-2">{coin.ticker}</span>
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
  );
}

function CoinList({
  coins,
  isLoading,
  error,
  onCoinClick,
}: {
  coins: Coin[];
  isLoading: boolean;
  error: string | null;
  onCoinClick: (ticker: string) => void;
}) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="mx-4 flex-1 flex items-center justify-center p-8 bg-white rounded-b-xl dark:bg-gray-800 dark:text-white">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 flex-1 flex items-center justify-center p-8 bg-white rounded-b-xl dark:bg-gray-800 dark:text-white">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (coins.length === 0) {
    return (
      <div className="mx-4 flex-1 flex items-center justify-center p-8 bg-white rounded-b-xl dark:bg-gray-800 dark:text-white">
        <p>{t('discover.noResults')}</p>
      </div>
    );
  }

  return (
    <div className="mx-4 flex-1 rounded-b-xl overflow-hidden mb-6 shadow-lg">
      {coins.map((coin) => (
        <CoinItem key={coin.id} coin={coin} onClick={onCoinClick} />
      ))}
    </div>
  );
}
