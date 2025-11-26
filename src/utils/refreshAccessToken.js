import publicRequest from "./publicRequest";
import { localStorage, sessionStorage, StorageKey } from "./storageUtils";
import AuthEndpoints from "../endpoints/authEndpoints";

const refreshTokenFn = async () => {
  const rememberMe = await localStorage.getItem(StorageKey.REMEMBER_ME);

  const refreshToken = rememberMe
    ? localStorage.getItem(StorageKey.REFRESH_TOKEN)
    : sessionStorage.getItem(StorageKey.REFRESH_TOKEN);

  if (!refreshToken) {
    return null;
  }

  const config = {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  };

  try {
    const response = await publicRequest.post(
      AuthEndpoints.REFRESH_TOKEN,
      null,
      config,
    );

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      response.data;

    if (rememberMe) {
      localStorage.setItem(StorageKey.REFRESH_TOKEN, newRefreshToken);
      localStorage.setItem(StorageKey.ACCESS_TOKEN, newAccessToken);
    } else {
      sessionStorage.setItem(StorageKey.REFRESH_TOKEN, newRefreshToken);
      sessionStorage.setItem(StorageKey.ACCESS_TOKEN, newAccessToken);
    }
    return newAccessToken;
  } catch (error) {
    if (rememberMe) {
      console.log(
        "Error when remove items from localStorage when refresh access token",
        error,
      );
      localStorage.removeItem(StorageKey.REFRESH_TOKEN);
      localStorage.removeItem(StorageKey.ACCESS_TOKEN);
    } else {
      console.log(
        "Error when remove items from sessionStorage when refresh access token",
        error,
      );

      sessionStorage.removeItem(StorageKey.REFRESH_TOKEN);
      sessionStorage.removeItem(StorageKey.ACCESS_TOKEN);
    }
    return null;
  }
};

export default refreshTokenFn;
