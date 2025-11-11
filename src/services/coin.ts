import api from './clients';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// 주문 타입
export type OrderType = 'buy' | 'sell';
/**
 * 코인 티커로 코인 이름 조회 함수
 * @param ticker 코인 티커 (예: BTC, ETH)
 * @returns 코인 이름 또는 null
 */

export const getCoinName = async (ticker: string): Promise<string | null> => {
  try {
    // 개별 코인 정보 요청
    const response = await api.get(API_ENDPOINTS.GET_COIN_DETAIL(ticker));

    // 단일 코인 상세 정보를 반환하는 경우
    if (response.data) {
      return response.data.kr_coin_name;
    }

    console.error('코인 데이터 형식이 예상과 다릅니다:', response.data);
    return null;
  } catch (err) {
    console.error(`코인 이름 조회 오류 (${ticker}):`, err);
    return null;
  }
};

export const getCoins = async (): Promise<[]> => {
  try {
    const response = await api.get(API_ENDPOINTS.GET_COINS);
    return response.data.data || [];
  } catch (err) {
    console.error(`코인 목록 조회 오류:`, err);
    return [];
  }
};
