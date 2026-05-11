import { AttendanceEndpoint } from "@/endpoints/attendance.endpoint";
import {
  AttendanceQRCodeResponse,
  CheckType,
} from "@/types/api/attendance.api";
import { privateRequest } from "@/utils/request";

export async function generateAttendanceQR({
  shipScheduleId,
  checkType,
}: {
  shipScheduleId: string;
  checkType: CheckType;
}) {
  const res = await privateRequest.get<AttendanceQRCodeResponse>(
    AttendanceEndpoint.GENERATE_QR_ATTENDANCE(shipScheduleId),
    {
      params: {
        checkType: checkType,
        method: "QR_CODE",
      },
    },
  );

  return res.data;
}
