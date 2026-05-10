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
  pageable?: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  sort?: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
}

export type Filterable = {} & Record<
  string,
  string | number | object | boolean
>;

export interface PageParams<T = Filterable> {
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
