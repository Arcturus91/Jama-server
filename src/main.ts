import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(
    cookieSession({
      keys: ['jamaCookies'],
      httpOnly: false,
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5005'],
    credentials: true, // Set credentials to true
  });

  await app.listen(5005);
}
bootstrap();
