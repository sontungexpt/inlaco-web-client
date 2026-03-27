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

export interface PageParams {
  page?: number;
  pageSize?: number;
  sort?: string;
}
