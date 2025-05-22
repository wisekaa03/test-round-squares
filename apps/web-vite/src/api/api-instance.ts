import { Api } from './Api';

export const swaggerApi = new Api({
  baseURL: `${import.meta.env.HTTP_API}://${import.meta.env.HOST_API}:${import.meta.env.PORT_API}`,
  timeout: 10000,
  headers: {
    'content-type': 'application/json',
  },
  validateStatus(status) {
    return status >= 200 && status < 300;
  },
  maxContentLength: Infinity,
});
