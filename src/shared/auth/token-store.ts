import { StorageKey } from "@/config/storage.config";
import { localStorage, sessionStorage, StorageAPI } from "@/utils/storage";

class TokenStore {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private uid: string = crypto.randomUUID();
  private storage: StorageAPI = localStorage;

  async init() {
    const rememberMe = localStorage.getItem(StorageKey.REMEMBER_ME, false);
    this.detectStorage(rememberMe);
    this.accessToken = this.storage.getItem(StorageKey.ACCESS_TOKEN);
    this.refreshToken = this.storage.getItem(StorageKey.REFRESH_TOKEN);
    return !!this.accessToken;
  }

  getUid() {
    return this.uid;
  }

  getAccessToken() {
    return this.accessToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  async setRememberMe(rememberMe: boolean) {
    console.debug("rememberMe", rememberMe);
    localStorage.setItem(StorageKey.REMEMBER_ME, rememberMe);
    this.detectStorage(rememberMe);
  }

  detectStorage(rememberMe: boolean) {
    console.debug("detectStorage", rememberMe);
    this.storage = rememberMe ? localStorage : sessionStorage;
    console.debug("storage", rememberMe ? "localStorage" : "sessionStorage");
  }

  async setTokens(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;

    this.storage.setItem(StorageKey.ACCESS_TOKEN, access);
    this.storage.setItem(StorageKey.REFRESH_TOKEN, refresh);
  }

  async clear() {
    this.uid = crypto.randomUUID();
    this.accessToken = null;
    this.refreshToken = null;

    this.storage.removeItem(StorageKey.ACCESS_TOKEN);
    this.storage.removeItem(StorageKey.REFRESH_TOKEN);
    this.storage.removeItem(StorageKey.REMEMBER_ME);
  }
}

export const tokenStore = new TokenStore();
