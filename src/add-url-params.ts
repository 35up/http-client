import { TSearchParams } from './types';


function isArrayOfStringsAndNumbers(
  maybeStringsAndNumbers: unknown,
): maybeStringsAndNumbers is (string | number)[] {
  if (!Array.isArray(maybeStringsAndNumbers)) return false;

  return !maybeStringsAndNumbers.some(maybeStringOrNumber => (
    typeof maybeStringOrNumber !== 'string'
    && typeof maybeStringOrNumber !== 'number'
  ));
}

function isSearchParams(params: unknown): params is TSearchParams {
  return !!params
    && typeof params === 'object'
    && !Array.isArray(params)
    && !(
      Object.values(params || {})
        .some(value => (
          typeof value !== 'string'
          && typeof value !== 'number'
          && !isArrayOfStringsAndNumbers(value)
        ))
    );
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
