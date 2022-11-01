const JSON_MIME_TYPES = [
  'application/json',
  'text/x-json',
];

function isJson(contentType: string): boolean {
  return JSON_MIME_TYPES.some(
    mime => contentType.startsWith(mime),
  );
}

export async function decodeResponseBody<T>(
  response: Response,
): Promise<T | string> {
  const contentType = response.headers.get('Content-Type');

  const text = await response.text();

  if (contentType && isJson(contentType)) {
    return text ? JSON.parse(text) : null;
  }

  return text;
}
