export type THeaders = Record<string, string>;

export type TSearchParams = Record<
  string,
  string | number | (string | number)[]
> | URLSearchParams;
