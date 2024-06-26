import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';


dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {bodyParser:false});

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.use((req, res, next) => {
    console.log(`GOT INVOKED: ${req.originalUrl}`);
    next();
  });

  await app.listen(process.env.PROXY_PORT || 3001, () => {
    console.log(`listening at ${process.env.PROXY_PORT}/${globalPrefix}`);
    
  });
}
bootstrap();
