export interface User {
  id?: number;
  userId?: number;
  email?: string;
  nickname: string;
  profileImage?: string;
  profileImageUrl?: string;
  kakaoId?: number;
  cashBalance?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileData {
  nickname: string;
  profileImage?: string;
  profileImageUrl?: string;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  data: {
    nickname: string;
    profileImage?: string;
    profileImageUrl?: string;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  status?: number;
}
