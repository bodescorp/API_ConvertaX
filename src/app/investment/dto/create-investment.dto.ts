import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';

export class CreateInvestmentDto {
  @ApiProperty({
    description: 'O valor inicial do investimento',
    example: 1000,
  })
  @IsNumber()
  initial_amount: number;

  @ApiProperty({
    description: 'A data de criação do investimento',
    example: '2024-09-07',
  })
  @IsDateString()
  creation_date: Date;
}
