export type Transaction = {
  transactionId: number | string;
  ticker: string;
  coinName: string;
  orderType: 'buy' | 'sell' | string;
  orderPrice: number;
  orderQuantity: number;
  orderAmount: number;
  createdAt: string;
};

export type FilterType = string;
export type DataFilterType = 'all' | 'buy' | 'sell';
