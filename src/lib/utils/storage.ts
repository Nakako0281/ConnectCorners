export const STORAGE_KEYS = {
    USER_NAME: 'connect_corners_user_name',
};

export const getUserName = (): string => {
    if (typeof window === 'undefined') return 'Player';
    return localStorage.getItem(STORAGE_KEYS.USER_NAME) || '';
};

export const setUserName = (name: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
};
