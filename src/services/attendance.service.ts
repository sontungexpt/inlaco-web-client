import { AttendanceEndpoint } from "@/endpoints/attendance.endpoint";
import {
  AttendanceQRCodeResponse,
  CheckType,
} from "@/types/api/attendance.api";
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
