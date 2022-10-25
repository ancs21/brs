import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transactions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
})
export class TransactionsModule {}
