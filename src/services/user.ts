import axios from 'axios';
import api from './clients';
import { API_ENDPOINTS } from '../config/apiEndpoints';

interface ProfileData {
  nickname: string;
  profileImageUrl: string;
}

interface ProfileUpdateResponse {
  message: string;
  data: {
    nickname: string;
    profileImageUrl: string;
    createdAt: string;
  };
}

interface ErrorResponse {
  status: number;
  message: string;
}

// 사용자 프로필 정보 가져오기
export const getUserProfile = async (): Promise<ProfileData> => {
  try {
    // API 서버에서 인증된 사용자 정보 가져오기
    const response = await api.get(API_ENDPOINTS.GET_USER);

    // API 응답 형식에 맞게 데이터 변환
    return response.data;
    // nickname: response.data.nickname || '사용자',
    // profileImage: response.data.profileImage || 'https://via.placeholder.com/150',
    // id: response.data.id,
    // cashBalance: response.data.cashBalance
  } catch (error) {
    console.error('사용자 프로필 정보를 가져오는 중 오류 발생:', error);
    // 오류 발생 시 기본 더미 데이터 반환
    return {
      nickname: '사용자',
      profileImageUrl: 'https://via.placeholder.com/150',
    };
  }
};

// 프로필 이미지 업데이트
export const updateProfileImage = async (
  imageFile: File,
): Promise<ProfileData> => {
  try {
    // 1. Presigned URL 요청 - body로 전송
    const presignedUrlResponse = await api.post('/api/v1/s3/presigned-url', {
      fileName: imageFile.name,
      contentType: imageFile.type,
    });

    const { presignedUrl, uploadedFileUrl } = presignedUrlResponse.data;

    // 2. Presigned URL을 사용하여 S3에 직접 업로드
    await api.put(presignedUrl, imageFile, {
      headers: {
        'Content-Type': imageFile.type,
      },
    });

    // 3. 업로드된 이미지 URL로 프로필 업데이트
    const updateResponse = await api.put<ProfileUpdateResponse>(
      '/api/v1/users/profile-image',
      {
        imageUrl: uploadedFileUrl,
      },
    );

    // 4. 업데이트된 프로필 정보 반환
    return {
      nickname: updateResponse.data.data.nickname,
      profileImageUrl: updateResponse.data.data.profileImageUrl,
    };
  } catch (error) {
    console.error('프로필 이미지 업데이트 중 오류 발생:', error);
    throw error;
  }
};

// 닉네임 업데이트
export const updateNickname = async (
  nickname: string,
): Promise<ProfileData> => {
  try {
    await api.put(
      '/api/v1/users/nickname',
      { nickname },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      },
    );
    return getUserProfile(); // 업데이트 후 최신 프로필 정보 반환
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // HTTP 상태 코드와 메시지를 함께 throw
      throw {
        status: error.response.status,
        message: error.response.data.message,
      } as ErrorResponse;
    }
    throw {
      status: 500,
      message: '닉네임 변경에 실패했습니다.',
    };
  }
};

// 잔액 조회
export const getBalance = async (): Promise<number> => {
  try {
    const response = await api.get('/api/v1/users/balance', {
      withCredentials: true,
    });

    return response.data.balance;
  } catch (error) {
    console.error('잔액 조회 중 오류 발생:', error);
    return 0;
  }
};

// 회원 탈퇴
export const withdrawUser = async (): Promise<void> => {
  try {
    await api.delete('/api/v1/users/withdraw');
  } catch (error) {
    console.error('회원탈퇴 처리 중 오류 발생:', error);
    throw error;
  }
};
