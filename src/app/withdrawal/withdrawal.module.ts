import { Module } from '@nestjs/common';
import { WithdrawalService } from './withdrawal.service';
import { WithdrawalController } from './withdrawal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawalEntity } from 'src/db/entities/withdrawal.entity';
import { InvestmentEntity } from 'src/db/entities/investment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WithdrawalEntity, InvestmentEntity ])],
  controllers: [WithdrawalController],
  providers: [WithdrawalService],
  exports:[WithdrawalService]

})
export class WithdrawalModule {}
