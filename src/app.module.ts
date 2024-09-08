import { Module } from '@nestjs/common';
import { ViewModule } from './app/view/view.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './app/users/users.module';
import { AuthModule } from './app/auth/auth.module';
import { InvestmentModule } from './app/investment/investment.module';
import { TenantModule } from './tenant/tenant.module';
import { WithdrawalModule } from './app/withdrawal/withdrawal.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ViewModule, DbModule, UsersModule, AuthModule, InvestmentModule, TenantModule, WithdrawalModule,
    ThrottlerModule.forRoot([{ limit: 10, ttl: 600 }]),],
  controllers: [],
  providers: [],
})
export class AppModule { }
