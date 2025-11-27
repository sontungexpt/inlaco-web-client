import { createContext, useState, useContext } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [roles, setRoles] = useState([]);
  const [accountName, setAccountName] = useState("");

  const value = {
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
    roles,
    setRoles,
    accountName,
    setAccountName,
    hasRole: (required_role) => roles.includes(required_role),
    hasRoles: (required_roles) =>
      required_roles.every((role) => this.roles.includes(role)),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const appContext = useContext(AuthContext);
  if (!appContext) {
    console.error("useAuthContext must be used within an AuthProvider");
  }
  return appContext;
};
