import { privateRequest } from "@/utils/request";
import MobilizationEndpoint from "@/endpoints/mobilization.endpoint";
import { flattenFilter } from "@/utils/filter";

import {
  FetchMobilizationSchedulesParams,
  MobilizationSchedule,
  NewMobilizationSchedule,
} from "@/types/api/mobilization.api";
import { PageableResponse } from "@/types/api/shared/base.api";

export const fetchMobilizations = async ({
  page,
  pageSize,
  filter,
}: FetchMobilizationSchedulesParams) => {
  const response = await privateRequest.get<
    PageableResponse<MobilizationSchedule>
  >(MobilizationEndpoint.GET_ALL_MOBILIZATIONS, {
    params: {
      page,
      size: pageSize,
      ...flattenFilter(filter),
    },
  });
  return response.data;
};

export const fetchSpecificMobilization = async (mobilizationId: string) => {
  const response = await privateRequest.get<MobilizationSchedule>(
    MobilizationEndpoint.GET_BY_ID(mobilizationId),
  );
  return response.data;
};

export const createMobilization = async (
  mobilizationInfo: NewMobilizationSchedule,
) => {
  const response = await privateRequest.post<MobilizationSchedule>(
    MobilizationEndpoint.CREATE_MOBILIZATION,
    mobilizationInfo,
  );
  return response.data;
};

export const fetchMyMobilizations = async (): Promise<PageableResponse<MobilizationSchedule>> => {
  const response = await privateRequest.get<PageableResponse<MobilizationSchedule>>(
    MobilizationEndpoint.CURRENT_MOBILIZATION,
    { params: { size: 500 } },
  );
  return response.data;
};

export const exportMobilizationExcel = async (id: string) => {
  const response = await privateRequest.get<Blob>(
    MobilizationEndpoint.EXPORT_EXCEL(id),
    {
      responseType: "blob",
    },
  );

  return response.data;
};
