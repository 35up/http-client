/* eslint-disable @typescript-eslint/ban-types, no-var, vars-on-top */
/* eslint-disable @typescript-eslint/naming-convention */
import importedFetch, {
  Headers,
  Request,
  Response as ImportedResponse,
  RequestMode as ImportedRequestMode,
} from 'node-fetch';

declare global {
  // @ts-ignore we dont have separate tsconfig for node and browser, but
  // importers of the library are not using browser symbols, so this is
  // needed for them
  var fetch: typeof importedFetch;
  type Response = ImportedResponse;
  type RequestMode = ImportedRequestMode;
  type FormData = unknown;
}

if (!globalThis.fetch) {
  globalThis.fetch = importedFetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = ImportedResponse;
}

export * from './index';
