import { IsNumber, IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { WithdrawalDto } from 'src/app/withdrawal/dto/withdrawal.dto';

export class InvestmentDetailsDto {
  @ApiProperty({
    description: 'O ID do investimento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  id: string;
  
  @ApiProperty({
    description: 'O valor inicial do investimento',
    example: 1000,
  })
  @Type(() => Number)
  @IsNumber()
  initial_amount: number;

  @ApiProperty({
    description: 'O saldo esperado do investimento',
    example: 1500.50,
  })
  @Type(() => Number)
  @IsNumber()
  expected_balance: number;

  @ApiProperty({
    description: 'O saldo atual do investimento após retiradas',
    example: 1200.75,
  })
  @Type(() => Number)
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
