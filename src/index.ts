import { createMethod } from './create-method';

export { createMethod } from './create-method';
export { encodeRequestBody } from './encode-request-body';
export { decodeResponseBody } from './decode-response-body';
export { addUrlParams } from './add-url-params';
export { HttpError, isHttpError } from './http-error';

export const get = createMethod('GET');
export const post = createMethod('POST');
export const put = createMethod('PUT');
export const patch = createMethod('PATCH');
export const deleteMethod = createMethod('DELETE');
export const head = createMethod('HEAD');

export default createMethod;
