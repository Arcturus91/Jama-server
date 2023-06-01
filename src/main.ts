import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5005',
      'http://127.0.0.1:5173',
      'http://localhost:5173',
      'https://jamaapp-client-production.up.railway.app',
    ],
    credentials: true, // Set credentials to true
  });

  const port = app.get(ConfigService).get('PORT');
  await app.listen(port || 5005);
}
bootstrap();
