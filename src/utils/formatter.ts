import { parseISO, format } from 'date-fns';
import { LOG } from '../config/constants';

export const formatCurrency = (
  value: number,
  currency: string = 'KRW',
  showCurrency: boolean = true,
  showSign: boolean = false,
  showDecimal: boolean = false,
): string => {
  const sign = showSign && value > 0 ? '+' : '';
  const absValue = Math.abs(value);

  let formattedValue: string;

  if (!showDecimal) {
    formattedValue = Math.floor(absValue).toLocaleString('ko-KR');
  } else if (Number.isInteger(absValue)) {
    formattedValue = absValue.toLocaleString('ko-KR');
  } else {
    const parts = absValue.toString().split('.');
    const integerPart = parseInt(parts[0]).toLocaleString('ko-KR');

    let decimalPart = parts[1] || '';
    if (decimalPart.length > 6) {
      decimalPart = decimalPart.substring(0, 6);
    }

    while (decimalPart.endsWith('0')) {
      decimalPart = decimalPart.slice(0, -1);
    }

    formattedValue =
      decimalPart.length > 0 ? `${integerPart}.${decimalPart}` : integerPart;
  }

  if (sign && showCurrency) {
    return `${sign}${formattedValue}`;
  } else if (sign) {
    return `${sign}${formattedValue}`;
  } else if (showCurrency) {
    return `${formattedValue} ${currency}`;
  } else {
    return formattedValue;
  }
};

export const formatVolume = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
};

export const formatDate = (date: string | Date) => {
  try {
    if (date === null || date === undefined || date === '') {
      return '-';
    }

    let dateObj: Date;

    if (typeof date === 'string') {
      dateObj = parseISO(date);

      if (isNaN(dateObj.getTime())) {
        if (date.includes('T') && !date.includes('Z') && !date.includes('+')) {
          dateObj = new Date(date);
        } else {
          dateObj = new Date(date);
        }
      }
    } else {
      dateObj = date;
    }

    if (isNaN(dateObj.getTime())) {
      console.error(LOG.ERR.GENERAL.INVALID_DATE, date);
      return LOG.ERR.GENERAL.INVALID_DATE;
    }

    return format(dateObj, 'yyyy.MM.dd HH:mm');
  } catch (error) {
    console.error(LOG.ERR.GENERAL.FORMAT_DATE, error);
    return LOG.ERR.GENERAL.FORMAT_DATE;
  }
};

export const formatPriceChange = (change: number): string => {
  const sign = change > 0 ? '+' : '';

  if (Number.isInteger(change)) {
    return `${sign}${change}%`;
  }

  const fixed = change.toFixed(2);
  const parts = fixed.split('.');
  let decimalPart = parts[1];

  while (decimalPart.endsWith('0')) {
    decimalPart = decimalPart.slice(0, -1);
  }

  return decimalPart.length > 0
    ? `${sign}${parts[0]}.${decimalPart}%`
    : `${sign}${parts[0]}%`;
};

export const formatDecimal = (
  value: number,
  decimals: number = 2,
  removeTrailingZeros: boolean = false,
): string => {
  const fixed = value.toFixed(decimals);

  if (removeTrailingZeros) {
    if (fixed.includes('.')) {
      const parts = fixed.split('.');
      let decimalPart = parts[1];

      while (decimalPart.endsWith('0')) {
        decimalPart = decimalPart.slice(0, -1);
      }

      return decimalPart.length > 0 ? `${parts[0]}.${decimalPart}` : parts[0];
    }
  }

  return fixed;
};

export const formatAmount = (
  value: number,
  showUnit: boolean = true,
): string => {
  if (value >= 1_000_000_000_000) {
    return `${Math.floor(value / 1_000_000_000_000)}${showUnit ? 'T' : ''}`;
  } else if (value >= 100_000_000) {
    return `${Math.floor(value / 100_000_000)}${showUnit ? 'B' : ''}`;
  } else if (value >= 10_000) {
    return `${Math.floor(value / 10_000)}${showUnit ? 'K' : ''}`;
  }
  return value.toLocaleString('ko-KR');
};

export const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};
