import { encodeRequestBody } from './encode-request-body';
import { decodeResponseBody } from './decode-response-body';

function generateError(data, response) {
  const error = new Error(
    (data && data.error) || `${response.status} ${response.statusText}`,
  );
  error.data = data;
  error.response = response;
  return error;
}

function parseHeaders(headers) {
  return Object.fromEntries(
    Object.entries(headers)
      .map(([ key, value ]) => [
        key,
        typeof value === 'function' ? value.call() : value,
      ]),
  );
}

export const createMethod = (method, baseUrl = '', defaultOptions = {}) => (
  async (endpointUrl, body = null, options = {}) => {
    const { withCredentials, mode, headers } = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };
    const urlEncoded = `${baseUrl}${endpointUrl}`;
    let params = {method, headers};

    if (body) {
      const bodyParams = encodeRequestBody(body);
      params = {
        ...params,
        ...bodyParams,
        headers: {
          ...bodyParams.headers,
          ...params.headers,
        },
      };
    }

    if (withCredentials) {
      params = {...params, credentials: 'include'};
    }

    if (mode) {
      params = {...params, mode};
    }

    params = {...params, headers: parseHeaders(params.headers)};

    const response = await fetch(urlEncoded, params);

    const data = method !== 'HEAD'
      ? await decodeResponseBody(response)
      : response;

    if (!response.ok) {
      throw generateError(data, response);
    }

    return data;
  }
);
