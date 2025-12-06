import { SecureStorage } from './secureStorage';

export const STORAGE_KEYS = {
    USER_NAME: 'connect_corners_user_name',
};

export const getUserName = (): string => {
    return SecureStorage.getItem(STORAGE_KEYS.USER_NAME, 'Player');
};

export const setUserName = (name: string): void => {
    SecureStorage.setItem(STORAGE_KEYS.USER_NAME, name);
};
