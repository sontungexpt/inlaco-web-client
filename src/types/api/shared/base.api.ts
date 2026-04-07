export interface PageableResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // the page number
  pageSize: number;
  size: number;
  numberOfElements: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

export interface PageParams<T = Record<string, any>> {
  page?: number;
  pageSize?: number;
  sort?: string;
  filter?: T;
}

export interface ErrorResponse {
  timestamp: string;
  path: string;
  data: any;
  status: number;
  errorCode: string;
  message: string;
}
