const JSON_MIME_TYPES = [
  'application/json',
  'text/x-json',
];

function isJSON(contentType) {
  return contentType && JSON_MIME_TYPES.some(
    mime => contentType.startsWith(mime),
  );
}

async function decodeJSON(response) {
  return response.json();
}

async function decodeText(response) {
  return response.text();
}

export async function decodeResponseBody(response) {
  const contentType = response.headers.get('Content-Type');

  if (isJSON(contentType)) {
    return decodeJSON(response);
  }

  return decodeText(response);
}
