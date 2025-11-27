import { useAuthContext } from "@/contexts/AuthContext";

const useAllowedRole = function (role) {
  const { hasRole } = useAuthContext();
  return hasRole(role);
};

export const useAllowedRoles = function (roles) {
  const { hasRoles } = useAuthContext();
  return hasRoles(roles);
};

export default useAllowedRole;
