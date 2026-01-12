import { createContext, useCallback, useContext, useMemo } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import StorageKey from "@constants/StorageKey";
import { localStorage, sessionStorage } from "@utils/storage";
import {
  login as loginAPI,
  logout as logoutAPI,
} from "@/services/authServices";
import { USE_PROFILE_KEY, useProfile } from "@/hooks/services/user";
import { PageCircularProgress } from "@/components/common";

export const AuthContext = createContext(null);

/**
 * Decide which storage to use
 */
const identifyStorage = (
  rememberMe = localStorage.getItem(StorageKey.REMEMBER_ME),
) => (rememberMe ? localStorage : sessionStorage);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const storage = identifyStorage();
  const token = storage.getItem(StorageKey.ACCESS_TOKEN) || "";

  // ===== TOKEN STATE =====

  // ===== USER PROFILE QUERY =====
  const {
    data: user,
    isLoading,
    // isError,
  } = useProfile({
    enabled: !!token,
  });

  const isAuthenticated = !!user;

  const login = useCallback(
    async ({ email, password, rememberMe }) => {
      try {
        const response = await loginAPI(email, password);
        const { accessToken, refreshToken } = response.data.jwt;

        localStorage.setItem(StorageKey.REMEMBER_ME, rememberMe);

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(StorageKey.ACCESS_TOKEN, accessToken);
        storage.setItem(StorageKey.REFRESH_TOKEN, refreshToken);

        await queryClient.invalidateQueries({
          queryKey: USE_PROFILE_KEY,
        });

        return response;
      } catch (error) {
        return error.response;
      }
    },
    [queryClient],
  );

  // ===== LOGOUT =====
  const logout = useCallback(async () => {
    const refreshToken = storage.getItem(StorageKey.REFRESH_TOKEN) || "";

    try {
      if (refreshToken) {
        await logoutAPI(refreshToken);
      }
    } catch (_) {
      // ignore
    }

    storage.removeItem(StorageKey.ACCESS_TOKEN);
    storage.removeItem(StorageKey.REFRESH_TOKEN);
    localStorage.removeItem(StorageKey.REMEMBER_ME);

    queryClient.clear();
    navigate("/login");
  }, [navigate, queryClient, storage]);

  const hasRole = useCallback(
    (role) => user?.roles?.includes(role),
    [user?.roles],
  );

  const hasRoles = useCallback(
    (roles) => roles.every((r) => user?.roles?.includes(r)),
    [user?.roles],
  );

  // ===== CONTEXT VALUE =====
  const value = useMemo(
    () => ({
      // status
      isLoading,
      isAuthenticated,

      // user
      user,
      roles: user?.roles ?? [],
      accountName: user?.name ?? "",

      // helpers
      login,
      logout,
      hasRole,
      hasRoles,
    }),
    [isLoading, isAuthenticated, user, login, logout, hasRole, hasRoles],
  );
  if (isLoading) return <PageCircularProgress />;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
};
