import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "@/services/userServices";

export const useProfile = ({ ...params }) =>
  useQuery({
    ...params,
    queryKey: ["user-profile"],
    queryFn: () => fetchUserProfile(),
    staleTime: 1000 * 60 * 5, // cache 5 min
    retry: false, // 401 thì logout luôn
  });
