import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaHistory } from 'react-icons/fa';
import { ROUTES } from '../config/routes';
import useUpbitWebSocket from '../hooks/useUpbitWebSocket';
import { getBalance, getHoldingCoins } from '../services/wallet';
import { formatCurrency } from '../utils/formatter';

ChartJS.register(ArcElement, Tooltip, Legend);

// API 응답용
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

// 차트 데이터용
interface ChartItem {
  name: string;
  value: number;
  percent: number;
}

const Wallet = () => {
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
        setIsLoading(true)
        const walletData = (await getHoldingCoins()) as unknown as CoinData[];
        const cash = await getBalance();
        // HoldingCoin 객체 형식으로 변환
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

        // 티커 목록 추출
        const tickerList = coins.map((coin) => coin.ticker);
        setTickers(tickerList);
      } catch (error) {
        console.error('Error fetching holding coins:', error);
        setError('코인 정보를 불러오는데 실패했습니다.');
        setHoldingCoins([]);
        setTickers([]);
      } finally {
        setIsLoading(false)
      }
    };

    fetchHoldingCoins();
  }, []);

  // 웹소켓 데이터 처리 및 상태 관리
  useEffect(() => {
    // 웹소켓 데이터나 보유 코인이 없으면 실행하지 않음
    if (
      !tickerData ||
      !tickerData.tickerData ||
      Object.keys(tickerData.tickerData).length === 0 ||
      holdingCoins.length === 0
    ) {
      return;
    }

    // 보유 코인 정보 업데이트
    const updatedCoins = holdingCoins.map((coin) => {
      // 티커 데이터에서 해당 코인 정보 찾기
      const marketCode = `KRW-${coin.ticker}`;
      const tickerInfo = tickerData.tickerData[marketCode];

      if (tickerInfo) {
        const currentPrice = tickerInfo.trade_price || 0;
        const currentValue = coin.holdingQuantity * currentPrice;

        // 코인당 평균 매수가 계산
        const averageBuyPrice =
          coin.holdingQuantity > 0
            ? coin.holdingPrice / coin.holdingQuantity
            : 0;

        // 수익률 계산 수정
        let profitRate = 0;
        if (averageBuyPrice > 0) {
          // 현재가와 평균 매수가의 차이를 백분율로 계산
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

    // 이전 상태와 비교하여 변경된 경우에만 업데이트
    if (JSON.stringify(updatedCoins) !== JSON.stringify(holdingCoins)) {
      setHoldingCoins(updatedCoins);
    }
  }, [tickerData]);

  // 총 자산 가치 계산 (코인만)
  const totalCoinValue = holdingCoins.reduce(
    (sum, coin) => sum + Math.max(0, coin.value || 0), // 음수 값 방지
    0,
  );

  // 총 투자 금액 계산(코인의 총투자금액)(사용자가 갖고있는 코인들의 배열들에서 홀딩프라이스 전부 더하는 값)
  const initialInvestment = holdingCoins.reduce(
    (sum, coin) => sum + coin.holdingPrice,
    0,
  );

  // 현금 잔액
  const cashBalance = holdingCash;

  // 총 자산 (코인 + 현금)
  const totalAsset = cashBalance + totalCoinValue;

  // 총 수익률 계산
  const calculateTotalProfitRate = () => {
    if (initialInvestment <= 0) return 0; // 전체 매수 금액이 0인 경우 예외 처리
    return (
      ((totalAsset - (initialInvestment + cashBalance)) /
        (initialInvestment + cashBalance)) *
      100
    );
  };

  // 총 수익률 계산
  const totalProfitRate = calculateTotalProfitRate();

  // 차트 데이터 준비
  // 양수 값을 가진 코인만 필터링
  const positiveCoins = holdingCoins.filter(
    (coin) => coin.value && coin.value > 0,
  );

  // 상위 5개 코인 선택
  const topCoins = positiveCoins
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .slice(0, 4)
    .map((coin) => ({
      name: coin.ticker,
      value: coin.value,
      percent: totalAsset > 0 ? (coin.value! / totalAsset) * 100 : 0,
    })) as ChartItem[];

  // 나머지 코인들의 합
  const otherCoinsValue = positiveCoins
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .slice(5)
    .reduce((sum, coin) => sum + (coin.value || 0), 0);

  // 각 항목의 퍼센트 계산 (총합이 100%가 되도록)
  // const topCoinsPercent = topCoins.reduce((sum, coin) => sum + coin.percent, 0);
  const otherCoinsPercent =
    totalAsset > 0 ? (otherCoinsValue / totalAsset) * 100 : 0;
  const cashPercent = totalAsset > 0 ? (cashBalance / totalAsset) * 100 : 0;

  // 차트 아이템 생성 (기타와 현금 포함)
  const chartItems: ChartItem[] = [...topCoins];

  // 기타 코인이 있으면 추가
  if (otherCoinsValue > 0) {
    chartItems.push({
      name: '기타',
      value: otherCoinsValue,
      percent: otherCoinsPercent,
    });
  }

  // 현금이 있으면 추가
  if (cashBalance > 0) {
    chartItems.push({
      name: '현금',
      value: cashBalance,
      percent: cashPercent,
    });
  }

  // 차트 배경색 배열 생성
  const chartBackgroundColors: string[] = [
    ...positiveCoins
      .slice(0, 5)
      .map((coin) => coin.color || 'rgba(75, 192, 192, 0.8)'),
  ];

  // 기타 코인 색상 추가
  if (otherCoinsValue > 0) {
    chartBackgroundColors.push('rgba(150, 150, 150, 0.8)');
  }

  // 현금 색상 추가
  if (cashBalance > 0) {
    chartBackgroundColors.push('rgba(200, 200, 200, 0.8)');
  }
  
  // 차트 데이터
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

  // 차트 옵션
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

  // 매매 내역 페이지로 이동
  const goToTransaction = () => {
    navigate(ROUTES.TRANSACTION);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="지갑"
        rightElement={
          <button onClick={goToTransaction}>
            <FaHistory className="mr-1 text-xl text-gray-500 dark:text-white" />
          </button>
        }
      />

      {/* 잔액 정보 카드 */}
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
            <div>투자금</div>
            <div className="font-medium">
              {formatCurrency(initialInvestment, 'KRW')}
            </div>
          </div>
          <div className="text-left">
            <div>현금</div>
            <div className="font-medium">
              {formatCurrency(cashBalance, 'KRW')}
            </div>
          </div>
        </div>
      </div>

      {/* 포트폴리오 차트 섹션 */}
      <div className="flex flex-col mt-4 bg-white mx-4 rounded-xl p-4 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold mb-4">자산 분배</h2>
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

      {/* 보유 코인 목록 */}
      <div className="mx-4 mt-4 mb-6 bg-white rounded-xl dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-bold">보유 코인</h2>
        </div>

        {isLoading ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <p className="text-gray-500 dark:text-gray-400">로딩 중...</p>
          </div>
        ) : error ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        ) : holdingCoins.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
                  <div className="p-8 text-center bg-white rounded-xl dark:bg-gray-800">
            <div className="text-gray-500 mb-2 dark:text-gray-400">
            현재 보유 코인이 없습니다.
            </div>
            <button
              className="text-blue-500 font-medium dark:text-blue-400"
              onClick={() => navigate(ROUTES.DISCOVER)}
            >
              코인 탐색하기
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
