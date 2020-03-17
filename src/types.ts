export type TObject = Record<string, any>;

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

export type TRawHeaders = HeadersInit

export type TDefaultOptions = {
  [key: string]: any;
  headers?: HeadersInit;
  withCredentials?: boolean;
  mode?: RequestMode;
  params?: TObject;
}

export type TEncondedRequest = {
  headers: HeadersInit;
  body: string | JSON | BodyInit;
}
