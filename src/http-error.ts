function getMessage(data: any): string {
  const error = data && data.error;
  if (error && typeof error === 'object') {
    return error.message;
  }

  return error;
}

export class HttpError extends Error {
  constructor(public data: any, public response: Response) {
    super(getMessage(data) || `${response.status} ${response.statusText}`);
  }
}
