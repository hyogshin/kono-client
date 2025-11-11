import api from './clients';
import { API_ENDPOINTS } from '../config/apiEndpoints';

interface Rank {
  nickname: string;
  profileImageUrl: string;
  badgeImageUrl?: string;
  totalAssets: number;
  rank: number;
  updatedAt: string;
}

interface RankDaily {
  nickname: string;
  profileImageUrl: string;
  badgeImageUrl?: string;
  profileRate: number;
  rank: number;
  updatedAt: string;
}

//일간 랭킹 조회
export const getRanksDaily = async (): Promise<RankDaily[]> => {
  try {
    const res = await api.get(API_ENDPOINTS.GET_RANK_DAILY);
    return res.data.data;
  } catch (error) {
    console.error('Failed to get daily ranks:', error);
    return [];
  }
};

//일간 랭킹 사용자 조회
export const getRanksDailyMe = async (): Promise<RankDaily[]> => {
  try {
    const res = await api.get(API_ENDPOINTS.GET_RANK_DAILY_ME);
    return res.data.data;
  } catch (error) {
    console.error('Failed to get user daily rank:', error);
    return [];
  }
};

//전체 랭킹 조회
export const getRanksAll = async (): Promise<Rank[]> => {
  try {
    const res = await api.get(API_ENDPOINTS.GET_RANK_ALL);
    return res.data.data;
  } catch (error) {
    console.error('Failed to get ranks:', error);
    return [];
  }
};

// 전체 랭킹 사용자 조회
export const getRanksAllMe = async (): Promise<Rank[]> => {
  try {
    const res = await api.get(API_ENDPOINTS.GET_RANK_ALL_ME);
    return res.data.data;
  } catch (error) {
    console.error('Failed to get user ranks:', error);
    return [];
  }
};
