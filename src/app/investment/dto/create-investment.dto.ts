import { IsDateString, IsNumber } from "class-validator";

export class CreateInvestmentDto {
    @IsNumber()
    initial_amount: number;
  
    @IsDateString()
    creation_date: Date;
}
