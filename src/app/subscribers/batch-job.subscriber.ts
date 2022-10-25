import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { match, P } from 'ts-pattern';

import { BatchJobEvent, BatchJobType } from '../batch-jobs/batch-job.type';
import { BatchJobsService } from '../batch-jobs/batch-jobs.service';
import { BatchJob } from '../batch-jobs/entities/batch-job.entity';
import { BatchJobSubmittedEvent } from '../batch-jobs/events/batch-job-submited.event';
import { ProcessorQueueName } from '../processor/processor.type';

@Injectable()
export class BatchJobSubscriber {
  constructor(
    @InjectQueue(ProcessorQueueName.BATCHJOB_QUEUE)
    private readonly _batchJobQueue: Queue,
    private readonly _batchJobService: BatchJobsService,
  ) {}

  @OnEvent(BatchJobEvent.SUBMITTED)
  async handleBatchJobSubmittedEvent(event: BatchJobSubmittedEvent) {
    console.log('Batch Job Submitted Event: ', event);
    const result: BatchJob = await this._batchJobService.retrieve(event.job_id);
    return match(result)
      .with(
        {
          type: BatchJobType.TRANSACTION_IMPORT,
          context: { file_path: P.string },
        },
        () => {
          console.log('transaction-import with file_path');
          this._batchJobQueue.add(BatchJobType.TRANSACTION_IMPORT, result);
        },
      )
      .otherwise(() => {
        console.log('No match');
      });
  }
}
