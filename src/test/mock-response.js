export function mockResponse(response, configuration = {}) {
  return fetch.mockResponse(response, configuration);
}

export function mockOneResponse(response, configuration = {}) {
  return fetch.once(response, configuration);
}

export function mockOneJsonResponse(response, configuration = {}) {
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

export function resetRequestMocks() {
  fetch.resetMocks();
}
