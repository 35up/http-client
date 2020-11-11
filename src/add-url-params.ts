import { TSearchParams } from './types';


function isSearchParams(params: unknown): params is TSearchParams {
  return params && typeof params === 'object';
}

export function addUrlParams(
  url: string,
  params: TSearchParams | unknown = {},
): string {
  if (!isSearchParams(params)) {
    return url;
  }

  const [ baseUrl, queryParams ] = url.split('?');
  const query = new URLSearchParams(queryParams);

  Object.entries(params).forEach(([ key, value ]) => {
    if (value) {
      query.append(key, value.toString());
    }
  });

  const queryString = query.toString();

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
