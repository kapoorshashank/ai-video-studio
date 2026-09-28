import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:4200';

  app.setGlobalPrefix('api');
  app.enableCors({ origin: frontendOrigin });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

void bootstrap();
