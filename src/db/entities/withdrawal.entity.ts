import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { InvestmentEntity } from './investment.entity';

@Entity({ name: 'withdrawal' })
export class WithdrawalEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  
  @Column('uuid')
  investment_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;  // Valor bruto da retirada

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  net_amount: number;  // Valor líquido da retirada

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tax_applied: number;  // Valor do imposto

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  tax_rate: number;  // Taxa de imposto aplicada

  @Column({ type: 'timestamptz' })
  withdrawal_date: Date;  // Data da retirada

  @ManyToOne(() => InvestmentEntity, investment => investment.withdrawals)
  @JoinColumn({ name: 'investment_id' })
  investment: InvestmentEntity;

}
