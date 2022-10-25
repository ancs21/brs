import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppError, ErrorTypes } from '../../utils/app-errors';
import { BatchJobEvent } from './batch-job.type';
import { CreateBatchJobDto } from './dtos/create-batch-job.dto';
import { UpdateBatchJobDto } from './dtos/update-batch-job.dto';
import { BatchJob } from './entities/batch-job.entity';
import { BatchJobSubmittedEvent } from './events/batch-job-submited.event';

@Injectable()
export class BatchJobsService {
  constructor(
    @InjectRepository(BatchJob)
    private readonly _batchJobsRepository: Repository<BatchJob>,
    private readonly _eventEmitter: EventEmitter2,
  ) {}

  async retrieve(batchJobId: string): Promise<BatchJob | never> {
    let batchJob: BatchJob;
    batchJob = await this._batchJobsRepository.findOne({
      where: { job_id: batchJobId },
    });

    if (!batchJob) {
      throw new AppError(
        ErrorTypes.NOT_FOUND,
        `Batch Job with id ${batchJobId} not found`,
      );
    }

    return batchJob;
  }

  async create(data: CreateBatchJobDto): Promise<BatchJob> {
    const batchJob = this._batchJobsRepository.create(data);
    const result = await this._batchJobsRepository.save(batchJob);

    const batchJobSubmittedEvent = new BatchJobSubmittedEvent();
    batchJobSubmittedEvent.job_id = result.job_id;

    this._eventEmitter.emit(BatchJobEvent.SUBMITTED, batchJobSubmittedEvent);

    return result;
  }

  async update(
    batchJobId: string,
    data: Partial<UpdateBatchJobDto>,
  ): Promise<BatchJob | never> {
    let batchJob: BatchJob;
    batchJob = await this._batchJobsRepository.findOne({
      where: { job_id: batchJobId },
    });

    if (!batchJob) {
      throw new AppError(
        ErrorTypes.NOT_FOUND,
        `Batch Job with id ${batchJobId} not found`,
      );
    }

    await this._batchJobsRepository.update(batchJobId, data);

    batchJob = await this._batchJobsRepository.findOne({
      where: { job_id: batchJobId },
    });

    return batchJob;
  }
}
