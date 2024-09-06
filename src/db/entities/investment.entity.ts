import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
