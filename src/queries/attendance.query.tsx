import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { generateAttendanceQR } from "@/services/attendance.service";
import { AttendanceQRCodeResponse } from "@/types/api/attendance.api";

export function useGenerateAttendanceQR(
  options?: UseMutateFunction<AttendanceQRCodeResponse, Error>,
) {
  return useMutation({
    ...options,
    mutationFn: generateAttendanceQR,
  });
}
