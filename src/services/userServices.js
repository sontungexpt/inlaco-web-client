import UserEndpoint from "@/endpoints/UserEndpoint";
import { privateRequest } from "@/utils/request";

export const fetchUserProfile = async () => {
  const response = await privateRequest.get(UserEndpoint.GET_USER_PROFILE, {
    params: {},
  });
  return response.data;
};
