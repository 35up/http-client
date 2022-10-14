function getMessage(data: any): string {
  const error = data && data.error;
  if (error && typeof error === 'object') {
    return error.message;
  }

  return error;
}

export class HttpError extends Error {
  readonly responseStatus: number;
  readonly responseStatusText: string;

  constructor(public data: any, public response: Response) {
    super(getMessage(data) || `${response.status} ${response.statusText}`);
    this.responseStatus = response.status;
    this.responseStatusText = response.statusText;
  }
}

export function isHttpError(error: Error): error is HttpError {
  return 'response' in error;
}
