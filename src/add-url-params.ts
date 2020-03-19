import { TSearchParams } from './types';

export function addUrlParams(
  url: string,
  params: TSearchParams = {},
): string {
  if (!params || typeof params !== 'object') {
    return url;
  }

  const [ baseUrl, queryParams ] = url.split('?');
  const query = new URLSearchParams(queryParams);

  Object.entries(params).forEach(([ key, value ]) => {
    if (value) {
      query.append(key, value.toLocaleString());
    }
  });

  const queryString = query.toString();

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
