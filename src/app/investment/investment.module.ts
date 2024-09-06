import { Module } from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { InvestmentController } from './investment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentEntity } from 'src/db/entities/investment.entity';
import { UserEntity } from 'src/db/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvestmentEntity,UserEntity ])],
  controllers: [InvestmentController],
  providers: [InvestmentService],
  exports:[InvestmentService]

})
export class InvestmentModule {}
