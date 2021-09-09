import { TSearchParams } from './types';


function isSearchParams(params: unknown): params is TSearchParams {
  return typeof params === 'object'
    && !!params
    && !Array.isArray(params);
}

function isValidParamValue(value: unknown): boolean {
  return ['string', 'number', 'boolean'].includes(typeof value)
    && !Number.isNaN(value)
    && value !== '';
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
    if (Array.isArray(value) && value.length) {
      query.append(key, value.filter(isValidParamValue).toString());
    } else if (isValidParamValue(value)) {
      query.append(key, value.toString());
    }
  });

  const queryString = query.toString();

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
