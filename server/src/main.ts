import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(async function () {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  app.enableCors();

  app.listen(port, async () => {
    const url = await app.getUrl();

    console.log(`Server is running at ${url}`);
  });
})();
