import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ROUTES } from '../config/routes';
import useUpbitWebSocket from '../hooks/useUpbitWebSocket';
import { getBalance, getHoldingCoins } from '../services/wallet';
import { formatCurrency } from '../utils/formatter';
import { LOG } from '../config/constants';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CoinData {
  ticker: string;
  coinName: string;
  holdingQuantity: number;
  holdingPrice: number;
}

interface Coin {
  id?: string;
  ticker: string;
  holdingQuantity: number;
  holdingPrice: number;
  name: string;
  price?: number;
  value?: number;
  priceChange24h?: number;
  profitRate?: number;
  color?: string;
}

interface ChartItem {
  name: string;
  value: number;
  percent: number;
}

const Wallet = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [holdingCoins, setHoldingCoins] = useState<Coin[]>([]);
  const [holdingCash, setHoldingCash] = useState<number>(0);
  const [tickers, setTickers] = useState<string[]>([]);
  const tickerData = useUpbitWebSocket(tickers);

  useEffect(() => {
    const fetchHoldingCoins = async () => {
      try {
        setIsLoading(true);
        const walletData = (await getHoldingCoins()) as unknown as CoinData[];
        const cash = await getBalance();

        const coins = walletData.map((coin) => ({
          id: coin.ticker.toLowerCase(),
          name: coin.coinName,
          ticker: coin.ticker,
          holdingQuantity: coin.holdingQuantity,
          holdingPrice: coin.holdingPrice,
          price: 0,
          value: 0,
          profitRate: 0,
          color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.8)`,
        }));
        setHoldingCash(cash);
        setHoldingCoins(coins);

        const tickerList = coins.map((coin) => coin.ticker);
        setTickers(tickerList);
      } catch (error) {
        console.error(LOG.ERR.WALLETS.GET_HOLDING_COIN, error);
        setError(t('wallet.failedLoad'));
        setHoldingCoins([]);
        setTickers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoldingCoins();
  }, [t]);

  useEffect(() => {
    if (
      !tickerData ||
      !tickerData.tickerData ||
      Object.keys(tickerData.tickerData).length === 0 ||
      holdingCoins.length === 0
    ) {
      return;
    }

    const updatedCoins = holdingCoins.map((coin) => {
      const marketCode = `KRW-${coin.ticker}`;
      const tickerInfo = tickerData.tickerData[marketCode];

      if (tickerInfo) {
        const currentPrice = tickerInfo.trade_price || 0;
        const currentValue = coin.holdingQuantity * currentPrice;

        const averageBuyPrice =
          coin.holdingQuantity > 0
            ? coin.holdingPrice / coin.holdingQuantity
            : 0;

        let profitRate = 0;
        if (averageBuyPrice > 0) {
          profitRate =
            ((currentPrice - averageBuyPrice) / averageBuyPrice) * 100;
        }

        return {
          ...coin,
          price: currentPrice,
          value: currentValue,
          averageBuyPrice,
          profitRate,
        };
      }

      return coin;
    });

    if (JSON.stringify(updatedCoins) !== JSON.stringify(holdingCoins)) {
      setHoldingCoins(updatedCoins);
    }
  }, [tickerData]);

  const totalCoinValue = holdingCoins.reduce(
    (sum, coin) => sum + Math.max(0, coin.value || 0),
    0,
  );

  const initialInvestment = holdingCoins.reduce(
    (sum, coin) => sum + coin.holdingPrice,
    0,
  );

  const cashBalance = holdingCash;

  const totalAsset = cashBalance + totalCoinValue;

  const calculateTotalProfitRate = () => {
    if (initialInvestment <= 0) return 0;
    return (
      ((totalAsset - (initialInvestment + cashBalance)) /
        (initialInvestment + cashBalance)) *
      100
    );
  };

  const totalProfitRate = calculateTotalProfitRate();

  const positiveCoins = holdingCoins.filter(
    (coin) => coin.value && coin.value > 0,
  );

  const topCoins = positiveCoins
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .slice(0, 4)
    .map((coin) => ({
      name: coin.ticker,
      value: coin.value,
      percent: totalAsset > 0 ? (coin.value! / totalAsset) * 100 : 0,
    })) as ChartItem[];

  const otherCoinsValue = positiveCoins
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .slice(5)
    .reduce((sum, coin) => sum + (coin.value || 0), 0);

  const otherCoinsPercent =
    totalAsset > 0 ? (otherCoinsValue / totalAsset) * 100 : 0;
  const cashPercent = totalAsset > 0 ? (cashBalance / totalAsset) * 100 : 0;

  const chartItems: ChartItem[] = [...topCoins];

  if (otherCoinsValue > 0) {
    chartItems.push({
      name: t('wallet.others'),
      value: otherCoinsValue,
      percent: otherCoinsPercent,
    });
  }

  if (cashBalance > 0) {
    chartItems.push({
      name: t('wallet.cash'),
      value: cashBalance,
      percent: cashPercent,
    });
  }

  const chartBackgroundColors: string[] = [
    ...positiveCoins
      .slice(0, 5)
      .map((coin) => coin.color || 'rgba(75, 192, 192, 0.8)'),
  ];

  if (otherCoinsValue > 0) {
    chartBackgroundColors.push('rgba(150, 150, 150, 0.8)');
  }

  if (cashBalance > 0) {
    chartBackgroundColors.push('rgba(200, 200, 200, 0.8)');
  }

  const data = {
    labels: chartItems.map((item) => item.name),
    datasets: [
      {
        data: chartItems.map((item) => item.percent),
        backgroundColor: chartBackgroundColors,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.raw.toFixed(1)}%`;
          },
        },
      },
    },
    cutout: '70%',
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      <div className="mx-4 mt-4 p-4 bg-white rounded-xl shadow-sm dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700">
        <div className="text-2xl font-bold">
          {formatCurrency(totalAsset, 'KRW', true, false)}
          <span
            className={`text-lg ml-2 ${
              totalProfitRate === 0
                ? 'text-gray-500'
                : totalProfitRate > 0
                  ? 'text-red-500'
                  : 'text-blue-500'
            }`}
          >
            ({totalProfitRate > 0 ? '+' : ''}
            {totalProfitRate.toFixed(2)}%)
          </span>
        </div>
        <div className="flex justify-between mt-4 text-gray-600 dark:text-white">
          <div>
            <div>{t('wallet.invested')}</div>
            <div className="font-medium">
              {formatCurrency(initialInvestment, 'KRW')}
            </div>
          </div>
          <div className="text-left">
            <div>{t('wallet.cash')}</div>
            <div className="font-medium">
              {formatCurrency(cashBalance, 'KRW')}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-4 bg-white mx-4 rounded-xl p-4 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold mb-4">
          {t('wallet.assetDistribution')}
        </h2>
        <div
          className="w-full max-w-[200px] mx-auto"
          style={{ height: '200px' }}
        >
          <Pie data={data} options={options} />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {chartItems.map((item, index) => (
            <div key={item.name} className="flex items-center">
              <div
                className="w-4 h-4 rounded-md mr-2 flex-shrink-0"
                style={{
                  backgroundColor: chartBackgroundColors[index] || '#999',
                }}
              ></div>
              <div>
                <div className="text-sm">{item.name}</div>
                <div className="text-sm font-medium">
                  {item.percent.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-4 mb-6 bg-white rounded-xl dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-bold">{t('wallet.myCoins')}</h2>
        </div>

        {isLoading ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {t('common.loading')}
            </p>
          </div>
        ) : error ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        ) : holdingCoins.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="p-8 text-center bg-white rounded-xl dark:bg-gray-800">
              <div className="text-gray-500 mb-2 dark:text-gray-400">
                {t('wallet.noCoins')}
              </div>
              <button
                className="text-blue-500 font-medium dark:text-blue-400"
                onClick={() => navigate(ROUTES.DISCOVER)}
              >
                {t('wallet.exploreCoins')}
              </button>
            </div>
          </div>
        ) : (
          [...holdingCoins]
            .sort((a, b) => (b.value || 0) - (a.value || 0))
            .map((coin) => (
              <div
                key={coin.id}
                className="p-4 border-b dark:border-gray-700 last:border-b-0 flex items-center"
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
                    {coin.holdingQuantity.toFixed(5)} {coin.ticker}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {formatCurrency(coin.value || 0, 'KRW')}
                  </div>
                  <div
                    className={`text-sm ${
                      (coin.profitRate || 0) === 0
                        ? 'text-gray-500'
                        : (coin.profitRate || 0) > 0
                          ? 'text-red-500'
                          : 'text-blue-500'
                    }`}
                  >
                    {(coin.profitRate || 0) > 0 ? '+' : ''}
                    {(coin.profitRate || 0).toFixed(2)}%
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Wallet;
