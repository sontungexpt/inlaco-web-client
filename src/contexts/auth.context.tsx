import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import * as authService from "@/services/auth.service";
import * as accountService from "@/services/account.service";

import { tokenStore } from "@/shared/auth/token-store";
import type { LoginPayload, LoginResponse } from "@/types/auth";
import { AccountProfileResponse } from "@/types/api/account.api";
import { PageCircularProgress } from "@/components/common";

export type RoleHelpers = {
  includesRole: (role: string) => boolean;
  includesAllRoles: (roles: string[]) => boolean;
};

export type AuthStatus =
  | "Idle"
  | "ProfileFetching"
  | "LoggingIn"
  | "LoggingOut";

export type AuthContextValue = {
  status: AuthStatus;

  isAuthenticated: boolean;
  isBooting: boolean;

  user: AccountProfileResponse | null;
  roles: string[];

  login: (
    payload: LoginPayload,
    rememberMe?: boolean,
  ) => Promise<LoginResponse>;
  logout: () => Promise<void>;
} & RoleHelpers;

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>("Idle");
  const [isBooting, setIsBooting] = useState<boolean>(true);
  const [user, setUser] = useState<AccountProfileResponse | null>(null);

  const fetchProfile = async () => {
    setStatus("ProfileFetching");
    try {
      const profile = await accountService.fetchMyAccountProfile();
      setUser(profile);
      return profile;
    } catch (err) {
      setUser(null);
      return null;
    }
  };

  // ===== BOOTSTRAP =====
  useEffect(() => {
    const bootstrap = async () => {
      setIsBooting(true);
      try {
        const ok = await tokenStore.init();
        if (ok) await fetchProfile();
      } catch (err) {
        } finally {
        setIsBooting(false);
        setStatus("Idle");
      }
    };

    bootstrap();
  }, []);

  // ===== LOGIN =====
  const login = useCallback(
    async (payload: LoginPayload, rememberMe: boolean = false) => {
      try {
        setStatus("LoggingIn");
        await tokenStore.setRememberMe(rememberMe);
        const res = await authService.login(payload);
        await fetchProfile();
        return res;
      } catch (e) {
        throw e;
      } finally {
        setStatus("Idle");
      }
    },
    [],
  );

  // ===== LOGOUT =====
  const logout = useCallback(async () => {
    setStatus("LoggingOut");
    setUser(null);
    try {
      await authService.logout();
    } finally {
      setStatus("Idle");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      isAuthenticated: !!user,
      isBooting,

      user,
      roles: user?.roles ?? [],

      login,
      logout,

      includesRole: (role) => !!user?.roles?.includes(role),
      includesAllRoles: (roles) => roles.every((r) => user?.roles?.includes(r)),
    }),
    [status, user, isBooting, login, logout],
  );

  if (isBooting) {
    return <PageCircularProgress />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ===== HOOK =====
export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
};

export const useAllowedRole = (role: string) => {
  const { includesRole } = useAuthContext();
  return includesRole(role);
};
