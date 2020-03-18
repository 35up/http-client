export type TEncondedRequest = {
  headers: HeadersInit;
  body: string | JSON | BodyInit;
}

function encodeRequestBodyURL(body: BodyInit): TEncondedRequest {
  return {
    body: body.toString(),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  };
}

function encodeRequestBodyMultiPart(body: BodyInit): TEncondedRequest {
  return {
    body,
    headers: {'Content-Type': 'multipart/form-data'},
  };
}

function encodeRequestBodyTextPlain(body: BodyInit): TEncondedRequest {
  return {
    body,
    headers: {'Content-Type': 'text/plain'},
  };
}

function encodeRequestBodyJSON(body: JSON): TEncondedRequest {
  return {
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
  };
}

export function encodeRequestBody(body: any): TEncondedRequest {
  if (body instanceof URLSearchParams) {
    return encodeRequestBodyURL(body);
  } if (body instanceof FormData) {
    return encodeRequestBodyMultiPart(body);
  } if (typeof body === 'string') {
    return encodeRequestBodyTextPlain(body);
  }
  return encodeRequestBodyJSON(body);
}
