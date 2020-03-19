import fetch, { FetchMock, MockParams } from 'jest-fetch-mock';
import { TJson } from '../types';

export function mockOneResponse(
  response: string,
  configuration: MockParams = {},
): FetchMock {
  return fetch.once(response, configuration);
}

export function mockOneJsonResponse(
  response: TJson,
  configuration: MockParams = {},
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
