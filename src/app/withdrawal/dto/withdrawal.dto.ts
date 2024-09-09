import { IsString, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WithdrawalDto {
  @ApiProperty({
    description: 'ID da retirada',
    example: 'a4beab11-1661-4443-afb2-f06b41d50957',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'ID do investimento associado',
    example: 'dc7f6156-9b24-4552-a2b1-0cf2639fab65',
  })
  @IsString()
  investment_id: string;

  @ApiProperty({
    description: 'Valor da retirada',
    example: 10.00,
  })
  @IsNumber({}, { message: 'O valor deve ser um número' })
  amount: number;

  @ApiProperty({
    description: 'Valor líquido após impostos',
    example: 8.50,
  })
  @IsNumber({}, { message: 'O valor líquido deve ser um número' })
  net_amount: number;

  @ApiProperty({
    description: 'Imposto aplicado na retirada',
    example: 1.50,
  })
  @IsNumber({}, { message: 'O imposto aplicado deve ser um número' })
  tax_applied: number;

  @ApiProperty({
    description: 'Taxa de imposto aplicada',
    example: 15.00,
  })
  @IsNumber({}, { message: 'A taxa de imposto deve ser um número' })
  tax_rate: number;

  @ApiProperty({
    description: 'Data da retirada',
    example: '2024-09-06T19:58:54.932Z',
  })
  @IsDateString({}, { message: 'A data deve estar no formato ISO 8601' })
  withdrawal_date: Date;
}
