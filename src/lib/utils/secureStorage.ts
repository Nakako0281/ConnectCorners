
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
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return defaultValue;

            let decrypted: string | null = null;

            try {
                const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
                decrypted = bytes.toString(CryptoJS.enc.Utf8);
            } catch (e) {
                // Verification failed, might be legacy data
            }

            if (!decrypted) {
                // Try parsing as legacy plain JSON
                try {
                    const legacy = JSON.parse(encrypted);
                    // If valid JSON, migrate it? or just return it. 
                    // Let's just return it for now to avoid auto-migration logic loops or complexity.
                    return legacy as T;
                } catch {
                    // Not legacy JSON either, return default
                    return defaultValue;
                }
            }

            return JSON.parse(decrypted) as T;
        } catch (e) {
            console.error('Failed to load from secure storage', e);
            return defaultValue;
        }
    },

    removeItem: (key: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(key);
    }
};
