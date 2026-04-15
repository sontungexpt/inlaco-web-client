import CrewProfileEndpoint from "@/endpoints/crew-profile.endpoint";
import { CrewProfile, CrewProfileFetchParams } from "@/types/api/crew-profile";
import { PageableResponse } from "@/types/api/shared/base.api";

import { flattenFilter } from "@/utils/filter";
import { privateRequest } from "@/utils/request";

export const fetchCrewProfiles = async ({
  page,
  pageSize,
  filter,
}: CrewProfileFetchParams): Promise<PageableResponse<CrewProfile>> => {
  const response = await privateRequest.get(CrewProfileEndpoint.GET_ALL_CREWS, {
    params: {
      page,
      size: pageSize,
      ...flattenFilter(filter),
    },
  });
  return response.data;
};

export const fetchMyCrewProfile = async () => {
  const response = await privateRequest.get<CrewProfile>(
    CrewProfileEndpoint.CURRENT_PROFILE,
  );
  return response.data;
};

export const fetchSpecificCrewProfile = async (profileId: String) => {
  const response = await privateRequest.get<CrewProfile>(
    CrewProfileEndpoint.GET_BY_ID(profileId),
  );
  return response.data;
};
