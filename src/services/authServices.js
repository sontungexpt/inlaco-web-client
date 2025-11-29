import publicRequest from "../utils/publicRequest";
import AuthEndpoint from "../endpoints/AuthEndpoint";

export const loginAPI = async (email, password) => {
  try {
    const response = await publicRequest.post(AuthEndpoint.LOGIN, {
      username: email,
      password: password,
    });
    return response;
  } catch (err) {
    return err.response;
  }
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
  try {
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
  } catch (error) {
    console.debug(
      "Logout unsuccessful " + error + " with status code: ",
      error.status,
    );
    throw error;
  }
};
