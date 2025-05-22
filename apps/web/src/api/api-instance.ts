import { Api } from './Api';

export const swaggerApi = new Api({
  baseURL: process.env.HTTP_SERVER,
  timeout: 10000,
  headers: {
    'content-type': 'application/json',
  },
  validateStatus(status) {
    return status >= 200 && status < 300;
  },
  maxContentLength: Infinity,
});
