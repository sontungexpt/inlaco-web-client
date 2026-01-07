import AuthEndpoint from "@/endpoints/AuthEndpoint";
import { publicRequest } from "@/utils/request";

export const login = async (email, password) => {
  const response = await publicRequest.post(AuthEndpoint.LOGIN, {
    username: email,
    password: password,
  });
  return response;
};

export const signUpAPI = async (fullName, email, password, confirmPassword) => {
  try {
    const response = await publicRequest.post(AuthEndpoint.REGISTER, {
      name: fullName,
      username: email,
      password: password,
      confirmPassword: confirmPassword,
    });
    return response;
  } catch (err) {
    return err.response;
  }
};

export const logout = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Access token not found");
  }
  await publicRequest.post(
    AuthEndpoint.LOGOUT,
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    },
  );
};
