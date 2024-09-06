import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { WithdrawalEntity } from 'src/db/entities/withdrawal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { InvestmentEntity } from 'src/db/entities/investment.entity';
import { WithdrawalHelper } from './helpers/withdrawal.helper';

@Injectable()
export class WithdrawalService {
  constructor(
    @InjectRepository(WithdrawalEntity)
    private readonly withdrawalRepository: Repository<WithdrawalEntity>,
    @InjectRepository(InvestmentEntity)
    private readonly investmentRepository: Repository<InvestmentEntity>,
    private dataSource: DataSource,
  ) {}

  async create(investmentId: string, createWithdrawalDto: CreateWithdrawalDto): Promise<WithdrawalEntity> {
    const investment = await this.investmentRepository.findOne({
      where: { id: investmentId },
    });

    if (!investment) {
      throw new HttpException(
        `Investment with id ${investmentId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (createWithdrawalDto.amount > investment.current_balance) {
      throw new HttpException(
        `Insufficient balance for withdrawal`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Calcula o valor líquido após aplicar os impostos
    const { netAmount, taxRate, taxApplied } = WithdrawalHelper.calculateWithdrawalAmount(
      investment.creation_date,
      createWithdrawalDto.amount,
    );

    const withdrawalToSave = this.withdrawalRepository.create({
      investment_id: investment.id,
      amount: createWithdrawalDto.amount,
      net_amount: netAmount,
      tax_rate: taxRate,
      tax_applied: taxApplied,
      withdrawal_date: new Date(),
      investment: investment,
    });

    const transaction = await this.dataSource.transaction(async (manager) => {
      investment.current_balance -= createWithdrawalDto.amount;
      await manager.save(investment); 
      return await manager.save(withdrawalToSave);
    });

    return this.mapEntityToDto(transaction);
  }

  private mapEntityToDto(withdrawalEntity: WithdrawalEntity): WithdrawalEntity {
    return {
      id: withdrawalEntity.id,
      investment_id: withdrawalEntity.investment_id,
      amount: withdrawalEntity.amount,
      net_amount: withdrawalEntity.net_amount,
      tax_rate: withdrawalEntity.tax_rate,
      tax_applied: withdrawalEntity.tax_applied,
      withdrawal_date: withdrawalEntity.withdrawal_date,
      investment: withdrawalEntity.investment,
    };
  }
}
