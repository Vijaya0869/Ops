import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Reflecting any origin (origin: true) would let any website make
  // credentialed requests on a signed-in user's behalf. Only the
  // configured frontend (plus local dev ports) may call this API.
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:8080',
    'http://localhost:5173',
  ].filter((origin): origin is string => Boolean(origin));
  app.enableCors({ origin: allowedOrigins, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ops API')
    .setDescription('REI Dashboard backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);
  // Photos/avatars are public; property documents are served through an
  // authenticated download endpoint instead, not this static mount.
  app.useStaticAssets(join(process.cwd(), 'uploads', 'photos'), {
    prefix: '/uploads/photos/',
  });
  app.useStaticAssets(join(process.cwd(), 'uploads', 'avatars'), {
    prefix: '/uploads/avatars/',
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
