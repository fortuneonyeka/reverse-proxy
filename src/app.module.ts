import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReverseProxyAuthMiddleware } from './middleware/proxy-auth.middleware';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer:MiddlewareConsumer) {
    consumer.apply(ReverseProxyAuthMiddleware).forRoutes({path: 'v1/auth-service/*', method: RequestMethod.ALL})
  }
}
