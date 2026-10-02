import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security: HTTP headers protection
  app.use(helmet());

  // Security: Prevent NoSQL Injection
  app.use(mongoSanitize());

  // Security: Prevent DoS via large payloads by explicitly setting body parser limits
  const express = await import('express');
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ limit: '5mb', extended: true }));

  // Security: Stricter CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Security: Global input validation to strip unwhitelisted fields and prevent injection
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
