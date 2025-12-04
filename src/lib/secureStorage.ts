import CryptoJS from 'crypto-js';

// Secret key for encryption and hashing.
// In a real production app, this should be an environment variable,
// but for a client-side only game, we obscure it here.
const SECRET_KEY = process.env.NEXT_PUBLIC_GAME_SECRET || 'connect-corners-secure-key-v1-x8z9';

export const SecureStorage = {
  /**
   * Encrypts and saves data to localStorage.
   * Format: EncryptedString (Base64)
   * The encrypted string contains the data and is generated using AES.
   * To verify integrity, we could add a separate hash, but AES decryption
   * usually fails if data is tampered with (especially if formatted as JSON).
   * However, to be extra safe and follow the request (SHA-256), we will
   * store a JSON object { data: string, hash: string } where data is the
   * encrypted content and hash is the HMAC-SHA256 of the unencrypted data.
   */
  setItem: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;

    try {
      const jsonString = JSON.stringify(value);

      // 1. Generate Hash (HMAC-SHA256) of the original data for integrity check
      const hash = CryptoJS.HmacSHA256(jsonString, SECRET_KEY).toString();

      // 2. Encrypt the data using AES
      const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();

      // 3. Store both
      const storageValue = JSON.stringify({
        data: encrypted,
        hash: hash
      });

      localStorage.setItem(key, storageValue);
    } catch (e) {
      console.error(`Failed to securely save ${key}`, e);
    }
  },

  /**
   * Retrieves, decrypts, and verifies data from localStorage.
   * Returns null if verification fails or data is missing.
   */
  getItem: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem(key);
    if (!stored) return null;

    try {
      // Try parsing the stored wrapper
      let parsedStorage: { data: string; hash: string };
      try {
        parsedStorage = JSON.parse(stored);
      } catch {
        // Fallback: If it's not our wrapper format, it might be legacy data or tampered.
        // For this implementation, we treat it as invalid/tampered.
        console.warn(`Data for ${key} is not in secure format.`);
        return null;
      }

      if (!parsedStorage.data || !parsedStorage.hash) {
        return null;
      }

      // 1. Decrypt
      const bytes = CryptoJS.AES.decrypt(parsedStorage.data, SECRET_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedString) {
        console.error(`Decryption failed for ${key}`);
        return null;
      }

      // 2. Verify Hash
      const currentHash = CryptoJS.HmacSHA256(decryptedString, SECRET_KEY).toString();

      if (currentHash !== parsedStorage.hash) {
        console.error(`Integrity check failed for ${key}. Data may have been tampered with.`);
        return null;
      }

      // 3. Parse JSON
      return JSON.parse(decryptedString) as T;

    } catch (e) {
      console.error(`Failed to securely load ${key}`, e);
      return null;
    }
  },

  /**
   * Removes item from localStorage
   */
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
};
