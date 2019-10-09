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

export const createMethod = (method, baseUrl = '', defaultOptions = {}) => async (endpointUrl, body = null, options = {}) => {
  const { withCredentials, mode } = {...defaultOptions, ...options};
  const urlEncoded = `${baseUrl}${endpointUrl}`;
  let params = {method};

  if (body) {
    params = {...params, ...encodeRequestBody(body)};
  }

  if (withCredentials) {
    params = {...params, credentials: 'include'};
  }

  if (mode) {
    params = {...params, mode};
  }

  const response = await fetch(urlEncoded, params);

  const data = method !== 'HEAD'
    ? await decodeResponseBody(response)
    : response;

  if (!response.ok) {
    throw generateError(data, response);
  }

  return data;
};
