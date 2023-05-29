import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(async function () {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;

  app.useStaticAssets(join(__dirname, '..', '..', '..', 'public'));

  app.listen(port, async () => {
    const url = await app.getUrl();

    console.log(`Server is running at ${url}`);
  });
})();
