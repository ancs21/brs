import { ApiProperty } from '@nestjs/swagger';
import { BatchJobType } from '../batch-job.type';

export class CreateBatchJobDto {
  @ApiProperty({
    enum: BatchJobType,
    default: BatchJobType.TRANSACTION_IMPORT,
  })
  type: BatchJobType;

  @ApiProperty({
    type: 'object',
    default: {
      file_path: 'path/to/file.csv',
      strict: true,
    },
  })
  context: Record<string, any>;
}
