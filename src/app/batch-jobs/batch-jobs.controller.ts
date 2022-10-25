import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { BatchJobsService } from './batch-jobs.service';
import { CreateBatchJobDto } from './dtos/create-batch-job.dto';
import { BatchJob } from './entities/batch-job.entity';

@Controller('batch-jobs')
@ApiTags('batch-jobs')
export class BatchJobsController {
  constructor(private readonly batchJobService: BatchJobsService) {}

  @Post()
  @ApiConsumes('application/json')
  @ApiBody({
    type: CreateBatchJobDto,
  })
  async createBatchJob(@Body() data: CreateBatchJobDto): Promise<BatchJob> {
    return this.batchJobService.create(data);
  }

  @Get(':id')
  @ApiConsumes('application/json')
  async getBatchJobById(@Param('id') id: string): Promise<BatchJob> {
    return this.batchJobService.retrieve(id);
  }
}
