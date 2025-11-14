import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getRanksAllMe,
  getRanksDaily,
  getRanksDailyMe,
} from '../services/ranking';
import { getRanksAll } from '../services/ranking';
import { format } from 'date-fns';
import { formatCurrency } from '../utils/formatter';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { LOG } from '../config/constants';

interface Rank {
  nickname: string;
  profileImageUrl: string;
  badgeImageUrl?: string;
  profit?: number;
  profitRate?: number;
  rank: number;
  updatedAt: string;
}

type RankingPeriod = 'daily' | 'all';

export default function Ranking() {
  const { t } = useTranslation();
  const [activePeriod, setActivePeriod] = useState<RankingPeriod>('daily');
  const [myUserSticky, setMyUserSticky] = useState<'bottom' | 'top' | null>(
    null,
  );
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [myRank, setMyRank] = useState<Rank | null>(null);
  const [ranksDaily, setRanksDaily] = useState<Rank[]>([]);
  const [myRankDaily, setMyRankDaily] = useState<Rank | null>(null);
  const [dailyUpdatedAt, setDailyUpdatedAt] = useState<string>('');
  const [allUpdatedAt, setAllUpdatedAt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const myUserRef = useRef<HTMLDivElement>(null);

  const REFRESH_INTERVAL = 5 * 60 * 1000;
  const PLACEHOLDER = 'https://static.upbit.com/logos/BTC.png';

  const formatPercentage = (value: number | undefined) => {
    if (value === undefined) return '0.00%';

    if (value === 0) return '0.00%';

    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const optimizeImageUrl = (url: string) => {
    if (!url || !url.includes('kakaocdn')) return url;
    return url.replace('R640x640', 'R160x160');
  };

  const fetchRanks = async () => {
    setIsLoading(true);
    try {
      const [dailyRanks, allRanks, myRankData, myRankDailyData] =
        await Promise.all([
          getRanksDaily(),
          getRanksAll(),
          getRanksAllMe(),
          getRanksDailyMe(),
        ]);

      setRanks(allRanks);
      setRanksDaily(dailyRanks);
      setMyRank(myRankData?.[0] || null);
      setMyRankDaily(myRankDailyData?.[0] || null);
      setDailyUpdatedAt(dailyRanks[0].updatedAt);
      setAllUpdatedAt(allRanks[0].updatedAt);
    } catch (error) {
      console.error(LOG.ERR.RANKINGS.GET_INFO, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRanks();
    const intervalId = setInterval(fetchRanks, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!myUserRef.current) return;

      const rect = myUserRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.bottom > windowHeight) {
        setMyUserSticky('top');
      } else if (rect.top < 0) {
        setMyUserSticky('bottom');
      } else {
        setMyUserSticky(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentRanks = activePeriod === 'daily' ? ranksDaily : ranks;
  const currentMyRank = activePeriod === 'daily' ? myRankDaily : myRank;

  const topUsers = currentRanks.slice(0, 3);
  const otherUsers = currentRanks.slice(3);

  if (isLoading && currentRanks.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      <div className="mx-4 mt-4 flex border-b sticky top-0 z-10 rounded-t-xl dark:bg-gray-800 dark:text-white dark:border-gray-700">
        {(['daily', 'all'] as RankingPeriod[]).map((period) => (
          <button
            key={period}
            className={`flex-1 py-3 text-center ${
              activePeriod === period
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActivePeriod(period)}
          >
            {period === 'daily' ? t('rankings.daily') : t('rankings.allTime')}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 py-6 rounded-b-xl mb-4 dark:bg-gray-800 dark:text-white mx-4 shadow-md">
        <div className="flex justify-around items-end">
          <div className="flex flex-col items-center">
            <div className="relative">
              <LazyLoadImage
                src={optimizeImageUrl(topUsers[1]?.profileImageUrl)}
                alt={topUsers[1]?.nickname}
                className="w-16 h-16 rounded-full border-2 border-gray-300 object-cover"
                onError={(e: any) => {
                  (e.target as HTMLImageElement).src = PLACEHOLDER;
                }}
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center text-lg font-bold">
                2
              </div>
            </div>
            <div className="mt-2 font-medium">{topUsers[1]?.nickname}</div>
            <div
              className={`text-xs ${
                activePeriod === 'daily'
                  ? (topUsers[1]?.profitRate ?? 0) === 0
                    ? 'text-gray-500'
                    : (topUsers[1]?.profitRate ?? 0) > 0
                      ? 'text-red-500'
                      : 'text-blue-500'
                  : (topUsers[1]?.profit ?? 0) === 0
                    ? 'text-gray-500'
                    : (topUsers[1]?.profit ?? 0) > 0
                      ? 'text-red-500'
                      : 'text-blue-500'
              }`}
            >
              {activePeriod === 'daily'
                ? formatPercentage(topUsers[1]?.profitRate)
                : `${(topUsers[1]?.profit ?? 0) > 0 ? '+' : (topUsers[1]?.profit ?? 0) < 0 ? '-' : ''}${formatCurrency(Math.abs(topUsers[1]?.profit ?? 0))}`}
            </div>
          </div>

          <div className="flex flex-col items-center -mt-4 ">
            <div className="relative">
              <LazyLoadImage
                src={optimizeImageUrl(topUsers[0].profileImageUrl)}
                alt={topUsers[0]?.nickname}
                className="w-20 h-20 rounded-full border-2 border-yellow-400 object-cover"
                onError={(e: any) => {
                  (e.target as HTMLImageElement).src = PLACEHOLDER;
                }}
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-lg font-bold">
                1
              </div>
            </div>
            <div className="mt-2 font-medium">{topUsers[0]?.nickname}</div>
            <div
              className={`text-xs ${
                activePeriod === 'daily'
                  ? (topUsers[0]?.profitRate ?? 0) === 0
                    ? 'text-gray-500'
                    : (topUsers[0]?.profitRate ?? 0) > 0
                      ? 'text-red-500'
                      : 'text-blue-500'
                  : (topUsers[0]?.profit ?? 0) === 0
                    ? 'text-gray-500'
                    : (topUsers[0]?.profit ?? 0) > 0
                      ? 'text-red-500'
                      : 'text-blue-500'
              }`}
            >
              {activePeriod === 'daily'
                ? formatPercentage(topUsers[0]?.profitRate)
                : `${(topUsers[0]?.profit ?? 0) > 0 ? '+' : (topUsers[0]?.profit ?? 0) < 0 ? '-' : ''}${formatCurrency(Math.abs(topUsers[0]?.profit ?? 0))}`}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative">
              <LazyLoadImage
                src={optimizeImageUrl(topUsers[2].profileImageUrl)}
                alt={topUsers[2]?.nickname}
                className="w-16 h-16 rounded-full border-2 border-orange-400 object-cover"
                onError={(e: any) => {
                  (e.target as HTMLImageElement).src = PLACEHOLDER;
                }}
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-lg font-bold">
                3
              </div>
            </div>
            <div className="mt-2 font-medium">{topUsers[2]?.nickname}</div>
            <div
              className={`text-xs ${
                activePeriod === 'daily'
                  ? (topUsers[2]?.profitRate ?? 0) === 0
                    ? 'text-gray-500'
                    : (topUsers[2]?.profitRate ?? 0) > 0
                      ? 'text-red-500'
                      : 'text-blue-500'
                  : (topUsers[2]?.profit ?? 0) === 0
                    ? 'text-gray-500'
                    : (topUsers[2]?.profit ?? 0) > 0
                      ? 'text-red-500'
                      : 'text-blue-500'
              }`}
            >
              {activePeriod === 'daily'
                ? formatPercentage(topUsers[2]?.profitRate)
                : `${(topUsers[2]?.profit ?? 0) > 0 ? '+' : (topUsers[2]?.profit ?? 0) < 0 ? '-' : ''}${formatCurrency(Math.abs(topUsers[2]?.profit ?? 0))}`}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 border-b rounded-t-xl dark:bg-gray-800 dark:text-white mx-4 dark:border-gray-600">
        <div className="text-gray-500 text-sm dark:text-gray-400 flex flex-col">
          <span>
            {activePeriod === 'daily'
              ? dailyUpdatedAt
                ? `${t('rankings.asOf')}: ${format(new Date(dailyUpdatedAt), 'yyyy-MM-dd HH:mm')}`
                : t('rankings.noUpdateInfo')
              : allUpdatedAt
                ? `${t('rankings.asOf')}: ${format(new Date(allUpdatedAt), 'yyyy-MM-dd HH:mm')}`
                : t('rankings.sinceRegistration')}
          </span>
          {/* <button
            onClick={fetchRanks}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            Refresh
          </button> */}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-b-xl dark:bg-gray-800 dark:text-white mx-4 mb-6 shadow-lg">
        {otherUsers.map((user) => (
          <div
            key={user.rank}
            ref={user === currentMyRank ? myUserRef : null}
            className="flex items-center p-4 border-b dark:border-gray-700 last:border-b-0"
          >
            <div className="w-8 text-center font-bold mr-4">{user.rank}</div>
            <LazyLoadImage
              src={optimizeImageUrl(user.profileImageUrl)}
              alt={user.nickname}
              className="w-12 h-12 rounded-full mr-4 object-cover"
              onError={(e: any) => {
                (e.target as HTMLImageElement).src = PLACEHOLDER;
              }}
            />
            <div className="flex-1">
              <div className="font-md">{user.nickname}</div>
            </div>
            <div
              className={`text-sm ${
                activePeriod === 'daily'
                  ? (user?.profitRate ?? 0) === 0
                    ? 'text-gray-500'
                    : (user?.profitRate ?? 0) > 0
                      ? 'text-red-500'
                      : 'text-blue-500'
                  : (user?.profit ?? 0) === 0
                    ? 'text-gray-500'
                    : (user?.profit ?? 0) > 0
                      ? 'text-red-500'
                      : 'text-blue-500'
              }`}
            >
              {activePeriod === 'daily'
                ? formatPercentage(user?.profitRate)
                : `${(user?.profit ?? 0) > 0 ? '+' : (user?.profit ?? 0) < 0 ? '-' : ''}${formatCurrency(Math.abs(user?.profit ?? 0))}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
