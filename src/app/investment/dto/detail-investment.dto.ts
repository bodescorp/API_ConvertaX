import { IsNumber, IsOptional, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { WithdrawalDto } from 'src/app/withdrawal/dto/withdrawal.dto';

export class InvestmentDetailsDto {
  @IsNumber()
  initial_amount: number;

  @IsNumber()
  expectedBalance: number;

  @IsNumber()
  current_balance: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WithdrawalDto) // Converte os itens da lista para o tipo WithdrawalDto
  withdrawals: WithdrawalDto[];
}
