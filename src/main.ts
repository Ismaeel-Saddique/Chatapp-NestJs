import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://my-website-f156f.web.app'], 
      credentials: true
  });
  const port = process.env.PORT || 3000 || '0.0.0.0';
  await app.listen(port);
}
bootstrap();
