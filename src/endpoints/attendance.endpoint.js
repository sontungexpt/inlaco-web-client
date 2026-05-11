export const AttendanceEndpoint = {
  GENERATE_QR_ATTENDANCE: (shipScheduleId) =>
    `/v1/attendance/${shipScheduleId}`,
};

export default AttendanceEndpoint;
