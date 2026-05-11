import { useQuery } from "@tanstack/react-query";

import { getShipSchedules } from "@/services/ship-schedule.service";
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
