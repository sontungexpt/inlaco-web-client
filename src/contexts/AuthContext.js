import { useEffect, createContext, useState, useContext, useMemo } from "react";
import StorageKey from "@constants/StorageKey";
import { localStorage, sessionStorage } from "@utils/storage";
import { useNavigate } from "react-router";
import { logout as logoutAPI } from "@/services/authServices";

export const AuthContext = createContext();

const identifyStorage = (
  rememberMe = localStorage.getItem(StorageKey.REMEMBER_ME),
) => {
  return rememberMe ? localStorage : sessionStorage;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [roles, setRoles] = useState([]);
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(true);

  // Load saved credentials (persist login)
  useEffect(() => {
    setLoading(true);
    const storage = identifyStorage();
    const savedAccess = storage.getItem(StorageKey.ACCESS_TOKEN);
    const savedRefresh = storage.getItem(StorageKey.REFRESH_TOKEN);
    const savedName = storage.getItem(StorageKey.ACCOUNT_NAME);
    const savedRoles = storage.getItem(StorageKey.ROLES);

    if (savedAccess && savedRefresh && savedName && savedRoles) {
      console.debug("Fetching user info");
      setAccessToken(savedAccess);
      setRefreshToken(savedRefresh);
      setAccountName(savedName);
      setRoles(savedRoles);
    } else {
      console.debug("Navigate to login");
      navigate("/login");
    }
    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = async () => {
    setLoading(true);
    if (refreshToken) {
      try {
        await logoutAPI(refreshToken);
      } catch (err) {
        // something went wrong may be the refreshToken is not valid
        // so just ignore
      }
    }
    const storage = identifyStorage();
    storage.removeItem(StorageKey.ACCESS_TOKEN);
    storage.removeItem(StorageKey.REFRESH_TOKEN);
    storage.removeItem(StorageKey.ACCOUNT_NAME);
    storage.removeItem(StorageKey.ROLES);
    localStorage.removeItem(StorageKey.REMEMBER_ME);

    setAccessToken("");
    setRefreshToken("");
    setAccountName("");
    setRoles([]);
    navigate("/login");
    setLoading(false);
  };

  const value = useMemo(
    () => ({
      loading,
      accessToken,
      setAccessToken,
      refreshToken,
      setRefreshToken,
      roles,
      setRoles,
      accountName,
      setAccountName,

      logout,
      hasRole: (role) => roles.includes(role),
      hasRoles: (requiredRoles) =>
        requiredRoles.every((r) => roles.includes(r)),
    }),

    [loading, accessToken, refreshToken, roles, accountName], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const appContext = useContext(AuthContext);
  if (!appContext) {
    console.error("useAuthContext must be used within an AuthProvider");
  }
  return appContext;
};
