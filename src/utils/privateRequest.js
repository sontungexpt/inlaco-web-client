import { privateRequest } from "./request";
export default privateRequest;

// import axios from "axios";
// import refreshTokenFn from "./refreshAccessToken";
// import AppProperty from "../constants/AppProperty";
// import HttpStatusCode from "../constants/HttpStatusCode";
// import { localStorage, sessionStorage } from "./storage";
// import StorageKey from "@constants/StorageKey";

// const privateRequest = axios.create({
//   baseURL: AppProperty.INLACO_API_URL,
//   headers: {
//     post: {
//       "Content-Type": "application/json",
//     },
//     get: {
//       "Content-Type": "application/json",
//     },
//     patch: {
//       "Content-Type": "application/merge-patch+json",
//     },
//     delete: {
//       "Content-Type": "application/json",
//     },
//   },
// });

// // privateRequest.defaults.baseURL = AppProperty.INLACO_API_URL;

// privateRequest.interceptors.request.use(
//   async (config) => {
//     const rememberMe = await localStorage.getItem(StorageKey.REMEMBER_ME);

//     const accessToken = rememberMe
//       ? await localStorage.getItem(StorageKey.ACCESS_TOKEN)
//       : await sessionStorage.getItem(StorageKey.ACCESS_TOKEN);

//     if (accessToken) {
//       config.headers = {
//         ...config.headers,
//         Authorization: `Bearer ${accessToken}`,
//       };
//     }
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// privateRequest.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const config = error?.config;
//     if (
//       error?.response?.status === HttpStatusCode.UNAUTHORIZED &&
//       !config?.sent
//     ) {
//       config.sent = true;
//       const newAccessToken = await refreshTokenFn();

//       if (newAccessToken) {
//         config.headers = {
//           ...config.headers,
//           Authorization: `Bearer ${newAccessToken}`,
//         };
//         return privateRequest(config);
//       }
//       //   //logout without sending the refresh token back to server
//       //   toast.warn("Session expired. Please login again.");
//       //   history.navigate("/login");
//       return Promise.reject(error);
//     }
//     return Promise.reject(error);
//   },
// );

// // const privateRequest = axios;

// export default privateRequest;
