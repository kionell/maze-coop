import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

(async function () {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = 3000;

  app.listen(port, () => {
    console.log(`Server is running: http://127.0.0.1:${port}/`);
  });
})();
