export type Pageable<T> = {
  data: T[];
  meta: {
    limit: number;
    page: number;
  }
}
