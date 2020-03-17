const JSON_MIME_TYPES = [
  'application/json',
  'text/x-json',
];

function isJSON(contentType: string): boolean {
  return contentType && JSON_MIME_TYPES.some(
    mime => contentType.startsWith(mime),
  );
}

async function decodeJSON(response: Response): Promise<JSON> {
  return response.json();
}

async function decodeText(response): Promise<string> {
  return response.text();
}

export async function decodeResponseBody(
  response: Response,
): Promise<JSON | string> {
  const contentType = response.headers.get('Content-Type');

  if (isJSON(contentType)) {
    return decodeJSON(response);
  }

  return decodeText(response);
}