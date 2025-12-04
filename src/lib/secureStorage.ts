import CryptoJS from 'crypto-js';

// Secret key for encryption and hashing.
// In a real production app, this should be an environment variable,
// but for a client-side only game, we must embed it or generate it.
// To make it slightly harder to guess, we can obscure it.
const SECRET_KEY = process.env.NEXT_PUBLIC_GAME_SECRET || 'ConnectCorners_Secret_Key_v1_Salted';

interface SecureStorageItem {
  data: string; // Encrypted data (Base64)
  hash: string; // HMAC hash of the data for integrity check
}

/**
 * Encrypts data using AES and signs it with HMAC-SHA256.
 * @param data The data to store (will be JSON stringified)
 * @returns The encrypted string
 */
export const encryptData = (data: unknown): string => {
  try {
    const jsonString = JSON.stringify(data);

    // Encrypt the data
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();

    // Create a hash for integrity check
    const hash = CryptoJS.HmacSHA256(jsonString, SECRET_KEY).toString();

    // Store both
    const storageItem: SecureStorageItem = {
      data: encrypted,
      hash: hash
    };

    // Encode the final object to Base64 to make it look like a random string
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(storageItem)));
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
};

/**
 * Decrypts data and verifies its integrity.
 * @param encryptedString The encrypted string from storage
 * @returns The decrypted data or null if verification fails
 */
export const decryptData = <T>(encryptedString: string | null): T | null => {
  if (!encryptedString) return null;

  try {
    // Decode Base64 wrapper
    const decodedString = CryptoJS.enc.Base64.parse(encryptedString).toString(CryptoJS.enc.Utf8);
    const storageItem: SecureStorageItem = JSON.parse(decodedString);

    if (!storageItem.data || !storageItem.hash) {
      return null;
    }

    // Decrypt the data
    const bytes = CryptoJS.AES.decrypt(storageItem.data, SECRET_KEY);
    const decryptedJson = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedJson) {
        return null;
    }

    // Verify hash
    const currentHash = CryptoJS.HmacSHA256(decryptedJson, SECRET_KEY).toString();

    if (currentHash !== storageItem.hash) {
      console.warn('Data tampering detected. Hash mismatch.');
      return null;
    }

    return JSON.parse(decryptedJson) as T;
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

/**
 * Securely saves data to localStorage
 */
export const secureSetItem = (key: string, value: unknown): void => {
  if (typeof window === 'undefined') return;
  const encrypted = encryptData(value);
  localStorage.setItem(key, encrypted);
};

/**
 * Securely retrieves data from localStorage
 */
export const secureGetItem = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  const item = localStorage.getItem(key);
  return decryptData<T>(item);
};
