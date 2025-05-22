import { writeFile } from 'node:fs/promises';
import { join as pathJoin } from 'path';
import { dump as yamlDump } from 'js-yaml';
import { Logger } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const staticAssets = pathJoin(`${__dirname}/assets`);

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const configService = app.get(ConfigService);
  const globalPrefix = configService.getOrThrow('API_PREFIX');
  const port = configService.getOrThrow('PORT_API');

  app
    .useStaticAssets({ root: staticAssets, dotfiles: 'deny' })
    .setGlobalPrefix(globalPrefix)
    .enableShutdownHooks()
    .enableCors({
      credentials: true,
      origin: '*',
    });

  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth({
      type: 'http',
      description: 'Токен авторизации',
      name: 'token',
    })
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  const swaggerOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  async function yamlSwagger() {
    const swaggerYml = pathJoin(staticAssets, 'swagger.yml');
    const yamlDocument = yamlDump(swaggerDocument, {
      quotingType: '"',
      skipInvalid: true,
    });
    await writeFile(swaggerYml, yamlDocument);
    Logger.debug(`The file '${swaggerYml}' has been writed`, NestApplication.name);
  }
  yamlSwagger();
  SwaggerModule.setup(globalPrefix, app, swaggerDocument, swaggerOptions);

  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`, NestApplication.name);
}

bootstrap();
