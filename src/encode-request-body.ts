import { TBody, TObject } from './types';

export type TEncondedRequest = {
  headers: HeadersInit;
  body: TBody;
}

function encodeRequestBodyURL(body: TBody): TEncondedRequest {
  return {
    body: body.toString(),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  };
}

function encodeRequestBodyMultiPart(body: TBody): TEncondedRequest {
  return {
    body,
    headers: {'Content-Type': 'multipart/form-data'},
  };
}

function encodeRequestBodyTextPlain(body: TBody): TEncondedRequest {
  return {
    body,
    headers: {'Content-Type': 'text/plain'},
  };
}

function encodeRequestBodyJSON(body: TObject | TObject[]): TEncondedRequest {
  return {
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
  };
}

export function encodeRequestBody(body: TBody): TEncondedRequest {
  if (body instanceof URLSearchParams) {
    return encodeRequestBodyURL(body);
  } if (body instanceof FormData) {
    return encodeRequestBodyMultiPart(body);
  } if (typeof body === 'string') {
    return encodeRequestBodyTextPlain(body);
  }
  return encodeRequestBodyJSON(body);
}
