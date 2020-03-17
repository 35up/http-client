import fetch, { FetchMock } from 'jest-fetch-mock';
import { TObject } from '../types';

export function mockOneResponse(
  response: string,
  configuration: TObject = {},
): FetchMock {
  return fetch.once(response, configuration);
}

export function mockOneJsonResponse(
  response: TObject,
  configuration: TObject = {},
): FetchMock {
  return mockOneResponse(
    JSON.stringify(response),
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Pages': '1',
      },
      ...configuration,
    },
  );
}

export function resetRequestMocks(): void {
  fetch.resetMocks();
}
