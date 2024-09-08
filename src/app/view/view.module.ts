import { Module } from '@nestjs/common';
import { ViewController } from './view.controller';
import { InvestmentService } from '../investment/investment.service';
import { InvestmentModule } from '../investment/investment.module';
import { InvestmentEntity } from 'src/db/entities/investment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { WithdrawalService } from '../withdrawal/withdrawal.service';
import { WithdrawalModule } from '../withdrawal/withdrawal.module';
import { WithdrawalEntity } from 'src/db/entities/withdrawal.entity';
import { UsersService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([InvestmentEntity,UserEntity, WithdrawalEntity]),InvestmentModule, AuthModule, WithdrawalModule, UserEntity], 
  controllers: [ViewController],
  providers: [InvestmentService,AuthService, WithdrawalService, UsersService],
})
export class ViewModule {}
