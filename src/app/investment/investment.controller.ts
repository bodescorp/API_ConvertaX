import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, Query } from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { ListInvestmentsDto } from './dto/list-investment.dto';
import { InvestmentDto } from './dto/investment.dto'; 
import { AuthGuard } from '../auth/auth.guard';
import { TenantInterceptor } from 'src/tenant/middleware/tenant.interceptor';
import { FindAllParameters } from './dto/findParameters-investment.dto';
import { InvestmentDetailsDto } from './dto/detail-investment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('investments')  
@UseGuards(AuthGuard)    
@UseInterceptors(TenantInterceptor)
@Controller('investment')
@Throttle({ default: { limit: 10, ttl: 600 } })

export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo investimento' })
  @ApiResponse({ status: 201, description: 'Investimento criado com sucesso.', type: InvestmentDetailsDto })
  async create(@Body() createInvestmentDto: CreateInvestmentDto): Promise<InvestmentDto> {
    return this.investmentService.create(createInvestmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os investimentos' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtra investimentos por status' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página para paginação' })
  @ApiQuery({ name: 'limit', required: false, description: 'Número de itens por página' })
  @ApiResponse({ status: 200, description: 'Lista de investimentos.', type: ListInvestmentsDto })
  async findAll(@Query() params: FindAllParameters): Promise<ListInvestmentsDto> {
    return this.investmentService.findAll(params);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obter detalhes de um investimento específico' })
  @ApiParam({ name: 'id', description: 'ID do investimento' })
  @ApiResponse({ status: 200, description: 'Detalhes do investimento.', type: InvestmentDetailsDto })
  @ApiResponse({ status: 404, description: 'Investimento não encontrado.' })
  async findOne(@Param('id') id: string): Promise<InvestmentDetailsDto> {
    return this.investmentService.findOne(id);
  }
}
