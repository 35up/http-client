import { TSearchParams } from './types';


function isSearchParams(params: unknown): params is TSearchParams {
  return params instanceof URLSearchParams || (
    typeof params === 'object'
      && !!params
      && !Array.isArray(params)
  );
}

function isValidParamValue(value: unknown): boolean {
  return ['string', 'number', 'boolean'].includes(typeof value)
    && !Number.isNaN(value)
    && value !== '';
}

function getParamsEntries(
  params: TSearchParams,
): [string, string | number | (string | number)[]][] {
  if (params instanceof URLSearchParams) {
    return [...params.entries()];
  }

  return Object.entries(params);
}

function appendValue(query: URLSearchParams, key: string, value: string): void {
  if (query.has(key)) {
    query.set(key, `${query.get(key)},${value}`);
  } else {
    query.set(key, value);
  }
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

  getParamsEntries(params).forEach(([ key, value ]) => {
    if (Array.isArray(value) && value.length) {
      appendValue(query, key, value.filter(isValidParamValue).join(','));
    } else if (isValidParamValue(value)) {
      appendValue(query, key, value.toString());
    }
  });

  const queryString = query.toString();

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
