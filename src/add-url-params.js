export function addUrlParams(url, params) {
  if (!params || typeof params !== 'object') {
    return url;
  }

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
