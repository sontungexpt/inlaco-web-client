export interface ErrorResponse {
  timestamp: string;
  path: string;
  data: any;
  status: number;
  errorCode: string;
  message: string;
}
