import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber } from 'class-validator';

export class CreateInvestmentDto {
  @ApiProperty({
    description: 'O valor inicial do investimento',
    example: 1000,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'O valor inicial deve ser um número.' })
  initial_amount: number;

  @ApiProperty({
    description: 'A data de criação do investimento',
    example: '2024-09-07',
  })
  @IsDateString({}, { message: 'A data de criação deve estar no formato ISO 8601.' })
  creation_date: Date;
}
