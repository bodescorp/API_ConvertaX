import { Module } from '@nestjs/common';
import { ViewModule } from './app/view/view.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './app/users/users.module';
import { AuthModule } from './app/auth/auth.module';
import { InvestmentModule } from './app/investment/investment.module';
import { TenantModule } from './tenant/tenant.module';
import { WithdrawalModule } from './app/withdrawal/withdrawal.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),ViewModule, DbModule, UsersModule, AuthModule, InvestmentModule, TenantModule, WithdrawalModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
