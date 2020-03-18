export type TObject = Record<string, any>;

export type TBody = URLSearchParams | FormData | TObject | TObject[] | string;
