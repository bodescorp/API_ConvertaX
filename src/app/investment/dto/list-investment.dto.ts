import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';
import { InvestmentDto } from './investment.dto';
import { Type } from 'class-transformer';

export class ListInvestmentsDto {
  @ApiProperty({
    description: 'Lista de investimentos',
    type: [InvestmentDto], 
  })
  @IsArray()
  investments: InvestmentDto[];

  @ApiProperty({
    description: 'Número total de itens',
    example: 100,
  })
  
  @Type(() => Number)
  @IsNumber()
  totalItems: number;

  @ApiProperty({
    description: 'Número total de páginas',
    example: 10,
  })
  @Type(() => Number)
  @IsNumber()
  totalPages: number;
}
