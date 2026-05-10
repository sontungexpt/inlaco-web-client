import AppProperty from "@/config/app.config";
export { StorageKey } from "@/config/storage.config";

const PREFIX = `${AppProperty.APP_NAME}_`;

type StorageValue = unknown;

export interface StorageAPI {
  setItem<T = StorageValue>(key: string, value: T): void;
  getItem<T = StorageValue>(key: string): T | null;
  getItem<T = StorageValue>(key: string, defaultValue: T): T;
  removeItem(key: string): void;
  clear(): void;
}

const createStorage = (storage: Storage): StorageAPI => ({
  setItem<T>(key: string, value: T) {
    try {
      storage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (err) {
      console.error("Storage setItem error:", err);
    }
  },

  getItem<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const value = storage.getItem(PREFIX + key);
      return value ? (JSON.parse(value) as T) : defaultValue;
    } catch (err) {
      console.error("Storage getItem error:", err);
      return defaultValue;
    }
  },

  removeItem(key: string) {
    try {
      storage.removeItem(PREFIX + key);
    } catch (err) {
      console.error("Storage removeItem error:", err);
    }
  },

  clear() {
    try {
      Object.keys(storage)
        .filter((k) => k.startsWith(PREFIX))
        .forEach((k) => storage.removeItem(k));
    } catch (err) {
      console.error("Storage clear error:", err);
    }
  },
});

export const localStorage = createStorage(window.localStorage);
export const sessionStorage = createStorage(window.sessionStorage);
