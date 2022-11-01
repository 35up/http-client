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

export type TOptions = {
  headers?: TRawHeaders;
  withCredentials?: boolean;
  mode?: RequestMode;
  params?: TSearchParams;
}

export type THeadMethod = <TRequest>(
  endpointUrl: string,
  body?: TRequest,
  options?: TOptions,
) => Promise<Response>;

export type TMethod = <TRequest, TResponse = unknown>(
  endpointUrl: string,
  body?: TRequest,
  options?: TOptions,
) => Promise<TResponse | string>;


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

export function createMethod(
  method: 'HEAD' | 'head',
  baseUrl?: string,
  defaultOptions?: TOptions,
): THeadMethod;
export function createMethod(
  method: Exclude<THttpMethods, 'HEAD' | 'head'>,
  baseUrl?: string,
  defaultOptions?: TOptions,
): TMethod;
export function createMethod(
  method: THttpMethods,
  baseUrl = '',
  defaultOptions: TOptions = {},
): TMethod | THeadMethod {
  return async (
    endpointUrl: string,
    body = undefined,
    options: TOptions = {},
    // this any makes it so no mayor code changes have to be done to support
    // the type changes
  ): Promise<any> => {
    const {
      withCredentials,
      mode,
      params: urlParams,
    } = {...defaultOptions, ...options};

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

    const data = method !== 'HEAD' && method !== 'head'
      ? await decodeResponseBody(response)
      : response;

    if (!response.ok) {
      throw new HttpError(data, response);
    }

    return data;
  };
}
