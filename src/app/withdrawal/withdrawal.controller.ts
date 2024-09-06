import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WithdrawalService } from './withdrawal.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('withdrawal')
export class WithdrawalController {
  constructor(private readonly withdrawalService: WithdrawalService) {}

  @Post("/:investmentId")
  async create(@Param('investmentId') investmentId: string, @Body() createWithdrawalDto: CreateWithdrawalDto) {
    return await this.withdrawalService.create(investmentId,createWithdrawalDto);
  }
}
