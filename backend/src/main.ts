// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

const frontendUrl = process.env.FRONTEND_URL; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Increase body size limit to 50MB for base64 images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      frontendUrl,
    ];

    // Permite chamadas server-to-server e preflight
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // ❌ Nunca lance Error aqui
    return callback(null, false);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
});



  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
