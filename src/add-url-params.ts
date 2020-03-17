import { TObject } from './types';

export function addUrlParams(url: string, params: TObject): string {
  const [ baseUrl, queryParams ] = url.split('?');
  const query = new URLSearchParams(queryParams);

  Object.entries(params).forEach(([ key, value ]) => {
    if (value) {
      query.append(key, value);
    }
  });

  const queryString = query.toString();

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
