import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/utils/interceptor/logging.interceptor';
import cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './common/exceptions/globalException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      forbidNonWhitelisted: false,
    }),
  ),
    app.enableCors({
      origin: [process.env.NODE_ENV, process.env.NODE_ENV_WWW],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials',
        'Cookie',
      ],
    });

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
