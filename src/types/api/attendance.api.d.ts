export type CheckType = "IN" | "OUT";
export type AttendanceMethod = "QR_CODE" | "";

export interface AttendanceQRCodeResponse {
  token: string;
}
