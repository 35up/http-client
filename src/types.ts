export type THeaders = Record<string, string>;

export type TSearchParams = Record<string, string | string[]>;

export type TJson = boolean | number | string | null | TJsonArray | TJsonMap;

export type TJsonMap = { [key: string]: TJson };

export type TJsonArray = Array<TJson>;
