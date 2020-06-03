export class HttpError extends Error {
  constructor(public data: any, public response: Response) {
    super(
      (data && data.error) || `${response.status} ${response.statusText}`,
    );
  }
}
