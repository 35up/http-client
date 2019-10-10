import { createMethod } from './create-method';
import { encodeRequestBody } from './encode-request-body';
import { decodeResponseBody } from './decode-response-body';

export default {
  get: createMethod('GET'),
  post: createMethod('POST'),
  patch: createMethod('PATCH'),
  delete: createMethod('DELETE'),
  head: createMethod('HEAD'),
  createMethod,
  decodeResponseBody,
  encodeRequestBody,
};
