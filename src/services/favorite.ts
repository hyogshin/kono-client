import api from './clients';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// interface FavoriteCoin {
//   id: number;
//   ticker: string;
//   nickname: string;
// }

// 좋아요 목록 가져오기
export const getFavoriteList = async (): Promise<[]> => {
  try {
    const res = await api.get(API_ENDPOINTS.GET_FAVORITE);
    return res.data.data;
  } catch (error) {
    console.error('Failed to initialize favorites:', error);
    return [];
  }
};

// 코인이 관심 목록에 있는지 확인
export const isFavoriteCoin = async (ticker: string): Promise<boolean> => {
  try {
    const res = await api.get(API_ENDPOINTS.GET_IS_FAVORITE(ticker));
    return res.data.data;
  } catch (error) {
    console.error('Failed to fetch favorite status:', error);
    return false; // 실패 시 기본값 반환 (선택)
  }
};

// 좋아요 추가
export const addFavorite = async (ticker: string) => {
  try {
    await api.post(API_ENDPOINTS.POST_FAVORITE(ticker));
    return true;
  } catch (error) {
    console.error(`관심 코인 추가 오류 (${ticker}):`, error);
    return false;
  }
};

// 좋아요 삭제
export const removeFavorite = async (ticker: string) => {
  try {
    await api.delete(API_ENDPOINTS.DELETE_FAVORITE(ticker));
    return true;
  } catch (error) {
    console.error(`관심 코인 삭제 오류 (${ticker}):`, error);
    return false;
  }
};
