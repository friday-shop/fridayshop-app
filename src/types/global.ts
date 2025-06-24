export interface HttpResponsePagination<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}
