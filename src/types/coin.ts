export interface Coin {
  key: string;
  name: string;
  ticker: string;
  accPrice: number;
  price: number;
  priceChange24h: number;
  rateChange24h: number;
}

export interface CoinData {
  ticker: string;
  coinName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  priceChange24h: number;
  rateChange24h: number;
}

export interface CoinInfo {
  ticker: string;
  coinName: string;
  high: number;
  low: number;
  accTradePrice24h: number;
  accTradeVolume24h: number;
}

export type SortType = 'volume' | 'price' | 'change';
