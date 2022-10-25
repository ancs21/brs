import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchJobsService } from '../batch-jobs/batch-jobs.service';
import { BatchJob } from '../batch-jobs/entities/batch-job.entity';
import { Transaction } from '../transactions/transactions.entity';
import { ProcessorQueueName } from './processor.type';
import { TransactionImportProcessor } from './transaction-import.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, BatchJob]),
    BullModule.registerQueue({
      name: ProcessorQueueName.BATCHJOB_QUEUE,
    }),
  ],
  controllers: [],
  providers: [BatchJobsService, TransactionImportProcessor],
})
export class ProcessorModule {}
