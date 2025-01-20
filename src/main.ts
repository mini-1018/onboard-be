import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  ),
    // 모든 도메인 허용
    app.enableCors();

  // 또는 상세 설정
  app.enableCors({
    origin: ['http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: false,
    allowedHeaders: ['Content-Type', 'Authorization', 'multipart/form-data'],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
