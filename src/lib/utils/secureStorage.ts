
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY || 'connect-corners-secure-key-v1';

export const SecureStorage = {
    setItem: (key: string, value: any): void => {
        if (typeof window === 'undefined') return;
        try {
            const stringValue = JSON.stringify(value);
            const encrypted = CryptoJS.AES.encrypt(stringValue, SECRET_KEY).toString();
            localStorage.setItem(key, encrypted);
        } catch (e) {
            console.error('Failed to save to secure storage', e);
        }
    },

    getItem: <T>(key: string, defaultValue: T): T => {
        if (typeof window === 'undefined') return defaultValue;

        const item = localStorage.getItem(key);
        if (!item) return defaultValue;

        // 1. Try to decrypt and parse
        try {
            const bytes = CryptoJS.AES.decrypt(item, SECRET_KEY);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);

            if (decrypted) {
                return JSON.parse(decrypted) as T;
            }
        } catch (e) {
            // Decryption failed or JSON parse of decrypted data failed
            // Continue to try legacy parsing
        }

        // 2. If decryption failed or result was empty, try parsing original item (Legacy support)
        try {
            return JSON.parse(item) as T;
        } catch (e) {
            // Not legacy JSON either
        }

        // 3. Fallback: Data is corrupted or completely invalid
        console.warn(`Failed to recover data for key "${key}", resetting to default.`);
        // Optional: Remove invalid data to prevent persistent warnings?
        // localStorage.removeItem(key); 
        return defaultValue;
    },

    removeItem: (key: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(key);
    }
};
