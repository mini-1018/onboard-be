import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
