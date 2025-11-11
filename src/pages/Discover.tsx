import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosClose } from 'react-icons/io';
import Header from '../components/layout/Header';
import useUpbitWebSocket from '../hooks/useUpbitWebSocket';
import { formatAmount } from '../utils/formatter';
import { getCoins } from '../services/coin';

// Types
type SortType = '거래대금' | '가격' | '등락률';

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

// 상수 정의
const SORT_TYPES: SortType[] = ['거래대금', '가격', '등락률'];

const PLACEHOLDER = 'https://static.upbit.com/logos/BTC.png';

export default function Discover() {
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<SortType>('거래대금');
  const [coinInfo, setCoinInfo] = useState<CoinInfo[]>([]);
  const [tickers, setTickers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // 코인 정보 가져오기
  useEffect(() => {
    setIsLoading(true);
    getCoins()
      .then((res) => {
        const data: CoinInfo[] = res;
        setCoinInfo(data);

        // 티커 목록 추출
        const tickerList = data.map((coin) => coin.ticker);
        setTickers(tickerList);
      })
      .catch((err) => {
        console.error(`Failed to fetch coin data: ${err}`);
        setError('코인 정보를 불러오는데 실패했습니다.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // 웹소켓 연결
  const { tickerData } = useUpbitWebSocket(tickers);

  // 웹소켓 데이터와 코인 정보 결합
  const coins = useMemo(() => {
    if (!coinInfo.length || !Object.keys(tickerData).length) {
      return [];
    }

    return Object.entries(tickerData)
      .map(([code, data]) => {
        // KRW-BTC 형식에서 BTC만 추출
        const ticker = code.split('-')[1];
        // coinInfo에서 해당 티커의 정보 찾기
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

  // 검색 필터링
  const filteredCoins = useMemo(() => {
    if (!searchTerm.trim()) return coins;

    return coins.filter(
      (coin) =>
        coin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.ticker?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [coins, searchTerm]);

  // 정렬 로직
  const sortedCoins = useMemo(() => {
    return [...filteredCoins].sort((a, b) => {
      if (activeTab === '거래대금') {
        return b.accPrice - a.accPrice;
      } else if (activeTab === '가격') {
        return b.price - a.price;
      } else {
        return b.rateChange24h - a.rateChange24h;
      }
    });
  }, [filteredCoins, activeTab]);

  // 이벤트 핸들러
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
    <div className="flex flex-col min-h-screen">
      <Header title="탐색" />

      {/* 검색 바 */}
      <SearchBar
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />

      {/* 정렬 탭 */}
      <SortTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 코인 리스트 */}
      <CoinList
        coins={sortedCoins}
        isLoading={isLoading}
        error={error}
        onCoinClick={handleCoinClick}
      />
    </div>
  );
}

// 하위 컴포넌트 분리

// 검색 바 컴포넌트
function SearchBar({
  searchTerm,
  onSearch,
  onClear,
}: {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  return (
    <div className="p-4 sticky top-0 z-10 rounded-xl mb-4">
      <div className="relative">
        <input
          type="text"
          placeholder="코인 검색"
          className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-full px-6"
          value={searchTerm}
          onChange={onSearch}
        />
        {searchTerm && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={onClear}
          >
            <IoIosClose className="text-2xl" />
          </button>
        )}
      </div>
    </div>
  );
}

// 정렬 탭 컴포넌트
function SortTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: SortType;
  onTabChange: (tab: SortType) => void;
}) {
  return (
    <div className="flex mx-4 border-b bg-white sticky top-[116px] z-10 rounded-t-xl shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-700">
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
          {tab}
        </button>
      ))}
    </div>
  );
}

// 코인 항목 컴포넌트
function CoinItem({
  coin,
  onClick,
}: {
  coin: Coin;
  onClick: (ticker: string) => void;
}) {
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
          거래대금 {formatAmount(coin.accPrice)}
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">{coin.price.toLocaleString()} 원</div>
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

// 코인 리스트 컴포넌트
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
  if (isLoading) {
    return (
      <div className="mx-4 flex-1 flex items-center justify-center p-8 bg-white rounded-b-xl dark:bg-gray-800 dark:text-white">
        <p>로딩 중...</p>
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
        <p>검색 결과가 없습니다.</p>
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
