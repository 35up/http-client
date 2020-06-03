import { encodeRequestBody } from './encode-request-body';
import { decodeResponseBody } from './decode-response-body';
import { addUrlParams } from './add-url-params';
import { TSearchParams, THeaders } from './types';
import { HttpError } from './http-error';

export type TRawHeaders = Record<string, string | (() => string)>;

export type THttpMethods = 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'
  | 'purge' | 'PURGE'
  | 'link' | 'LINK'
  | 'unlink' | 'UNLINK';

export type TMethod = (
  (endpointUrl: string, body?: any, options?: TOptions) =>
    Promise<any>
)

export type TOptions = {
  headers?: TRawHeaders;
  withCredentials?: boolean;
  mode?: RequestMode;
  params?: TSearchParams;
}

function parseHeaders(rawHeaders: TRawHeaders): THeaders {
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
  method: THttpMethods,
  baseUrl = '',
  defaultOptions: TOptions = {},
): TMethod => (
  async (
    endpointUrl: string,
    body = null,
    options: TOptions = {},
  ): Promise<any> => {
    const {
      withCredentials,
      mode,
      params: urlParams,
    } = { ...defaultOptions, ...options };

    let urlEncoded = `${baseUrl}${endpointUrl}`;
    urlEncoded = addUrlParams(urlEncoded, urlParams);
    let headers: TRawHeaders = {
      ...defaultOptions.headers,
      ...options.headers,
    };
    let params: RequestInit = {method};

    if (body) {
      const bodyParams = encodeRequestBody(body);
      headers = { ...bodyParams.headers, ...headers };
      params = {...params, ...bodyParams};
    }

    if (withCredentials) {
      params = {...params, credentials: 'include'};
    }

    if (mode) {
      params = {...params, mode};
    }

    params = {...params, headers: parseHeaders(headers)};

    const response = await fetch(urlEncoded, params);

    const data = method !== 'HEAD'
      ? await decodeResponseBody(response)
      : response;

    if (!response.ok) {
      throw new HttpError(data, response);
    }

    return data;
  }
);
