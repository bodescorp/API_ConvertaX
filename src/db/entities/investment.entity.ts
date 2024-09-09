import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { WithdrawalEntity } from './withdrawal.entity';

@Entity({name:'investment'})
export class InvestmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('uuid')
  id_owner: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  initial_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  current_balance: number;


  @Column({ type: 'timestamptz'})
  creation_date: Date;

  @Column({ type: 'varchar' })
  status: string;

  @OneToMany(() => WithdrawalEntity, withdrawal => withdrawal.investment, { cascade: true })
  withdrawals: WithdrawalEntity[];
}
