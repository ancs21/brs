import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { BatchJobsController } from './batch-jobs.controller';
import { BatchJobsService } from './batch-jobs.service';
import { BatchJob } from './entities/batch-job.entity';

describe('BatchJobsController', () => {
  let controller: BatchJobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([BatchJob]),
        EventEmitterModule.forRoot(),
      ],
      controllers: [BatchJobsController],
      providers: [BatchJobsService],
    }).compile();

    controller = module.get<BatchJobsController>(BatchJobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
