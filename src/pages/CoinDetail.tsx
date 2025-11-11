import { useState, useEffect, useCallback, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Header from '../components/layout/Header';
import TradingViewWidget from '../components/TradingViewWidget';
import PriceInfo from '../components/PriceInfo'; // 수정된 PriceInfo 컴포넌트 임포트
import useUpbitWebSocket from '../hooks/useUpbitWebSocket';
import { formatAmount, formatCurrency } from '../utils/formatter';
import { isFavoriteCoin, addFavorite, removeFavorite } from '../services/favorite';
import { getCoinName } from '../services/coin';
import { getQuantityByTicker } from '../services/wallet';

// 코인 정보 인터페이스
interface CoinData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  isFavorite: boolean;
}

// 차트 컴포넌트를 메모이제이션
const Chart = memo(({ ticker }: { ticker: string }) => {
  // 심볼 형식 변환
  const symbol = `UPBIT:${ticker}KRW`;

  return (
    <div className="w-full h-[400px] border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
      <TradingViewWidget symbol={symbol} />
    </div>
  );
});

export default function CoinDetail() {
  const { ticker } = useParams<{ ticker: string }>();
  const navigate = useNavigate();

  const [coin, setCoin] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  // ticker가 undefined일 경우 기본값으로 'BTC' 사용
  const symbolToUse = ticker || 'BTC';

  // useUpbitWebSocket 훅 사용
  // const { tickerData, isConnected } = useUpbitWebSocket([symbolToUse]);
  const { tickerData } = useUpbitWebSocket([symbolToUse]);

  // 코인 데이터 설정
  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const name = await getCoinName(symbolToUse);
        const isFavorite = await isFavoriteCoin(symbolToUse);
        const exampleCoin: CoinData = {
          id: symbolToUse.toLowerCase(),
          name: name ?? '',
          symbol: symbolToUse,
          price: 0, // 웹소켓에서 업데이트됨
          priceChange24h: 0, // 웹소켓에서 업데이트됨
          volume24h: 0, // 웹소켓에서 업데이트됨
          marketCap: 0,
          high24h: 0, // 웹소켓에서 업데이트됨
          low24h: 0, // 웹소켓에서 업데이트됨
          isFavorite: isFavorite,
        };

        setCoin(exampleCoin);
        setLoading(false);
      } catch (err) {
        setError('코인 정보를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [symbolToUse]);

  // 초기 관심 상태 확인
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (symbolToUse) {
        const status = await isFavoriteCoin(symbolToUse);
        setIsFavorite(status);
      }
    };
    checkFavoriteStatus();
  }, [symbolToUse]);

  // 초기 코인 코유 여부 확인
  useEffect(() => {
    const checkHoldingStatus = async () => {
      if (symbolToUse) {
        const holding = await getQuantityByTicker(symbolToUse);
        setIsHolding(holding > 0);
      }
    };
    checkHoldingStatus();
  }, [symbolToUse]);

  // 즐겨찾기 토글 함수
  const toggleFavorite = useCallback(async () => {
    if (!symbolToUse) return;

    try {
      if (isFavorite) {
        const success = await removeFavorite(symbolToUse);
        if (success) {
          setIsFavorite(false);
        }
      } else {
        const success = await addFavorite(symbolToUse);
        if (success) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  }, [isFavorite, symbolToUse]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="로딩 중..." />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="오류" />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-red-500 mb-4 dark:text-red-400">
              {error || '코인 정보를 불러올 수 없습니다.'}
            </p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg dark:bg-blue-400"
              onClick={() => navigate(-1)}
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 */}
      <Header
        title={coin.name}
        rightElement={
          <button onClick={toggleFavorite} className="p-2">
            {isFavorite ? (
              <FaHeart className="text-red-400 text-xl" />
            ) : (
              <FaRegHeart className="text-gray-400 text-xl" />
            )}
          </button>
        }
      />
      {/* Google Analytics 스크립트 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'YOUR-GA-ID');
          `
        }}
      />
      {/* PriceInfo 컴포넌트 사용 */}
      <PriceInfo
        symbol={symbolToUse}
        tickerData={tickerData}
        name={coin.name}
      />

      {/* 차트 */}
      <Chart ticker={symbolToUse} />

      {/* 코인 상세 정보 */}
      {tickerData && tickerData[`KRW-${symbolToUse}`] && (
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">코인 정보</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">최고가 (24h)</span>
              <span>
                {formatCurrency(tickerData[`KRW-${symbolToUse}`].high_price)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">최저가 (24h)</span>
              <span>
                {formatCurrency(tickerData[`KRW-${symbolToUse}`].low_price)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">거래대금 (24h)</span>
              <span>
                {formatAmount(
                  tickerData[`KRW-${symbolToUse}`].acc_trade_price_24h,
                )}{' '}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">거래량 (24h)</span>
              <span>
                {tickerData[`KRW-${symbolToUse}`].acc_trade_volume_24h.toFixed(
                  2,
                )}{' '}
                {symbolToUse}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 매수/매도 버튼 */}
      <div className="p-4 mt-auto">
        <div className="flex space-x-4">
          <button
            className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium"
            onClick={() => navigate(`/coins/${ticker}/buy`)}
          >
            매수
          </button>
          <button
            className={`flex-1 py-3 text-white rounded-xl font-medium ${
              isHolding ? 'bg-blue-500' : 'hidden'
            }`}
            onClick={() => navigate(`/coins/${ticker}/sell`)}
          >
            매도
          </button>
        </div>
      </div>
    </div>
  );
}
