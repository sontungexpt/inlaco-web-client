import publicRequest from "../utils/publicRequest";
import AuthEndpoints from "../endpoints/authEndpoints";

export const loginAPI = async (email, password) => {
  try {
    const response = await publicRequest.post(AuthEndpoints.LOGIN, {
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
    const response = await publicRequest.post(AuthEndpoints.REGISTER, {
      name: fullName,
      username: email,
      password: password,
      confirmPassowrd: confirmPassword, //Tung typo here, fix later
    });
    return response;
  } catch (err) {
    return err.response;
  }
};
