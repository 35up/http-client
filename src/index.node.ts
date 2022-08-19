import fetch, { Headers, Request, Response } from 'node-fetch';

if (!globalThis.fetch) {
  Object.assign(globalThis, { fetch, Headers, Request, Response });
}

export * from './index';
