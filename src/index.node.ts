import importedFetch, {
  Headers,
  Request,
  Response,
} from 'node-fetch';

if (!globalThis.fetch) {
  globalThis.fetch = importedFetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
}

export * from './index';
