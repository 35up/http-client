function getMessage(data: unknown): string {
  const error = data && 'error' in data && data.error;
  if (error && typeof error === 'object') {
    return error.message;
  }

  return error;
}

export class HttpError<TData = unknown> extends Error {
  readonly responseStatus: number;
  readonly responseStatusText: string;
  readonly data: TData;

  constructor(public responseData: TData, public response: Response) {
    super(
      getMessage(responseData) || `${response.status} ${response.statusText}`,
    );
    this.responseStatus = response.status;
    this.responseStatusText = response.statusText;
    this.data = responseData;
  }
}

export function isHttpError<TData = unknown>(
  error: Error,
): error is HttpError<TData> {
  return 'response' in error;
}
