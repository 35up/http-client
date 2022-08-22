if (!globalThis.fetch) {
  import('node-fetch').then(({default: fetch, Headers, Request, Response }) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Object.assign(globalThis, { fetch, Headers, Request, Response });
  });
}

export * from './index';
