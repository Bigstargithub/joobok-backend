import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { json } from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get<string>('CLIENT_URL'),
    methods: 'GET, POST, PATCH, DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, accessToken',
  });

  app.use(json({ limit: '50mb' }));
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  await app.listen(8000);
}
bootstrap();
