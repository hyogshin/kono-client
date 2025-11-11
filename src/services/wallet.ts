import api from './clients';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// interface Wallet {
//   nickname: string;
//   ticker: string;
//   holdingQuantity: number;
//   // 필요한 경우 다른 속성들 추가
// }

/**
 * 특정 사용자의 특정 코인 보유량을 조회하는 함수
 * @param ticker 코인 티커 (예: BTC, ETH)
 * @returns 해당 코인의 보유량, 없으면 0 반환
 */
export const getQuantityByTicker = async (ticker: string) => {
  try {
    const res = await api.get(API_ENDPOINTS.GET_IS_HOLDING_COIN(ticker));
    return res.data.data.holdingQuantity;
  } catch (err) {
    console.error(`Error fetching wallet data for ${ticker}:`, err);
    return 0;
  }
};

/**
 * 사용자가 보유한 모든 코인의 티커 목록을 조회하는 함수
 * @returns 보유 중인 코인 티커 + 이름 배열
 */
export const getHoldingCoins = async (): Promise<string[]> => {
  try {
    const response = await api.get(API_ENDPOINTS.GET_HOLDING_COIN);

    return response.data.data;
  } catch (err) {
    console.error(`Error fetching holding coins ticker and name:`, err);
    return [];
  }
};

/**
 * 사용자의 거래 내역을 조회하는 함수
 * @returns 거래 내역 배열
 */
export const getTransactions = async (): Promise<any[]> => {
  try {
    const response = await api.get(API_ENDPOINTS.GET_TRANSACTION);
    return response.data.data;
  } catch (err) {
    console.error(`Error fetching transactions:`, err);
    return [];
  }
};
// 잔액 조회
export const getBalance = async (): Promise<number> => {
  try {
    const response = await api.get(API_ENDPOINTS.GET_CASH);

    return response.data.data.cash;
  } catch (error) {
    console.error('잔액 조회 중 오류 발생:', error);
    return 0;
  }
};
