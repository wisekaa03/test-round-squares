const { generateApi } = require('swagger-typescript-api');
const path = require('path');

generateApi({
  name: 'api.ts',
  url: `http://${process.env.HOST_API}:${process.env.PORT_API}/swagger.yml`,
  output: path.resolve(process.cwd(), 'apps/web/src/api'),
  httpClientType: 'axios',
});
