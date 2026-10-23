import { existsSync } from 'fs';
import { resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

// Load scoped environment variables for apps/api
for (const envCandidate of ['.env.local', '.env']) {
  const envPath = resolve(process.cwd(), envCandidate);
  if (existsSync(envPath) && typeof (process as any).loadEnvFile === 'function') {
    try {
      (process as any).loadEnvFile(envPath);
      break;
    } catch {
      // Continue if parsing fails or already set
    }
  }
}

function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      sanitizeObject(obj[key]);
    }
  }
  return obj;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security: HTTP headers protection
  app.use(helmet());

  // Security: Prevent NoSQL Injection safely without mutating Express 5 read-only query getters
  app.use((req: any, _res: any, next: any) => {
    if (req.body) sanitizeObject(req.body);
    if (req.params) sanitizeObject(req.params);
    next();
  });

  // Security: Prevent DoS via large payloads by explicitly setting body parser limits
  const express = await import('express');
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ limit: '5mb', extended: true }));

  // Production CORS: Supports Vercel production, Vercel previews, comma-separated domains, and local dev
  const configuredOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (requestOrigin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (such as mobile apps, curl, or server-to-server calls)
      if (!requestOrigin) {
        return callback(null, true);
      }

      const isAllowed =
        configuredOrigins.includes(requestOrigin) ||
        requestOrigin.includes('localhost') ||
        /\.vercel\.app$/.test(new URL(requestOrigin).hostname);

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked request from origin: ${requestOrigin}`));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Security: Global input validation to strip unwhitelisted fields and prevent injection
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
