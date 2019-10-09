import { createMethod } from './create-method';

export default {
  get: createMethod('GET'),
  post: createMethod('POST'),
  patch: createMethod('PATCH'),
  delete: createMethod('DELETE'),
  head: createMethod('HEAD'),
};
