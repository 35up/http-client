function encodeRequestBodyURL(body) {
  return {
    body: body.toString(),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  };
}

function encodeRequestBodyMultiPart(body) {
  return {
    body,
    headers: {'Content-Type': 'multipart/form-data'},
  };
}

function encodeRequestBodyTextPlain(body) {
  return {
    body,
    headers: {'Content-Type': 'text/plain'},
  };
}

function encodeRequestBodyJSON(body) {
  return {
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
  };
}

export function encodeRequestBody(body) {
  if (body instanceof URLSearchParams) {
    return encodeRequestBodyURL(body);
  } if (body instanceof FormData) {
    return encodeRequestBodyMultiPart(body);
  } if (typeof body === 'string') {
    return encodeRequestBodyTextPlain(body);
  }
  return encodeRequestBodyJSON(body);
}
