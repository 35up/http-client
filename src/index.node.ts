import fetch, { Headers, Request, Response } from 'node-fetch';

if (!globalThis.fetch) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Object.assign(globalThis, { fetch, Headers, Request, Response });
}

export * from './index';
