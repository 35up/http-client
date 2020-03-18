import { encodeRequestBody } from './encode-request-body';
import { decodeResponseBody } from './decode-response-body';
import { addUrlParams } from './add-url-params';
import { TObject, TBody } from './types';

export type TMethods = 'get' | 'GET'
| 'delete' | 'DELETE'
| 'head' | 'HEAD'
| 'options' | 'OPTIONS'
| 'post' | 'POST'
| 'put' | 'PUT'
| 'patch' | 'PATCH'
| 'purge' | 'PURGE'
| 'link' | 'LINK'
| 'unlink' | 'UNLINK';

export type TMethodError = Error & {
  data?: any;
  response?: Response;
}

export type TDefaultOptions = TObject & {
  headers?: HeadersInit;
  withCredentials?: boolean;
  mode?: RequestMode;
  params?: TObject;
}

function generateError(data: any, response: Response): TMethodError {
  const error: TMethodError = new Error(
    (data && data.error) || `${response.status} ${response.statusText}`,
  );
  error.data = data;
  error.response = response;
  return error;
}

function parseHeaders(rawHeaders: HeadersInit): HeadersInit {
  const headersEntries = Object.entries(rawHeaders)
    .map(([ key, value ]) => [
      key,
      typeof value === 'function' ? value() : value,
    ]);

  return headersEntries.reduce((headers, [ key, value ]) => ({
    ...headers,
    [key]: value,
  }), {});
}

export const createMethod = (
  method: TMethods,
  baseUrl = '',
  defaultOptions: TDefaultOptions = {},
) => (
  async (
    endpointUrl: string,
    body: TBody = null,
    options: TDefaultOptions = {},
  ): Promise<string | Response | JSON | TMethodError> => {
    const {
      withCredentials,
      mode,
      params: urlParams,
      headers,
    } = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    let urlEncoded = `${baseUrl}${endpointUrl}`;
    urlEncoded = addUrlParams(urlEncoded, urlParams);

    let params: TDefaultOptions = {method, headers};

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
