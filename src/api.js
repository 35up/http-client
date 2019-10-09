import { createMethod } from './create-method';

export default {
  get: createMethod('GET'),
  post: createMethod('POST'),
};
