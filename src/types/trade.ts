export type OrderType = 'buy' | 'sell';
export type TradeType = 'buy' | 'sell';

export interface OrderRequest {
  ticker: string;
  orderType: OrderType;
  orderAmount?: number;
  orderQuantity?: number;
}

export interface OrderResponse {
  id: string;
  ticker: string;
  type: OrderType;
  price: number;
  quantity: number;
  total: number;
  fee?: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}
