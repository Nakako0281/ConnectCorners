import { secureGetItem, secureSetItem } from '../secureStorage';

export const STORAGE_KEYS = {
    USER_NAME: 'connect_corners_user_name',
};

export const getUserName = (): string => {
    if (typeof window === 'undefined') return 'Player';
    const stored = secureGetItem<string>(STORAGE_KEYS.USER_NAME);
    return stored || '';
};

export const setUserName = (name: string): void => {
    if (typeof window === 'undefined') return;
    secureSetItem(STORAGE_KEYS.USER_NAME, name);
};
