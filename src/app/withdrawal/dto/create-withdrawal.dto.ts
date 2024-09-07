import { IsNumber } from 'class-validator';

export class CreateWithdrawalDto {
  @IsNumber()
  amount: number;
}
