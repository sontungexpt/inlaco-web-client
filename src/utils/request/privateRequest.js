import axios, { HttpStatusCode } from "axios";
import AppProperty from "@constants/AppProperty";
import { localStorage, sessionStorage, StorageKey } from "@utils/storage";
import { TokenMutex } from "./TokenMutex";
import AuthEndpoint from "@/endpoints/AuthEndpoint";

const privateRequest = axios.create({
  baseURL: AppProperty.INLACO_API_URL,
  headers: {
    post: {
      "Content-Type": "application/json",
    },
    get: {
      "Content-Type": "application/json",
    },
    patch: {
      "Content-Type": "application/merge-patch+json",
    },
    delete: {
      "Content-Type": "application/json",
    },
  },
});

// ======================== REQUEST ========================
privateRequest.interceptors.request.use(
  async (config) => {
    const rememberMe = await localStorage.getItem(StorageKey.REMEMBER_ME);

    const accessToken = rememberMe
      ? await localStorage.getItem(StorageKey.ACCESS_TOKEN)
      : await sessionStorage.getItem(StorageKey.ACCESS_TOKEN);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (err) => Promise.reject(err),
);

export const tokenMutex = new TokenMutex();

export async function refreshAccessToken() {
  return tokenMutex.run(async () => {
    const rememberMe = await localStorage.getItem(StorageKey.REMEMBER_ME);
    const store = rememberMe ? localStorage : sessionStorage;

    const refreshToken = store.getItem(StorageKey.REFRESH_TOKEN);

    try {
      const response = await axios.post(
        `${AppProperty.INLACO_API_URL}${AuthEndpoint.REFRESH_TOKEN}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data;

      store.setItem(StorageKey.ACCESS_TOKEN, newAccessToken);
      store.setItem(StorageKey.REFRESH_TOKEN, newRefreshToken);

      return newAccessToken;
    } catch (err) {
      console.log("Error when refresh access token", err);
      store.removeItem(StorageKey.ACCESS_TOKEN);
      store.removeItem(StorageKey.REFRESH_TOKEN);
      // window.location.href = "/login";
      return null;
    }
  });
}

// ======================== RESPONSE ========================
privateRequest.interceptors.response.use(
  (response) => response,

  async (error) => {
    const config = error.config;

    if (
      error.response?.status !== HttpStatusCode.Unauthorized ||
      config._retry
    ) {
      return Promise.reject(error);
    }

    config._retry = true;

    const newToken = await refreshAccessToken();
    if (newToken) {
      config.headers.Authorization = `Bearer ${newToken}`;
      return privateRequest(config);
    }

    return Promise.reject(error);
  },
);

export default privateRequest;
