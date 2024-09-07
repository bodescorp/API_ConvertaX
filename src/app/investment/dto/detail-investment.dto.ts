import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { WithdrawalDto } from 'src/app/withdrawal/dto/withdrawal.dto';

export class InvestmentDetailsDto {
  @ApiProperty({
    description: 'O valor inicial do investimento',
    example: 1000,
  })
  @IsNumber()
  initial_amount: number;

  @ApiProperty({
    description: 'O saldo esperado do investimento',
    example: 1500.50,
  })
  @IsNumber()
  expectedBalance: number;

  @ApiProperty({
    description: 'O saldo atual do investimento após retiradas',
    example: 1200.75,
  })
  @IsNumber()
  current_balance: number;

  @ApiProperty({
    description: 'Detalhes das retiradas realizadas',
    type: [WithdrawalDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WithdrawalDto)
  withdrawals: WithdrawalDto[];
}
