const { generateApi } = require('swagger-typescript-api');
const path = require('path');

generateApi({
  name: 'api.ts',
  url: `${process.env.HTTP_API}://${process.env.HOST_API}:${process.env.PORT_API}/swagger.yml`,
  output: path.resolve(process.cwd(), 'apps/web-vite/src/api'),
  httpClientType: 'axios',
});
