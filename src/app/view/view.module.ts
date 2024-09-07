import { Module } from '@nestjs/common';
import { ViewController } from './view.controller';
import { InvestmentService } from '../investment/investment.service';
import { InvestmentModule } from '../investment/investment.module';
import { InvestmentEntity } from 'src/db/entities/investment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([InvestmentEntity,UserEntity]),InvestmentModule, AuthModule], 
  controllers: [ViewController],
  providers: [InvestmentService,AuthService],
})
export class ViewModule {}
