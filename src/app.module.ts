import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ViewModule } from './app/view/view.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './app/users/users.module';
import { AuthModule } from './app/auth/auth.module';
import { InvestmentModule } from './app/investment/investment.module';
import { TenantModule } from './app/tenant/tenant.module';
import { WithdrawalModule } from './app/withdrawal/withdrawal.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { RedisModule } from './cache-redis/cache-redis.module';
import { APP_FILTER } from '@nestjs/core';
import { ViewExceptionFilter } from './app/view/middleware/viewExceptionFilter';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ViewModule,
    DbModule,
    UsersModule,
    AuthModule,
    InvestmentModule,
    TenantModule,
    WithdrawalModule,
    InfrastructureModule,
    RedisModule,
  ],
  controllers: [],
  providers: [{
    provide: APP_FILTER,
    useClass: ViewExceptionFilter,
  }],
})
export class AppModule { }
