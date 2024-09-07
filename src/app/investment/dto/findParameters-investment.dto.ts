import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { InvestmentStatusEnum } from './investment.enum';
import { Type } from 'class-transformer';

export class FindAllParameters {
  @ApiPropertyOptional({
    description: 'O status dos investimentos para filtrar (ex: "active" ou "closed")',
    example: 'active',
    enum: InvestmentStatusEnum,
  })
  @IsOptional()
  @IsEnum(InvestmentStatusEnum, { message: 'Status deve ser "active" ou "closed"' })
  status?: InvestmentStatusEnum;

  @ApiPropertyOptional({
    description: 'Número da página para paginação',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)

  @IsNumber()
  page?: number;

  @ApiPropertyOptional({
    description: 'Limite de itens por página para paginação',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}