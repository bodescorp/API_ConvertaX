import { InvestmentStatusEnum } from "./investment.enum";

export class InvestmentDto {
    id: string;
    id_owner: string;
    initial_amount: number;
    creation_date: Date;
    status: InvestmentStatusEnum; // Use o enum para garantir consistência
    current_balance: number;
}
