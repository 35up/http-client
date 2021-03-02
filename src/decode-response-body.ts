const JSON_MIME_TYPES = [
  'application/json',
  'text/x-json',
];

function isJSON(contentType: string): boolean {
  return JSON_MIME_TYPES.some(
    mime => contentType.startsWith(mime),
  );
}

export async function decodeResponseBody(
  response: Response,
): Promise<any> {
  const contentType = response.headers.get('Content-Type');

  const text = await response.text();

  if (contentType && isJSON(contentType)) {
    return text ? JSON.parse(text) : {};
  }

  return text;
}
