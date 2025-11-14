import React, { useState, useEffect, useRef, memo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

interface TradingViewWidgetProps {
  symbol: string;
  interval?: string;
  range?: string;
  locale?: string;
  hideLegend?: boolean;
  hideTopToolbar?: boolean;
  allowSymbolChange?: boolean;
  saveImage?: boolean;
}

const INTERVALS = [
  { label: '1m', value: '1' },
  { label: '5m', value: '5' },
  { label: '15m', value: '15' },
  { label: '30m', value: '30' },
  { label: '1h', value: '60' },
  { label: '4h', value: '240' },
];

const TIME_RANGES = [
  { label: 'D', value: 'D' },
  { label: 'W', value: 'W' },
  { label: 'M', value: 'M' },
  { label: 'Y', value: 'Y' },
];

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol,
  interval: initialInterval = '1',
  range: initialRange = 'D',
  locale = 'kr',
  hideLegend = true,
  hideTopToolbar = true,
  allowSymbolChange = false,
  saveImage = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { darkMode } = useTheme();
  const [currentInterval, setCurrentInterval] = useState(initialInterval);
  const [currentRange, setCurrentRange] = useState(initialRange);
  const [loading, setLoading] = useState(true);

  const handleIntervalChange = (newInterval: string) => {
    setCurrentInterval(newInterval);
  };

  const handleRangeChange = (newRange: string) => {
    setCurrentRange(newRange);
  };

  const getSymbolInfo = () => {
    const parts = symbol.split(':');
    const ticker = parts.length > 1 ? parts[1].replace('KRW', '') : symbol;
    return ticker;
  };

  const getTradingViewTimeframe = () => {
    if (currentRange === 'D') {
      return currentInterval;
    } else if (currentRange === 'W') {
      return '1W';
    } else if (currentRange === 'M') {
      return '1M';
    } else if (currentRange === 'Y') {
      return '12M';
    }
    return currentInterval;
  };

  useEffect(() => {
    setLoading(true);
    if (containerRef.current) {
      containerRef.current.innerHTML = '';

      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .tradingview-widget-copyright {
          display: none !important;
        }
        iframe {
          border-width: 0 !important;
        }
      `;
      document.head.appendChild(styleElement);

      const script = document.createElement('script');
      script.src =
        'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: symbol,
        interval: getTradingViewTimeframe(),
        timezone: 'Asia/Seoul',
        theme: darkMode ? 'dark' : 'light',
        style: '1',
        locale: locale,
        hide_top_toolbar: hideTopToolbar,
        hide_legend: hideLegend,
        allow_symbol_change: allowSymbolChange,
        save_image: saveImage,
        hide_volume: true,
        hide_side_toolbar: true,
        hide_drawing_toolbar: true,
        toolbar_bg: 'transparent',
        toolbar: false,
        support_host: 'https://www.tradingview.com',
        disabled_features: [
          'control_bar',
          'widget_logo',
          'timeframes_toolbar',
          'volume_force_overlay',
          'show_chart_property_page',
          'left_toolbar',
          'context_menus',
        ],
      });

      script.onload = () => {
        setLoading(false);
      };

      containerRef.current.appendChild(script);

      return () => {
        if (styleElement && styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      };
    }
  }, [
    symbol,
    currentInterval,
    currentRange,
    darkMode,
    locale,
    hideLegend,
    hideTopToolbar,
    allowSymbolChange,
    saveImage,
  ]);

  return (
    <div className="flex flex-col w-full h-full rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        {/* Symbol info */}
        <div className="font-medium text-gray-800 dark:text-white mr-2">
          {getSymbolInfo()}
        </div>

        {/* Time range selection tabs */}
        <div className="flex">
          {TIME_RANGES.map((range) => (
            <button
              key={range.value}
              className={`px-3 py-1 ${
                currentRange === range.value
                  ? 'text-blue-500 border-b-2 border-blue-500 font-medium dark:text-blue-400 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => handleRangeChange(range.value)}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Interval selector (dropdown) */}
        <Disclosure as="div" className="relative">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex items-center justify-between px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50">
                <span>
                  {INTERVALS.find((i) => i.value === currentInterval)?.label ||
                    currentInterval}
                </span>
                {open ? (
                  <ChevronUpIcon className="w-4 h-4 ml-2" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4 ml-2" />
                )}
              </Disclosure.Button>

              <Transition
                show={open}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="py-1">
                    {INTERVALS.map((int) => (
                      <button
                        key={int.value}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          currentInterval === int.value
                            ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => {
                          handleIntervalChange(int.value);
                        }}
                      >
                        {int.label}
                      </button>
                    ))}
                  </div>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </div>

      {/* Chart container */}
      <div className="relative flex-1" style={{ minHeight: '300px' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        <div
          className="tradingview-widget-container w-full h-full"
          ref={containerRef}
        >
          <div
            className="tradingview-widget-container__widget"
            style={{ height: '100%', width: '100%' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default memo(TradingViewWidget);
