import { Api } from './Api';
import { backendServer } from './constants';

export const swaggerApi = new Api({
  baseURL: backendServer,
  timeout: 10000,
  headers: {
    'content-type': 'application/json',
  },
  validateStatus(status) {
    return status >= 200 && status < 300;
  },
  maxContentLength: Infinity,
});
