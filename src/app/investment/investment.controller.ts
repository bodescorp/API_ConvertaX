import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Query } from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { TenantInterceptor } from 'src/tenant/middleware/tenant.interceptor';
import { InvestmentEntity } from 'src/db/entities/investment.entity';
import { FindAllParameters } from './dto/findParameters-investment.dto';

@UseGuards(AuthGuard)
@UseInterceptors(TenantInterceptor)

@Controller('investment')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @Post()
  async create(@Body() createInvestmentDto: CreateInvestmentDto):Promise<CreateInvestmentDto> {
    return await this.investmentService.create(createInvestmentDto);
  }

  @Get()
  async findAll(@Query() params: FindAllParameters):Promise<{investments:CreateInvestmentDto[];totalItems:number}> {
    return await this.investmentService.findAll(params);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string):Promise<CreateInvestmentDto> {
    return  await this.investmentService.findOne(id);
  }
}
