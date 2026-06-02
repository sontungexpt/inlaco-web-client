import { AttendanceEndpoint } from "@/endpoints/attendance.endpoint";
import {
  AttendanceLogResponse,
  AttendanceQRCodeResponse,
  CheckType,
  FetchAttendanceLogsParams,
} from "@/types/api/attendance.api";
import { PageableResponse } from "@/types/api/shared/base.api";
import { flattenFilter } from "@/utils/filter";
import { privateRequest } from "@/utils/request";

export async function generateAttendanceQR({
  shipScheduleId,
  checkType,
  location,
}: {
  shipScheduleId: string;
  checkType: CheckType;
  location: string;
}) {
  const res = await privateRequest.get<AttendanceQRCodeResponse>(
    AttendanceEndpoint.GENERATE_QR_ATTENDANCE(shipScheduleId),
    {
      params: {
        checkType: checkType,
        method: "QR_CODE",
        location: location,
      },
    },
  );

  return res.data;
}

export async function fetchAttendanceLogs({
  shipScheduleId,
  page,
  sort,
  filter,
  pageSize,
}: FetchAttendanceLogsParams & { shipScheduleId: string }) {
  const res = await privateRequest.get<PageableResponse<AttendanceLogResponse>>(
    AttendanceEndpoint.GET_SHIP_SCHEDULE_ATTENDANCE_HISTORY(shipScheduleId),
    {
      params: {
        page,
        size: pageSize,
        sort,
        ...flattenFilter(filter),
      },
    },
  );

  return res.data;
}
