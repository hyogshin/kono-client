import { useState, useEffect, useCallback, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Header from '../components/layout/Header';
import TradingViewWidget from '../components/common/TradingViewWidget';
import PriceInfo from '../components/common/PriceInfo';
import useUpbitWebSocket from '../hooks/useUpbitWebSocket';
import { formatAmount, formatCurrency } from '../utils/formatter';
import {
  isFavoriteCoin,
  addFavorite,
  removeFavorite,
} from '../services/favorite';
import { getCoinName } from '../services/coin';
import { getQuantityByTicker } from '../services/wallet';
import { LOG } from '../config/constants';

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

const Chart = memo(({ ticker }: { ticker: string }) => {
  const symbol = `UPBIT:${ticker}KRW`;

  return (
    <div className="w-full h-[400px] bg-gray-50 dark:bg-gray-800">
      <TradingViewWidget symbol={symbol} />
    </div>
  );
});

export default function CoinDetail() {
  const { t } = useTranslation();
  const { ticker } = useParams<{ ticker: string }>();
  const navigate = useNavigate();

  const [coin, setCoin] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  const symbolToUse = ticker || 'BTC';

  const { tickerData } = useUpbitWebSocket([symbolToUse]);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const name = await getCoinName(symbolToUse);
        const isFavorite = await isFavoriteCoin(symbolToUse);
        const exampleCoin: CoinData = {
          id: symbolToUse.toLowerCase(),
          name: name ?? '',
          symbol: symbolToUse,
          price: 0,
          priceChange24h: 0,
          volume24h: 0,
          marketCap: 0,
          high24h: 0,
          low24h: 0,
          isFavorite: isFavorite,
        };

        setCoin(exampleCoin);
        setLoading(false);
      } catch (error) {
        setError(LOG.ERR.COINS.GET_INFO);
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [symbolToUse]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (symbolToUse) {
        const status = await isFavoriteCoin(symbolToUse);
        setIsFavorite(status);
      }
    };
    checkFavoriteStatus();
  }, [symbolToUse]);

  useEffect(() => {
    const checkHoldingStatus = async () => {
      if (symbolToUse) {
        const holding = await getQuantityByTicker(symbolToUse);
        setIsHolding(holding > 0);
      }
    };
    checkHoldingStatus();
  }, [symbolToUse]);

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
      console.error(LOG.ERR.FAVORITES.TOGGLE, error);
    }
  }, [isFavorite, symbolToUse]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title={t('common.loading')} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12"></div>
        </div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title={t('common.error')} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-red-500 mb-4 dark:text-red-400">
              {error || t('coin.failedLoad')}
            </p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg dark:bg-blue-400"
              onClick={() => navigate(-1)}
            >
              {t('common.goBack')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
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

      <PriceInfo
        symbol={symbolToUse}
        tickerData={tickerData}
        name={coin.name}
      />

      <Chart ticker={symbolToUse} />

      {tickerData && tickerData[`KRW-${symbolToUse}`] && (
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">{t('coin.info')}</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">{t('coin.high24h')}</span>
              <span>
                {formatCurrency(tickerData[`KRW-${symbolToUse}`].high_price)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t('coin.low24h')}</span>
              <span>
                {formatCurrency(tickerData[`KRW-${symbolToUse}`].low_price)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t('coin.volume24h')}</span>
              <span>
                {formatAmount(
                  tickerData[`KRW-${symbolToUse}`].acc_trade_price_24h,
                )}{' '}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t('coin.traded24h')}</span>
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

      {/* Button space */}
      <div className="h-16"></div>

      <div className="fixed bottom-16 left-0 right-0 max-w-[430px] mx-auto px-4 py-2 backdrop-blur-lg bg-gradient-to-t from-white/80 via-white/40 to-transparent dark:from-gray-950/80 dark:via-gray-950/40 dark:to-transparent">
        <div className="flex space-x-4">
          <button
            className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium"
            onClick={() => navigate(`/coins/${ticker}/buy`)}
          >
            {t('trade.buy')}
          </button>
          <button
            className={`flex-1 py-3 text-white rounded-xl font-medium ${
              isHolding ? 'bg-blue-500' : 'hidden'
            }`}
            onClick={() => navigate(`/coins/${ticker}/sell`)}
          >
            {t('trade.sell')}
          </button>
        </div>
      </div>
    </div>
  );
}
