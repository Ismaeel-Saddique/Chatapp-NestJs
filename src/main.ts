import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

const server = express();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors({
    origin: ['https://my-website-f156f.web.app'], 
      credentials: true
  });
  const port = process.env.PORT || 3000 || '0.0.0.0';
  await app.listen(port);
}
bootstrap();
