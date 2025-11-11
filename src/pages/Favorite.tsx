import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosClose } from 'react-icons/io';
import Header from '../components/layout/Header';
import { formatAmount } from '../utils/formatter';
import { getFavoriteList } from '../services/favorite';
import useUpbitWebSocket from '../hooks/useUpbitWebSocket';

export default function Favorites() {
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

  // 관심 종목 목록 가져오기
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favorites = await getFavoriteList();
        setFavoriteList(favorites);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // 티커 목록 생성 및 웹소켓 연결
  const tickers = favoriteList.map((item) => item.ticker);
  const { tickerData } = useUpbitWebSocket(tickers);

  // 웹소켓 데이터와 관심 종목 정보 결합
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
      .filter((coin): coin is CoinData => coin !== null); // null 제거
  }, [tickerData, favoriteList]);

  // 검색 필터링
  const filteredCoins = favoriteCoins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.ticker.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="관심종목" />
      <div className="p-4 sticky top-0 z-10 rounded-full mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="코인 검색"
            className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-full px-6 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setSearchTerm('')}
            >
              <IoIosClose className="text-2xl" />
            </button>
          )}
        </div>
      </div>

      {/* 코인 리스트 */}
      <div className="mx-4 rounded-2xl overflow-hidden mb-6 shadow-lg">
        {isLoading ? (
          <div className="p-8 text-center bg-white rounded-xl dark:bg-gray-800">
            <div className="text-gray-500 dark:text-gray-400">로딩 중...</div>
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
                  거래대금 {formatAmount(coin.accPrice)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {coin.price.toLocaleString()} 원
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
              아직 관심 코인이 없습니다.
            </div>
            <button
              className="text-blue-500 font-medium dark:text-blue-400"
              onClick={() => navigate('/discover')}
            >
              코인 탐색하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
