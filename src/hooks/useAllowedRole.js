import { useAuthContext } from "@/contexts/auth.context";

const useAllowedRole = function (role) {
  const { includesRole } = useAuthContext();
  return includesRole(role);
};

export const useAllowedRoles = function (roles) {
  const { includesAllRoles } = useAuthContext();
  return includesAllRoles(roles);
};

export default useAllowedRole;
