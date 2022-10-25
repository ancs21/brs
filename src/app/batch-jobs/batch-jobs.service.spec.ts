import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { BatchJobsController } from './batch-jobs.controller';
import { BatchJobsService } from './batch-jobs.service';
import { BatchJob } from './entities/batch-job.entity';

describe('BatchJobsService', () => {
  let service: BatchJobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([BatchJob]),
        EventEmitterModule.forRoot(),
      ],
      controllers: [BatchJobsController],
      providers: [BatchJobsService],
    }).compile();

    service = module.get<BatchJobsService>(BatchJobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
