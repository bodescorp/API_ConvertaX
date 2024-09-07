import { IsDateString, IsNumber, IsString } from 'class-validator';

export class WithdrawalDto {
    @IsString()
    id: string;

    @IsString()
    investment_id: string;

    @IsNumber()
    amount: number;

    @IsNumber()
    net_amount: number;

    @IsNumber()
    tax_applied: number;

    @IsNumber()
    tax_rate: number;

    @IsDateString()
    withdrawal_date: Date;
}
