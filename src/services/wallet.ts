import api from './clients';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { LOG } from '../config/constants';

export const getQuantityByTicker = async (ticker: string) => {
  try {
    const res = await api.get(API_ENDPOINTS.GET_IS_HOLDING_COIN(ticker));
    return res.data.data.holdingQuantity;
  } catch (error) {
    console.error(LOG.ERR.WALLETS.GET_DATA, error);
    return 0;
  }
};

export const getHoldingCoins = async (): Promise<string[]> => {
  try {
    const response = await api.get(API_ENDPOINTS.GET_HOLDING_COIN);

    return response.data.data;
  } catch (error) {
    console.error(LOG.ERR.WALLETS.GET_HOLDING_COIN, error);
    return [];
  }
};

export const getTransactions = async (): Promise<any[]> => {
  try {
    const response = await api.get(API_ENDPOINTS.GET_TRANSACTION);
    return response.data.data;
  } catch (error) {
    console.error(LOG.ERR.WALLETS.GET_TRANSACTIONS, error);
    return [];
  }
};

export const getBalance = async (): Promise<number> => {
  try {
    const response = await api.get(API_ENDPOINTS.GET_CASH);

    return response.data.data.cash;
  } catch (error) {
    console.error(LOG.ERR.WALLETS.GET_BALANCE, error);
    return 0;
  }
};
