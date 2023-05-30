import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  /*   app.use(
    cookieSession({
      keys: ['jamaCookies'],
      httpOnly: false,
    }),
  ); */

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
    ],
    credentials: true, // Set credentials to true
  });

  const port = app.get(ConfigService).get('PORT');
  await app.listen(port || 5005);
}
bootstrap();
