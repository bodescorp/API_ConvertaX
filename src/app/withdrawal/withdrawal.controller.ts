import { Controller, Post, Body, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { WithdrawalService } from './withdrawal.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { AuthGuard } from '../auth/auth.guard';
import { TenantInterceptor } from 'src/tenant/middleware/tenant.interceptor';
import { WithdrawalDto } from './dto/withdrawal.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('withdrawals')
@UseGuards(AuthGuard)
@UseInterceptors(TenantInterceptor)
@Controller('withdrawal')
@Throttle({ default: { limit: 10, ttl: 600 } })
export class WithdrawalController {
  constructor(private readonly withdrawalService: WithdrawalService) {}

  @Post('/:investmentId')
  @ApiOperation({ summary: 'Cria uma nova retirada para um investimento específico' })
  @ApiParam({
    name: 'investmentId',
    type: String,
    description: 'ID do investimento para o qual a retirada será feita',
  })
  @ApiResponse({
    status: 201,
    description: 'Retirada criada com sucesso',
    type: WithdrawalDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Investimento não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Saldo insuficiente para a retirada',
  })
  async create(
    @Param('investmentId') investmentId: string,
    @Body() createWithdrawalDto: CreateWithdrawalDto
  ): Promise<WithdrawalDto> {
    return await this.withdrawalService.create(investmentId, createWithdrawalDto);
  }
}
