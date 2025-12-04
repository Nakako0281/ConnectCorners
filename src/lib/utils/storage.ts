import { SecureStorage } from '@/lib/secureStorage';

export const STORAGE_KEYS = {
    USER_NAME: 'connect_corners_user_name',
};

export const getUserName = (): string => {
    if (typeof window === 'undefined') return 'Player';
    return SecureStorage.getItem<string>(STORAGE_KEYS.USER_NAME) || '';
};

export const setUserName = (name: string): void => {
    if (typeof window === 'undefined') return;
    SecureStorage.setItem(STORAGE_KEYS.USER_NAME, name);
};
