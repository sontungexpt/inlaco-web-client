import { PageParams } from "./shared/base.api";

export type CheckType = "IN" | "OUT";
export type AttendanceMethod = "QR_CODE" | "";

export interface AttendanceQRCodeResponse {
  token: string;
}

export interface AttendanceLogResponse {
  id: string;
  crewEmployeeCardId?: string;
  crewProfileId?: string;
  crewName?: string;
  crewRankOnBoard?: string;
  shipScheduleId: string;
  timestamp: string;
  checkType: CheckType;
  method: AttendanceMethod;
  location?: string;
  note?: string;
  createdAt?: string;
}

export type AttendanceLogsSearchCriteria = {
  shipScheduleId: string;
  checkType: CheckType;
  method: AttendanceMethod;
  location: string;
  keyword: string;
  crewAccountId: string;
  startTime: string;
  endTime: string;
};

export type FetchAttendanceLogsParams =
  PageParams<AttendanceLogsSearchCriteria>;
