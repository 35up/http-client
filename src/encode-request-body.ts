import { TObject, THeaders } from './types';

export interface EncondedRequest<T = string> {
  headers: THeaders;
  body: T extends string ? string : FormData;
}

function encodeRequestBodyURL(body: URLSearchParams): EncondedRequest {
  return {
    body: body.toString(),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  };
}

function encodeRequestBodyMultiPart(body: FormData): EncondedRequest<FormData> {
  return {
    body,
    headers: {'Content-Type': 'multipart/form-data'},
  };
}

function encodeRequestBodyTextPlain(body: string): EncondedRequest {
  return {
    body,
    headers: {'Content-Type': 'text/plain'},
  };
}

function encodeRequestBodyJSON(body: TObject | TObject[]): EncondedRequest {
  return {
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
  };
}

export function encodeRequestBody<T extends URLSearchParams>(
  body: T,
): EncondedRequest<string>;
export function encodeRequestBody<T extends FormData>(
  body: T,
): EncondedRequest<FormData>;
export function encodeRequestBody<T>(
  body: T,
): EncondedRequest<string>;
export function encodeRequestBody(
  body: any,
): EncondedRequest<string | FormData> {
  if (body instanceof URLSearchParams) {
    return encodeRequestBodyURL(body);
  } if (body instanceof FormData) {
    return encodeRequestBodyMultiPart(body);
  } if (typeof body === 'string') {
    return encodeRequestBodyTextPlain(body);
  }
  return encodeRequestBodyJSON(body);
}
