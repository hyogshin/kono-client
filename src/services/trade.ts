import api from './clients';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { LOG } from '../config/constants';
import type { OrderType, OrderRequest, OrderResponse } from '../types';

export const marketBuy = async (
  ticker: string,
  amount: number,
): Promise<OrderResponse | null> => {
  try {
    const orderData: OrderRequest = {
      ticker,
      orderType: 'buy',
      orderAmount: amount,
    };

    const response = await api.post(API_ENDPOINTS.POST_ORDER, orderData);

    if (response.status === 200 || response.status === 201) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error(LOG.ERR.TRANSACTIONS.MARKET_BUY, error);
    return null;
  }
};

export const marketSell = async (
  ticker: string,
  amount: number,
  orderQuantity?: number,
): Promise<OrderResponse | null> => {
  try {
    const orderData: OrderRequest = {
      ticker,
      orderType: 'sell',
      orderAmount: amount || undefined,
      orderQuantity: orderQuantity || undefined,
    };

    const response = await api.post(API_ENDPOINTS.POST_ORDER, orderData);

    if (response.status === 200 || response.status === 201) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error(LOG.ERR.TRANSACTIONS.MARKET_SELL, error);
    return null;
  }
};
