import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import helmet from 'helmet';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      limit: 10, // Limite de requisições por IP
      ttl: 60,  // Tempo de expiração do limite
    }]),
  ],
  providers: [],
  exports: [],
})
export class InfrastructureModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(helmet({
        contentSecurityPolicy: process.env.CSP_ENABLED === 'true' ? undefined : false,
      }))
      .forRoutes('*');
  }
}
