import { useQuery } from "@tanstack/react-query";

import {
  getShipScheduleDetail,
  getShipSchedules,
} from "@/services/ship-schedule.service";
import { ShipSchedulePageParams } from "@/types/api/ship-schedule.api";

const BASE_QUERY_KEY = ["ship-schedules"];
const ShipScheduleQueryKey = {
  ALL: BASE_QUERY_KEY,
  LIST: ({ page, pageSize, filter }: ShipSchedulePageParams) => [
    ...BASE_QUERY_KEY,
    "list",
    page,
    pageSize,
    filter,
  ],
  DETAIL: (id?: string) => [...BASE_QUERY_KEY, "detail", id],
};

export function useShipSchedules({
  page,
  pageSize,
  filter,
}: ShipSchedulePageParams) {
  return useQuery({
    queryKey: ShipScheduleQueryKey.LIST({ page, pageSize, filter }),

    queryFn: () =>
      getShipSchedules({
        page,
        pageSize,
        filter,
      }),
  });
}

export function useShipScheduleDetail(id?: string) {
  return useQuery({
    queryKey: ShipScheduleQueryKey.DETAIL(id),
    enabled: !!id,
    queryFn: () => getShipScheduleDetail(id!),
  });
}
