import { memo } from 'react';
import { formatCurrency, formatPriceChange } from '../../utils/formatter';
import { useTranslation } from 'react-i18next';
import type { TickerDataItem, TickerDataMap } from '../../types';

interface PriceInfoProps {
  symbol: string;
  tickerData: TickerDataMap | null;
  name?: string;
}

const PriceInfo = memo(({ symbol, tickerData, name }: PriceInfoProps) => {
  const { t } = useTranslation();

  if (!tickerData || !tickerData[`KRW-${symbol}`]) {
    return (
      <div className="p-4 flex items-center justify-center h-24 ">
        <div className="text-center text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </div>
      </div>
    );
  }

  const data = tickerData[`KRW-${symbol}`];

  const rateChange = data.signed_change_rate * 100;

  const rateChangeClass =
    data.change === 'RISE'
      ? 'text-red-500 dark:text-red-400'
      : data.change === 'FALL'
        ? 'text-blue-500 dark:text-blue-400'
        : 'text-gray-500 dark:text-gray-400';

  return (
    <div className="p-4 dark:bg-gray-800 dark:text-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <img
            src={`https://static.upbit.com/logos/${symbol}.png`}
            alt={symbol}
            className="w-10 h-10 rounded-full mr-3"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://via.placeholder.com/40';
            }}
          />
          <div>
            <div className="font-bold">{name || symbol}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {`KRW-${symbol}`}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-baseline">
          <div className={`text-2xl font-bold ${rateChangeClass}`}>
            {formatCurrency(data.trade_price)}
          </div>
          <div className={`ml-2 ${rateChangeClass}`}>
            {formatPriceChange(rateChange)}
          </div>
        </div>

        <div className="flex justify-between mt-2 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              {t('discover.high')}
            </span>
            <span className="ml-1 text-red-500 dark:text-red-400">
              {formatCurrency(data.high_price, '', false)}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              {t('discover.low')}
            </span>
            <span className="ml-1 text-blue-500 dark:text-blue-400">
              {formatCurrency(data.low_price, '', false)}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              {t('discover.volume')}
            </span>
            <span className="ml-1">
              {data.acc_trade_volume_24h.toFixed(2)} {symbol}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PriceInfo;
