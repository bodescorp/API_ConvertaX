import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindManyOptions } from 'typeorm';
import { InvestmentEntity } from 'src/db/entities/investment.entity';
import { TenantService } from 'src/app/tenant/tenant.service';
import { InvestmentStatusEnum } from './dto/investment.enum';
import { FindAllParameters } from './dto/findParameters-investment.dto';
import { ListInvestmentsDto } from './dto/list-investment.dto';
import { WithdrawalEntity } from 'src/db/entities/withdrawal.entity';
import { WithdrawalHelper } from '../withdrawal/helpers/withdrawal.helper';
import { InvestmentDto } from './dto/investment.dto';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { InvestmentDetailsDto } from './dto/detail-investment.dto';
import { WithdrawalDto } from '../withdrawal/dto/withdrawal.dto';
import { RedisService } from 'src/cache-redis/redis.service';
import { v4 as uuidv4, validate as validateUUID } from 'uuid';

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

    const creationDate = investment.creation_date ? new Date(investment.creation_date) : new Date();

    if (creationDate > new Date()) {
      throw new HttpException(
        'Creation date cannot be in the future',
        HttpStatus.BAD_REQUEST,
      );
    }

    const investmentAge = WithdrawalHelper.getInvestmentAgeInYears(creationDate);
    const currentBalance = this.calculateExpectedAmount(investment.initial_amount, investmentAge);

    const investmentToSave = this.investmentRepository.create({
      id_owner: this.tenantService.getTenant().id,
      creation_date: creationDate,
      initial_amount: investment.initial_amount,
      status: InvestmentStatusEnum.active,
      current_balance: currentBalance,
    });

    const createdInvestment = await this.investmentRepository.save(investmentToSave);

    await this.redisService.set(`${this.cachePrefix}${createdInvestment.id}`, JSON.stringify(createdInvestment), 10);

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
    const limit = params.limit || 5;
    const skip = (page - 1) * limit;

    const cacheKey = `${this.cachePrefix}investments:list:${this.tenantService.getTenant().id}:${page}:${limit}:${params.status || 'all'}`;
    const cachedResult = await this.redisService.get(cacheKey);

    if (cachedResult) {
        return JSON.parse(cachedResult);
    }

    // paginação
    const [investments, total] = await this.investmentRepository.findAndCount({
        where: searchParams,
        take: limit,
        skip: skip,
    });

    const totalPages = Math.ceil(total / limit);

    const result: ListInvestmentsDto = {
        investments: investments.map((investment) => this.mapEntityToDto(investment)),
        totalItems: total,
        totalPages: totalPages,
    };

    await this.redisService.set(cacheKey, JSON.stringify(result), 10); 

    return result;
}


  async findOne(id: string): Promise<InvestmentDetailsDto> {

    if (!validateUUID(id)) {
      throw new HttpException('Invalid UUID format', HttpStatus.BAD_REQUEST);
    }

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
    const expected_balance = this.calculateExpectedAmount(foundInvestment.initial_amount, investmentAge);


    const result: InvestmentDetailsDto = {
      id: foundInvestment.id,
      initial_amount: foundInvestment.initial_amount,
      expected_balance: expected_balance,
      current_balance: foundInvestment.current_balance,
      withdrawals: foundInvestment.withdrawals.map(this.mapWithdrawalToDto.bind(this)),
    };

    await this.redisService.set(cacheKey, JSON.stringify(result), 10);

    return result;
  }

  private calculateExpectedAmount(initial_amount: number, years: number): number {
    const annualInterestRate = 0.0642; // 6,42% ao ano
    const compoundedAmount = initial_amount * Math.pow(1 + annualInterestRate, years);
    return Math.round(compoundedAmount * 100) / 100; // Arredonda para 2 casas decimais
  }

  private mapEntityToDto(investmentEntity: InvestmentEntity): InvestmentDto {
    const investmentAge = WithdrawalHelper.getInvestmentAgeInYears(investmentEntity.creation_date);
    const expectedReturn = this.calculateExpectedAmount(
      investmentEntity.initial_amount,
      investmentAge,
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
