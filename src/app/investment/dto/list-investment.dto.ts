import { CreateInvestmentDto } from './create-investment.dto'; // ajuste o caminho conforme necessário

export class ListInvestmentsDto {
  investments: CreateInvestmentDto[];
  totalItems: number;
  totalPages: number;
}