import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchJobsController } from './batch-jobs.controller';
import { BatchJobsService } from './batch-jobs.service';
import { BatchJob } from './entities/batch-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BatchJob])],
  controllers: [BatchJobsController],
  providers: [BatchJobsService],
})
export class BatchJobsModule {}
