import React, { useState, useEffect, useRef } from 'react';
import {
  getUserProfile,
  updateProfileImage,
  updateNickname,
} from '../services/user';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

interface ProfileData {
  nickname: string;
  profileImageUrl: string;
  id?: number;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dummyProfile: ProfileData = {
    nickname: '닉네임',
    profileImageUrl: 'https://static.upbit.com/logos/BTC.png',
  };

  // 프로필 정보 로드
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        // 1. AuthContext의 사용자 정보가 있으면 사용
        if (user) {
          setProfile({
            nickname: user.nickname,
            profileImageUrl: user.profileImageUrl,
          });
          setNickname(user.nickname);
          setError(false);
          return;
        }

        // 2. AuthContext에 사용자 정보가 없으면 API 호출
        const data = await getUserProfile();
        if (data) {
          setProfile(data);
          setError(false);
        } else {
          // 데이터가 없는 경우 더미 데이터 사용
          setProfile(dummyProfile);
          setNickname(dummyProfile.nickname);
          setError(true);
        }
      } catch (err) {
        console.error('프로필 로드 중 오류 발생:', err);
        // 오류 발생 시 더미 데이터 사용
        setProfile(dummyProfile);
        setNickname(dummyProfile.nickname);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // 프로필 이미지 변경 핸들러
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // 이미지 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }

    try {
      setImageUploading(true);
      await updateProfileImage(file);

      // 프로필 정보 다시 로드
      const updatedProfile = await getUserProfile();
      setProfile(updatedProfile);

      // AuthContext의 사용자 정보도 업데이트
      if (updatedProfile) {
        updateUser({
          profileImageUrl: updatedProfile.profileImageUrl,
        });
      }

      toast.success('프로필 이미지가 업데이트되었습니다.');
    } catch (err) {
      toast.error('이미지 업로드에 실패했습니다.');
      console.error(err);
    } finally {
      setImageUploading(false);
    }
  };

  // 닉네임 변경 핸들러
  const handleNicknameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      toast.error('닉네임을 입력해주세요.');
      return;
    }
    try {
      await updateNickname(nickname);
      const updatedProfile = await getUserProfile();
      setProfile(updatedProfile);
      // AuthContext 사용자 정보 업데이트
      if (updatedProfile) {
        updateUser({
          nickname: updatedProfile.nickname,
        });
      }


      setIsEditingNickname(false);
      toast.success('닉네임이 업데이트되었습니다.');
    }

    catch (error: any) {

      const { status, message } = error;

      switch (status) {
        case 400:
          toast.error(`${message}`);
          break;
        case 401:
          toast.error(`${message}`);
          break;
        case 409:
          toast.error(`${message}`);
          break;
        case 500:
          toast.error(`${message}`);
          break;
        default:
          toast.error(`[${status}] ${message}`);
      }
      console.error('닉네임 변경 실패:', { status, message });
    }
  };

  // 파일 선택 다이얼로그 열기
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-180px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  // profile이 null인 경우 처리
  const displayProfile = profile || dummyProfile;

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* 오류 메시지 표시 영역 */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="text-center">
            {
              '프로필 정보를 불러오는 중 문제가 발생했습니다. 임시 프로필이 표시됩니다.'
            }
          </p>
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center">
          {/* 프로필 이미지 영역 */}
          <div className="relative inline-block mb-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            <img
              src={displayProfile.profileImageUrl}
              alt="프로필 이미지"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700 cursor-pointer"
              onClick={handleImageClick}
            />
            {imageUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
              </div>
            )}
            <div
              className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer"
              onClick={handleImageClick}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
              </svg>
            </div>
          </div>

          {/* 닉네임 영역 */}
          {isEditingNickname ? (
            <form onSubmit={handleNicknameSubmit} className="mb-4">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="text-lg font-semibold mb-2 text-center block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="새 닉네임 입력"
              />
              <div className="flex gap-2 justify-center">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  저장
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingNickname(false);
                    setNickname(displayProfile.nickname);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {displayProfile.nickname}
              </h2>
              <button
                onClick={() => setIsEditingNickname(true)}
                className="text-blue-500 hover:text-blue-700"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  ></path>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
