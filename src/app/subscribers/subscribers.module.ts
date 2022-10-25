import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchJobsService } from '../batch-jobs/batch-jobs.service';

import { BatchJob } from '../batch-jobs/entities/batch-job.entity';
import { ProcessorQueueName } from '../processor/processor.type';
import { BatchJobSubscriber } from './batch-job.subscriber';

@Module({
  imports: [
    BullModule.registerQueue({
      name: ProcessorQueueName.BATCHJOB_QUEUE,
    }),
    TypeOrmModule.forFeature([BatchJob]),
  ],
  providers: [BatchJobSubscriber, BatchJobsService],
})
export class SubscribersModule {}
