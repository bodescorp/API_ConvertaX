import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { InvestmentEntity } from 'src/db/entities/investment.entity';
import { TenantService } from 'src/app/tenant/tenant.service';
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
import { RedisService } from 'src/cache-redis/redis.service';

@Injectable()
export class InvestmentService {
  private readonly cachePrefix = 'investment:';

  constructor(
    @InjectRepository(InvestmentEntity)
    private readonly investmentRepository: Repository<InvestmentEntity>,
    private readonly tenantService: TenantService,
    private readonly redisService: RedisService,
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

    await this.redisService.set(`${this.cachePrefix}${createdInvestment.id}`, JSON.stringify(createdInvestment), 10);

    return this.mapEntityToDto(createdInvestment);
  }

  async findAll(params: FindAllParameters): Promise<ListInvestmentsDto> {
    const { page, limit, status } = params;
  
    const searchParams: FindOptionsWhere<InvestmentEntity> = {
      id_owner: this.tenantService.getTenant().id,
      ...(status && { status: status as InvestmentStatusEnum }),
    };
  
    const isPaginated = page && limit;
    const skip = isPaginated ? (Number(page) - 1) * Number(limit) : undefined;
  
    const cacheKey = `${this.cachePrefix}list:${page || 'all'}:${limit || 'all'}`;
    const cachedResult = await this.redisService.get(cacheKey);
  
    if (cachedResult) {
      return JSON.parse(cachedResult);
    }
  
    const queryOptions = {
      where: searchParams,
      ...(isPaginated && { take: Number(limit), skip }),
    };
  
    const [investments, total] = await this.investmentRepository.findAndCount(queryOptions);
  
    const totalPages = isPaginated ? Math.ceil(total / Number(limit)) : 1;
  
    const result: ListInvestmentsDto = {
      investments: investments.map(this.mapEntityToDto.bind(this)),
      totalItems: total,
      totalPages,
    };
  
    await this.redisService.set(cacheKey, JSON.stringify(result), 10);
  
    return result;
  }
  


  async findOne(id: string): Promise<InvestmentDetailsDto> {
    const cacheKey = `${this.cachePrefix}${id}`;
    const cachedInvestment = await this.redisService.get(cacheKey);

    if (cachedInvestment) {
      return JSON.parse(cachedInvestment) as InvestmentDetailsDto;
    }

    const foundInvestment = await this.investmentRepository.findOne({
      where: { id },
      relations: ['withdrawals'],
    });

    if (!foundInvestment) {
      throw new HttpException(`Investment with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }

    const investmentAge = WithdrawalHelper.getInvestmentAgeInYears(foundInvestment.creation_date);
    const expectedBalance = this.calculateExpectedAmount(foundInvestment.current_balance, investmentAge);

    const result: InvestmentDetailsDto = {
      id: foundInvestment.id,
      initial_amount: foundInvestment.initial_amount,
      expected_balance: expectedBalance,
      current_balance: foundInvestment.current_balance,
      withdrawals: foundInvestment.withdrawals.map(withdrawal => this.mapWithdrawalToDto(withdrawal)),
    };

    await this.redisService.set(cacheKey, JSON.stringify(result), 10);

    return result;
  }


  private calculateExpectedAmount(current_balance: number, years: number): number {
    const annualInterestRate = 0.0642; // 6,42% ao ano
    const compoundedAmount = current_balance * Math.pow(1 + annualInterestRate, years);
    return Math.round(compoundedAmount * 100) / 100; // Arredonda para 2 casas decimais
  }

  private mapEntityToDto(investmentEntity: InvestmentEntity): InvestmentDto {
    const expectedReturn = InvestmentHelper.calculateExpectedReturn(
      investmentEntity.current_balance,
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
