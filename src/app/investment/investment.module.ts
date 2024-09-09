import { Module } from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { InvestmentController } from './investment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentEntity } from 'src/db/entities/investment.entity';
import { UserEntity } from 'src/db/entities/user.entity';
import { WithdrawalEntity } from 'src/db/entities/withdrawal.entity';
import { RedisModule } from 'src/cache-redis/cache-redis.module';
import { RedisService } from 'src/cache-redis/redis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvestmentEntity, UserEntity, WithdrawalEntity]),
    RedisModule,
  ],
  controllers: [InvestmentController],
  providers: [InvestmentService, RedisService],
  exports: [InvestmentService],
})
export class InvestmentModule {}
