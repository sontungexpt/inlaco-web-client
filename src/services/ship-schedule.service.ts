import { ShipScheduleEndpoint } from "@/endpoints/ship-schedule.endpoint";
import { PageableResponse, PageParams } from "@/types/api/shared/base.api";
import {
  CreateShipScheduleRequest,
  ShipScheduleDetail,
  ShipScheduleFilter,
  ShipSchedulePageParams,
  ShipScheduleResponse,
} from "@/types/api/ship-schedule.api";
import { flattenFilter } from "@/utils/filter";
import { privateRequest } from "@/utils/request";

export async function createShipSchedule(body: CreateShipScheduleRequest) {
  const response = await privateRequest.post(
    ShipScheduleEndpoint.CREATE_SCHEDULE,
    body,
  );

  return response.data;
}

export async function getShipSchedules({
  page,
  pageSize,
  sort,
  filter,
}: ShipSchedulePageParams) {
  const response = await privateRequest.get<
    PageableResponse<ShipScheduleResponse>
  >(ShipScheduleEndpoint.GET_ALL_SCHEDULES, {
    params: {
      page: page,
      size: pageSize,
      sort: sort,
      ...flattenFilter(filter),
    },
  });

  return response.data;
}

export async function getShipScheduleDetail(id: string) {
  const res = await privateRequest.get<ShipScheduleDetail>(
    ShipScheduleEndpoint.GET_DETAIL_SCHEDULE(id),
  );
  return res.data;
}
