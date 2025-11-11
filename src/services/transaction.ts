import api from './clients';
import { API_ENDPOINTS } from '../config/apiEndpoints';

export type Transaction = {
  transactionId: string;
  orderType: string;
  coinName: string;
  ticker: string;
  orderQuantity: number;
  orderPrice: number;
  orderAmount: number;
  createdAt: string;
};

/**
 * 특정 사용자의 거래 내역을 조회하는 함수
 * @returns 사용자의 거래 내역 배열
 */
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const res = await api.get(API_ENDPOINTS.GET_TRANSACTION);
    return res.data.data;
  } catch (error) {
    console.error(`거래 내역 조회 오류:`, error);
    return [];
  }
};

/**
 * 특정 유형의 거래 내역을 조회하는 함수 (예: 매수, 매도)
 * @param type 거래 유형 ('buy' 또는 'sell')
 * @returns 해당 유형의 거래 내역 배열
 */
export const getTransactionsByType = async (
  type: 'buy' | 'sell',
): Promise<Transaction[]> => {
  try {
    const transactions = await getTransactions();
    return transactions.filter((transaction) => transaction.orderType === type);
  } catch (error) {
    console.error(`${type} 유형 거래 내역 조회 오류:`, error);
    return [];
  }
};
