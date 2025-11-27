import AppProperty from "../constants/AppProperty";
export { default as StorageKey } from "@constants/StorageKey";

const _localStorage = window.localStorage;
const _sessionStorage = window.sessionStorage;

export const localStorage = {
  setItem: (key, value) =>
    _localStorage.setItem(
      `${AppProperty.APP_NAME}_${key}`,
      JSON.stringify(value),
    ),

  getItem: (key) =>
    JSON.parse(_localStorage.getItem(`${AppProperty.APP_NAME}_${key}`)),

  removeItem: (key) =>
    _localStorage.removeItem(`${AppProperty.APP_NAME}_${key}`),
};

export const sessionStorage = {
  setItem: (key, value) =>
    _sessionStorage.setItem(
      `${AppProperty.APP_NAME}_${key}`,
      JSON.stringify(value),
    ),

  getItem: (key) =>
    JSON.parse(_sessionStorage.getItem(`${AppProperty.APP_NAME}_${key}`)),

  removeItem: (key) =>
    window.sessionStorage.removeItem(`${AppProperty.APP_NAME}_${key}`),
};
