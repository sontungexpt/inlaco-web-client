export const AttendanceEndpoint = {
  GENERATE_QR_ATTENDANCE: (shipScheduleId) =>
    `/v1/attendance/${shipScheduleId}`,
  GET_SHIP_SCHEDULE_ATTENDANCE_HISTORY: (shipScheduleId) =>
    `/v1/attendance/${shipScheduleId}/logs`,
};

export default AttendanceEndpoint;
