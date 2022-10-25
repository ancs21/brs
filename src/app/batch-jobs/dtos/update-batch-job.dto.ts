import { BatchJobStatus } from '../entities/batch-job.entity';

export class UpdateBatchJobDto {
  status: BatchJobStatus;
  result?: Record<string, any>;
  processing_at?: Date;
  completed_at?: Date;
  canceled_at?: Date;
  failed_at?: Date;
}
