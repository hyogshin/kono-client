import api from './clients';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { LOG } from '../config/constants';
import type { Transaction } from '../types';

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const res = await api.get(API_ENDPOINTS.GET_TRANSACTION);
    return res.data.data;
  } catch (error) {
    console.error(LOG.ERR.TRANSACTIONS.GET_HISTORY, error);
    return [];
  }
};

export const getTransactionsByType = async (
  type: 'buy' | 'sell',
): Promise<Transaction[]> => {
  try {
    const transactions = await getTransactions();
    return transactions.filter((transaction) => transaction.orderType === type);
  } catch (error) {
    console.error(LOG.ERR.TRANSACTIONS.GET_HISTORY_BY_TYPE, error);
    return [];
  }
};
