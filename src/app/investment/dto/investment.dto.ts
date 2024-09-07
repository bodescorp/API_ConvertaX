import { IsString, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InvestmentStatusEnum } from './investment.enum';

export class InvestmentDto {
  @ApiProperty({
    description: 'O ID do investimento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'O ID do proprietário do investimento',
    example: 'owner-123',
  })
  @IsString()
  id_owner: string;

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

  @ApiProperty({
    description: 'O status do investimento',
    enum: InvestmentStatusEnum,
    example: InvestmentStatusEnum.active,
  })
  @IsEnum(InvestmentStatusEnum, { message: 'O status deve ser "active" ou "closed"' })
  status: InvestmentStatusEnum;

  @ApiProperty({
    description: 'O saldo atual do investimento',
    example: 1050,
  })
  @IsNumber()
  current_balance: number;
}
