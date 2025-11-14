import api from './clients';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { LOG } from '../config/constants';
import type { Rank, RankDaily } from '../types';

export const getRanksDaily = async (): Promise<RankDaily[]> => {
  try {
    const res = await api.get(API_ENDPOINTS.GET_RANK_DAILY);
    return res.data.data;
  } catch (error) {
    console.error(LOG.ERR.RANKINGS.GET_DAILY, error);
    return [];
  }
};

export const getRanksDailyMe = async (): Promise<RankDaily[]> => {
  try {
    const res = await api.get(API_ENDPOINTS.GET_RANK_DAILY_ME);
    return res.data.data;
  } catch (error) {
    console.error(LOG.ERR.RANKINGS.GET_USER_DAILY, error);
    return [];
  }
};

export const getRanksAll = async (): Promise<Rank[]> => {
  try {
    const res = await api.get(API_ENDPOINTS.GET_RANK_ALL);
    return res.data.data;
  } catch (error) {
    console.error(LOG.ERR.RANKINGS.GET_ALL, error);
    return [];
  }
};

export const getRanksAllMe = async (): Promise<Rank[]> => {
  try {
    const res = await api.get(API_ENDPOINTS.GET_RANK_ALL_ME);
    return res.data.data;
  } catch (error) {
    console.error(LOG.ERR.RANKINGS.GET_USER_ALL, error);
    return [];
  }
};
