import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "@/services/userServices";

export const USE_PROFILE_KEY = ["user-profile"];

export const useProfile = ({ ...params }) =>
  useQuery({
    ...params,
    queryKey: USE_PROFILE_KEY,
    queryFn: () => fetchUserProfile(),
    staleTime: 1000 * 60 * 5, // cache 5 min
    retry: false, // 401 thì logout luôn
  });
