import { THeaders } from './types';

export interface EncodedRequest<T extends string | FormData | URLSearchParams> {
  headers?: THeaders;
  body: T;
}

function encodeRequestBodyJson(body: unknown): EncodedRequest<string> {
  return {
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
  };
}

export function encodeRequestBody<T extends URLSearchParams>(
  body: T,
): EncodedRequest<URLSearchParams>;
export function encodeRequestBody<T extends FormData>(
  body: T,
): EncodedRequest<FormData>;
export function encodeRequestBody<T>(
  body: T,
): EncodedRequest<string>;
export function encodeRequestBody(
  body: unknown,
): EncodedRequest<string | FormData> {
  if (
    body instanceof URLSearchParams
    || (typeof FormData !== 'undefined' && body instanceof FormData)
    || typeof body === 'string'
  ) {
    return {body};
  }

  return encodeRequestBodyJson(body);
}
