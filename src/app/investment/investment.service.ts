import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InvestmentEntity } from 'src/db/entities/investment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { TenantService } from 'src/tenant/tenant.service';
import { InvestmentStatusEnum } from './dto/investment.enum';
import { FindAllParameters } from './dto/findParameters-investment.dto';
import { InvestmentHelper } from './helpers/investment.helper';
import { ListInvestmentsDto } from './dto/list-investment.dto';
import { WithdrawalEntity } from 'src/db/entities/withdrawal.entity';
import { WithdrawalHelper } from '../withdrawal/helpers/withdrawal.helper';
import { InvestmentDto } from './dto/investment.dto';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { InvestmentDetailsDto } from './dto/detail-investment.dto';
import { WithdrawalDto } from '../withdrawal/dto/withdrawal.dto';
@Injectable()
export class InvestmentService {
  constructor(
    @InjectRepository(InvestmentEntity)
    private readonly investmentRepository: Repository<InvestmentEntity>,
    private readonly tenantService: TenantService,
  ) { }


  async create(investment: CreateInvestmentDto): Promise<InvestmentDto> {

    if (investment.initial_amount <= 0) {
      throw new HttpException(
        'Initial investment value must be greater than 0',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (investment.creation_date && new Date(investment.creation_date) > new Date()) {
      throw new HttpException(
        'Creation date cannot be in the future',
        HttpStatus.BAD_REQUEST,
      );
    }

    const investmentToSave = this.investmentRepository.create({
      id_owner: this.tenantService.getTenant().id,
      creation_date: investment.creation_date || new Date(),
      initial_amount: investment.initial_amount,
      status: InvestmentStatusEnum.active,
      current_balance: investment.initial_amount,
    });

    const createdInvestment = await this.investmentRepository.save(investmentToSave);

    return this.mapEntityToDto(createdInvestment);

  }

  async findAll(params: FindAllParameters): Promise<ListInvestmentsDto> {
    const searchParams: FindOptionsWhere<InvestmentEntity> = {
      id_owner: this.tenantService.getTenant().id,
    };

    if (params.status) {
      searchParams.status = params.status as InvestmentStatusEnum;
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;


    // paginação
    const [investments, total] = await this.investmentRepository.findAndCount({
      where: searchParams,
      take: limit,
      skip: skip,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      investments: investments.map((investment) => this.mapEntityToDto(investment)),
      totalItems: total,
      totalPages: totalPages,
    };

  }

  async findOne(id: string): Promise<InvestmentDetailsDto> {
    const foundInvestment = await this.investmentRepository.findOne({
      where: { id },
      relations: ['withdrawals'],
    });

    if (!foundInvestment) {
      throw new HttpException(`Investment with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }

    const initialAmount = foundInvestment.initial_amount;
    const investmentAge = WithdrawalHelper.getInvestmentAgeInYears(foundInvestment.creation_date);
    const expectedBalance = this.calculateExpectedAmount(initialAmount, investmentAge);


    return {
      initial_amount: foundInvestment.initial_amount,
      expectedBalance: expectedBalance,
      current_balance: foundInvestment.current_balance,
      withdrawals: foundInvestment.withdrawals.map(withdrawal => this.mapWithdrawalToDto(withdrawal)),
    };
  }

  private calculateExpectedAmount(initialAmount: number, years: number): number {
    const annualInterestRate = 0.05; // 5% ao ano
    const compoundedAmount = initialAmount * Math.pow(1 + annualInterestRate, years);
    return Math.round(compoundedAmount * 100) / 100; // Arredonda para 2 casas decimais
  }
  

  private mapEntityToDto(investmentEntity: InvestmentEntity): InvestmentDto {
    const expectedReturn = InvestmentHelper.calculateExpectedReturn(
      investmentEntity.initial_amount,
      investmentEntity.creation_date,
    );

    return {
      id: investmentEntity.id,
      id_owner: this.tenantService.getTenant().id,
      initial_amount: +investmentEntity.initial_amount,
      creation_date: investmentEntity.creation_date,
      status: InvestmentStatusEnum[investmentEntity.status],
      current_balance: expectedReturn,
    };
  }

  private mapWithdrawalToDto(withdrawal: WithdrawalEntity): WithdrawalDto {
    return {
      id: withdrawal.id,
      investment_id: withdrawal.investment_id,
      amount: Number(withdrawal.amount),  
      net_amount: Number(withdrawal.net_amount),
      tax_applied: Number(withdrawal.tax_applied),
      tax_rate: Number(withdrawal.tax_rate),
      withdrawal_date: withdrawal.withdrawal_date,
    };
  }
  
  

}
