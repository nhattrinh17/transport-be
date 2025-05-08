import { NestFactory } from '@nestjs/core';

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import helmet from '@fastify/helmet';
import { AppModule } from './app.module';
import { Cluster } from './cluster';
import { processENV, validateEnvironmentVars } from './config/configuration';

import { setupSwagger } from './setup-swagger';
import fastyfyMultipart from '@fastify/multipart';
import { LoggingInterceptor, TransformInterceptor } from '@common/interceptors';
import { HttpExceptionFilter } from '@common/filters';
import { ValidationPipe } from '@common/pipes';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), { cors: true });

  validateEnvironmentVars();
  // app.enable('trust proxy');// only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

  // app.setGlobalPrefix('/api'); //use api as global prefix if you don't have subdomain
  await app.register(helmet);
  app.register(fastyfyMultipart, {
    limits: {
      fileSize: 50 * 1024 * 1024, // Giới hạn kích thước tệp là 100MB
    },
  });

  app.enableVersioning();
  // const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  // if (!configService.isDevelopment) {
  app.enableShutdownHooks();
  // }
  processENV().enableDocumentation && setupSwagger(app);
  await app.listen(processENV().server.port, '0.0.0.0');

  console.info(`server running on ${await app.getUrl()}`);
}

Cluster.createCluster(bootstrap);
