// utils/reactNativePersistence.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

export function getReactNativePersistence(storage: typeof AsyncStorage) {
  return {
    type: "LOCAL",
    async set(key: string, value: object): Promise<void> {
      await storage.setItem(key, JSON.stringify(value));
    },
    async get<T = unknown>(key: string): Promise<T | null> {
      const json = await storage.getItem(key);
      return json ? (JSON.parse(json) as T) : null;
    },
    async remove(key: string): Promise<void> {
      await storage.removeItem(key);
    },
  };
}
