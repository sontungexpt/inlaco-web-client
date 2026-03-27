import { AccountEndpoint } from "@/endpoints/account.endpoint";
import { privateRequest } from "@/utils/request";
import { AccountProfileResponse } from "@/types/api/account.api";

export async function fetchMyAccountProfile(): Promise<AccountProfileResponse> {
  const response = await privateRequest.get<AccountProfileResponse>(
    AccountEndpoint.GET_MY_ACCOUNT_PROFILE,
  );
  return response.data;
}
