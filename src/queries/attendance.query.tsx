import {
  UseMutateFunction,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  fetchAttendanceLogs,
  generateAttendanceQR,
} from "@/services/attendance.service";
import {
  AttendanceQRCodeResponse,
  FetchAttendanceLogsParams,
} from "@/types/api/attendance.api";

const BASE_QUERY_KEY = ["attendances"];
export const AttendanceQueryKey = {
  ALL: BASE_QUERY_KEY,
  LIST: ({ page, pageSize, sort, filter }: FetchAttendanceLogsParams) =>
    [...BASE_QUERY_KEY, "list", page, pageSize, sort, filter] as const,
  LIST_BY_SCHEDULE_ID: ({
    page,
    pageSize,
    sort,
    filter,
    shipScheduleId,
  }: FetchAttendanceLogsParams & { shipScheduleId: string }) =>
    [
      ...BASE_QUERY_KEY,
      "list",
      page,
      pageSize,
      sort,
      filter,
      shipScheduleId,
    ] as const,
};

export function useGenerateAttendanceQR(
  options?: UseMutateFunction<AttendanceQRCodeResponse, Error>,
) {
  return useMutation({
    ...options,
    mutationFn: generateAttendanceQR,
  });
}

export function useAttendanceLogs({
  shipScheduleId,
  page = 0,
  pageSize = 12,
  sort,
  filter,
  enabled,
}: FetchAttendanceLogsParams & { shipScheduleId: string; enabled?: boolean }) {
  return useQuery({
    enabled: !!shipScheduleId && !!enabled,
    queryKey: AttendanceQueryKey.LIST_BY_SCHEDULE_ID({
      page,
      pageSize,
      sort,
      filter,
      shipScheduleId,
    }),

    queryFn: () =>
      fetchAttendanceLogs({
        page,
        pageSize,
        sort,
        filter,
        shipScheduleId,
      }),

    staleTime: 1000 * 60 * 4,
  });
}
