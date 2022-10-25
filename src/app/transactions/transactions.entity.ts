import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum TransactionType {
  DEPOSIT = 'Deposit',
  WITHDRAW = 'Withdraw',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transaction_id: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({
    type: 'numeric',
  })
  amount: number;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;

  @Column({
    nullable: true,
  })
  content: string;
}
