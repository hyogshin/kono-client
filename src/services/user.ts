import axios from 'axios';
import api from './clients';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { LOG } from '../config/constants';
import type {
  ProfileData,
  ProfileUpdateResponse,
  ErrorResponse,
} from '../types';

export const getUserProfile = async (): Promise<ProfileData> => {
  try {
    const response = await api.get(API_ENDPOINTS.GET_USER);

    return response.data;
  } catch (error) {
    console.error(LOG.ERR.USER.GET_PROFILE, error);
    return {
      nickname: 'User',
      profileImageUrl: 'https://via.placeholder.com/150',
    };
  }
};

export const updateProfileImage = async (
  imageFile: File,
): Promise<ProfileData> => {
  try {
    const presignedUrlResponse = await api.post(
      API_ENDPOINTS.POST_PROFILE_IMAGE,
      {
        fileName: imageFile.name,
        contentType: imageFile.type,
      },
    );

    const { presignedUrl, uploadedFileUrl } = presignedUrlResponse.data;

    await api.put(presignedUrl, imageFile, {
      headers: {
        'Content-Type': imageFile.type,
      },
    });

    const updateResponse = await api.put<ProfileUpdateResponse>(
      API_ENDPOINTS.PUT_NICKNAME,
      {
        imageUrl: uploadedFileUrl,
      },
    );

    return {
      nickname: updateResponse.data.data.nickname,
      profileImageUrl: updateResponse.data.data.profileImageUrl,
    };
  } catch (error) {
    console.error(LOG.ERR.USER.UPDATE_PROFILE_IMAGE, error);
    throw error;
  }
};

export const updateNickname = async (
  nickname: string,
): Promise<ProfileData> => {
  try {
    await api.put(
      API_ENDPOINTS.PUT_NICKNAME,
      { nickname },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      },
    );
    return getUserProfile();
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw {
        status: error.response.status,
        message: error.response.data.message,
      } as ErrorResponse;
    }
    throw {
      status: 500,
      message: LOG.ERR.USER.UPDATE_NICKNAME,
    };
  }
};

export const getBalance = async (): Promise<number> => {
  try {
    const response = await api.get(API_ENDPOINTS.GET_BALANCE, {
      withCredentials: true,
    });

    return response.data.balance;
  } catch (error) {
    console.error(LOG.ERR.WALLETS.GET_BALANCE, error);
    return 0;
  }
};

export const withdrawUser = async (): Promise<void> => {
  try {
    await api.delete(API_ENDPOINTS.WITHDRAW);
  } catch (error) {
    console.error(LOG.ERR.USER.WITHDRAW, error);
    throw error;
  }
};
