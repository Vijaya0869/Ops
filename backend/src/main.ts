import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
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
