export interface Rank {
  userId?: number;
  nickname: string;
  profileImage?: string;
  profileImageUrl?: string;
  badgeImageUrl?: string;
  profitRate?: number;
  totalAssets?: number;
  valuation?: number;
  ranking?: number;
  rank?: number;
  updatedAt?: string;
}

export interface RankDaily {
  userId?: number;
  nickname: string;
  profileImage?: string;
  profileImageUrl?: string;
  badgeImageUrl?: string;
  profitRate?: number;
  profileRate?: number;
  valuation?: number;
  ranking?: number;
  rank?: number;
  updatedAt?: string;
}

export type RankingPeriod = 'daily' | 'all';
