import { InvestmentDto } from "./investment.dto";

export class ListInvestmentsDto {
    investments: InvestmentDto[];
    totalItems: number;
    totalPages: number;
}
