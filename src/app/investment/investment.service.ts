import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { InvestmentEntity } from 'src/db/entities/investment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { TenantService } from 'src/tenant/tenant.service';
import { InvestmentStatusEnum } from './dto/investment.enum';
import { FindAllParameters } from './dto/findParameters-investment.dto';
import { InvestmentHelper } from './helpers/investment.helper';
@Injectable()
export class InvestmentService {
  constructor(
    @InjectRepository(InvestmentEntity)
    private readonly investmentRepository: Repository<InvestmentEntity>,
    private readonly tenantService: TenantService,
  ) { }


  async create(investment: CreateInvestmentDto) {
    const investmentToSave: InvestmentEntity = {
      id_owner: this.tenantService.getTenant().id,
      creation_date: investment.creation_date || new Date(),
      initial_amount: investment.initial_amount,
      status: InvestmentStatusEnum.active,
      current_balance: investment.initial_amount,

    };

    if (investmentToSave.initial_amount <= 0) {
      throw new HttpException(
        `initial investment value cannot be 0`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdInvestment = await this.investmentRepository.save(investmentToSave);

    return this.mapEntityToDto(createdInvestment);

  }

  async findAll(params: FindAllParameters): Promise<{ investments: CreateInvestmentDto[]; totalItems: number, totalPages: number }> {
    const searchParams: FindOptionsWhere<InvestmentEntity> = {}

    if (params.status) {
      searchParams.status = Like(`%${params.status}%`);
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;


    // paginação
    const [investments, total] = await this.investmentRepository.findAndCount({
      where: [
        { ...searchParams, id_owner: this.tenantService.getTenant().id },
      ],
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

  findOne(id: number) {
    return `This action returns a #${id} investment`;
  }

  update(id: number,) {
    return `This action updates a #${id} investment`;
  }

  remove(id: number) {
    return `This action removes a #${id} investment`;
  }


  private mapEntityToDto(investmentEntity: InvestmentEntity): CreateInvestmentDto {
    return {
      id: investmentEntity.id,
      id_owner: this.tenantService.getTenant().id,
      initial_amount: +investmentEntity.initial_amount,
      creation_date: investmentEntity.creation_date,
      status: InvestmentStatusEnum[investmentEntity.status],
      current_balance: InvestmentHelper.calculateExpectedReturn(investmentEntity.initial_amount, investmentEntity.creation_date)
    };
  }

}
