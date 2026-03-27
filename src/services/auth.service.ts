import { AuthEndpoint } from "@/endpoints/auth.endpoint";
import { tokenStore } from "@/shared/auth/token-store";
import { publicRequest } from "@/utils/request";

import type { LoginResponse, LoginPayload, SignupPayload } from "@/types/auth";

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await publicRequest.post<LoginResponse>(AuthEndpoint.LOGIN, {
    username: payload.username,
    password: payload.password,
  });

  const data = response.data;
  const { accessToken, refreshToken } = data;
  await tokenStore.setTokens(accessToken, refreshToken);
  return data;
};

export const signUp = async (
  payload: SignupPayload,
): Promise<LoginResponse> => {
  const response = await publicRequest.post<LoginResponse>(
    AuthEndpoint.REGISTER,
    {
      name: payload.fullName,
      username: payload.email,
      password: payload.password,
      confirmPassword: payload.confirmPassword,
    },
  );

  return response.data;
};

export const logout = async (): Promise<void> => {
  const refreshToken = tokenStore.getRefreshToken();
  const tasks: Promise<unknown>[] = [tokenStore.clear()];
  if (refreshToken) {
    tasks.push(
      publicRequest.post(AuthEndpoint.LOGOUT, null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }),
    );
  }

  await Promise.all(tasks);
};
