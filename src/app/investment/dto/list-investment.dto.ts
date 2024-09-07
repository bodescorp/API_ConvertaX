import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';
import { InvestmentDto } from './investment.dto';

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
  @IsNumber()
  totalItems: number;

  @ApiProperty({
    description: 'Número total de páginas',
    example: 10,
  })
  @IsNumber()
  totalPages: number;
}
