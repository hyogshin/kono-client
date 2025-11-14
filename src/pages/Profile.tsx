import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getUserProfile,
  updateProfileImage,
  updateNickname,
} from '../services/user';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { LOG, UI } from '../config/constants';

interface ProfileData {
  nickname: string;
  profileImageUrl: string;
  id?: number;
}

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dummyProfile: ProfileData = {
    nickname: t('profile.nickname'),
    profileImageUrl: 'https://static.upbit.com/logos/BTC.png',
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        if (user) {
          setProfile({
            nickname: user.nickname,
            profileImageUrl: user.profileImageUrl,
          });
          setNickname(user.nickname);
          setError(false);
          return;
        }

        const data = await getUserProfile();
        if (data) {
          setProfile(data);
          setError(false);
        } else {
          setProfile(dummyProfile);
          setNickname(dummyProfile.nickname);
          setError(true);
        }
      } catch (error) {
        console.error(LOG.ERR.USER.GET_PROFILE, error);

        setProfile(dummyProfile);
        setNickname(dummyProfile.nickname);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!file.type.startsWith('image/')) {
      toast.error(UI.ERR.USER.UPDATE_PROFILE_IMAGE_INVALID);
      return;
    }

    try {
      setImageUploading(true);
      await updateProfileImage(file);

      const updatedProfile = await getUserProfile();
      setProfile(updatedProfile);

      if (updatedProfile) {
        updateUser({
          profileImageUrl: updatedProfile.profileImageUrl,
        });
      }

      toast.success(UI.OK.USER.UPDATE_PROFILE_IMAGE);
    } catch (error) {
      toast.error(UI.ERR.USER.UPDATE_PROFILE_IMAGE);
      console.error(LOG.ERR.USER.UPDATE_PROFILE_IMAGE, error);
    } finally {
      setImageUploading(false);
    }
  };

  const handleNicknameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      toast.error(UI.ERR.USER.UPDATE_NICKNAME_REQUIRED);
      return;
    }
    try {
      await updateNickname(nickname);
      const updatedProfile = await getUserProfile();
      setProfile(updatedProfile);

      if (updatedProfile) {
        updateUser({
          nickname: updatedProfile.nickname,
        });
      }

      setIsEditingNickname(false);
      toast.success(UI.OK.USER.UPDATE_NICKNAME);
    } catch (error: any) {
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
      console.error(LOG.ERR.USER.UPDATE_NICKNAME, {
        status,
        message,
      });
    }
  };
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

  const displayProfile = profile || dummyProfile;

  return (
    <div className="p-4 max-w-md mx-auto h-full bg-white dark:bg-gray-950">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="text-center">{t('profile.errorLoading')}</p>
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center">
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
              alt={t('profile.profileImage')}
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

          {isEditingNickname ? (
            <form onSubmit={handleNicknameSubmit} className="mb-4">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="text-lg font-semibold mb-2 text-center block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder={t('profile.newNicknamePlaceholder')}
              />
              <div className="flex gap-2 justify-center">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  {t('common.save')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingNickname(false);
                    setNickname(displayProfile.nickname);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  {t('common.cancel')}
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
