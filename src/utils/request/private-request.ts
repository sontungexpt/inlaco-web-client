import axios, { HttpStatusCode } from "axios";
import { TokenMutex } from "./token-mutex";
import { AuthEndpoint } from "@/endpoints/auth.endpoint";
import { tokenStore } from "@/shared/auth/token-store";
import { Env } from "@/config/env.config";

const SHARED_JSON_HEADER = { "Content-Type": "application/json" };
const privateRequest = axios.create({
  baseURL: Env.BASE_API_URL,
  headers: {
    post: SHARED_JSON_HEADER,
    get: SHARED_JSON_HEADER,
    delete: SHARED_JSON_HEADER,
    put: SHARED_JSON_HEADER,
    patch: { "Content-Type": "application/merge-patch+json" },
  },
});

// ======================== REQUEST ========================
privateRequest.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const tokenMutex = new TokenMutex();

async function refreshAccessToken() {
  return tokenMutex.run(async () => {
    const refreshToken = tokenStore.getRefreshToken();

    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }

    const epoch = tokenStore.getUid();

    try {
      const response = await axios.post(
        `${Env.BASE_API_URL}${AuthEndpoint.REFRESH_TOKEN}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );
      // logout happened during refresh
      if (epoch !== tokenStore.getUid()) {
        throw new Error("Token invalidated");
      }

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data;

      await tokenStore.setTokens(newAccessToken, newRefreshToken);
      return newAccessToken;
    } catch (error) {
      await tokenStore.clear();
      throw error;
    }
  });
}

// ======================== RESPONSE ========================
privateRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status !== HttpStatusCode.Unauthorized ||
      original._retry
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const newToken = await refreshAccessToken();
      original.headers.Authorization = `Bearer ${newToken}`;
      return privateRequest(original);
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export default privateRequest;
