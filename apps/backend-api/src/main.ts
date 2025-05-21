import { join as pathJoin } from 'path';
import { Logger } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const configService = app.get(ConfigService);
  const globalPrefix = configService.getOrThrow('API_PREFIX');
  const port = configService.getOrThrow('PORT');
  const staticAssets = pathJoin(`${__dirname}/../assets`);
  app.useStaticAssets({ root: staticAssets, dotfiles: 'deny' }).setGlobalPrefix(globalPrefix).enableShutdownHooks();

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
  SwaggerModule.setup(globalPrefix, app, swaggerDocument, swaggerOptions);

  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`, NestApplication.name);
}

bootstrap();
