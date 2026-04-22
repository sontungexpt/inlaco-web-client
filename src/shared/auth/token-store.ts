import { StorageKey } from "@/config/storage.config";
import { localStorage, sessionStorage, StorageAPI } from "@/utils/storage";

type Listener = () => void;

type TokenSnapshot = {
  accessToken: string | null;
  refreshToken: string | null;
};

class TokenStore {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private uid: string = crypto.randomUUID();
  private storage: StorageAPI = localStorage;

  private listeners = new Set<Listener>();

  private emitChange() {
    this.listeners.forEach((l) => l());
  }

  // Update tokens and return true if there are tokens
  private updateTokens(
    accessToken: string | null,
    refreshToken: string | null,
  ): boolean {
    const changed =
      this.accessToken !== accessToken || this.refreshToken !== refreshToken;

    if (!changed) {
      return !!(this.accessToken || this.refreshToken);
    }

    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    this.emitChange();

    return !!(this.accessToken || this.refreshToken);
  }

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (() => {
    // We keep a single mutable snapshot object inside a closure.
    // Why?
    // React's useSyncExternalStore relies on referential equality (===)
    // to determine if state has changed.
    //
    // If we returned a NEW object on every call, React would think
    // the state changed on every render → causing unnecessary re-renders
    // or even infinite loops.
    //
    // By reusing the same object reference and only mutating its fields,
    // we ensure:
    // - Stable reference across calls
    // - React only re-renders when emitChange() is triggered
    // - Better performance and correctness
    //
    // The closure guarantees this snapshot is created only once
    // and not recreated on each call.
    const snapshot: TokenSnapshot = {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    };

    return () => {
      snapshot.accessToken = this.accessToken;
      snapshot.refreshToken = this.refreshToken;
      return snapshot;
    };
  })();

  async init() {
    const rememberMe = localStorage.getItem(StorageKey.REMEMBER_ME, false);
    this.detectStorage(rememberMe);
    const accessToken =
      this.storage.getItem<string>(StorageKey.ACCESS_TOKEN) ?? null;
    const refreshToken =
      this.storage.getItem<string>(StorageKey.REFRESH_TOKEN) ?? null;
    return this.updateTokens(accessToken, refreshToken);
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
    localStorage.setItem(StorageKey.REMEMBER_ME, rememberMe);
    this.detectStorage(rememberMe);
  }

  detectStorage(rememberMe: boolean) {
    this.storage = rememberMe ? localStorage : sessionStorage;
  }

  async setTokens(access: string, refresh: string) {
    this.updateTokens(access, refresh);

    this.storage.setItem(StorageKey.ACCESS_TOKEN, access);
    this.storage.setItem(StorageKey.REFRESH_TOKEN, refresh);
  }

  async clear() {
    this.uid = crypto.randomUUID();
    this.updateTokens(null, null);

    this.storage.removeItem(StorageKey.ACCESS_TOKEN);
    this.storage.removeItem(StorageKey.REFRESH_TOKEN);
    this.storage.removeItem(StorageKey.REMEMBER_ME);
  }
}

export const tokenStore = new TokenStore();
