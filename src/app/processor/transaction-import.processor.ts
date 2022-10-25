import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import * as fs from 'fs';
import * as mine from 'mime-types';
import { z, ZodObject } from 'zod';

import { Repository } from 'typeorm';
import { CsvParser } from '../../utils/csv-parser';
import { strDMYToDatetime } from '../../utils/str-to-datetime';
import { XlsxParser } from '../../utils/xlsx-parser';
import { BatchJobType } from '../batch-jobs/batch-job.type';
import { BatchJobsService } from '../batch-jobs/batch-jobs.service';
import {
  BatchJob,
  BatchJobStatus,
} from '../batch-jobs/entities/batch-job.entity';
import {
  Transaction,
  TransactionType,
} from '../transactions/transactions.entity';
import { ProcessorQueueName } from './processor.type';

@Processor(ProcessorQueueName.BATCHJOB_QUEUE)
export class TransactionImportProcessor {
  private readonly _logger = new Logger(TransactionImportProcessor.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly _transactionRepository: Repository<Transaction>,
    private readonly _bacthJobService: BatchJobsService,
  ) {}

  @Process(BatchJobType.TRANSACTION_IMPORT)
  async handleTransactionImport(job: Job) {
    this._logger.debug(`Received job ${job.id} with data ${job.data}`);
    await this._bacthJobService.update(job.data.job_id, {
      status: BatchJobStatus.PROCESSING,
      processing_at: new Date(),
    });

    const result: BatchJob = await this._bacthJobService.retrieve(
      job.data.job_id,
    );

    const isContextStrict = result.context?.strict ?? false;
    const contextFilePath = result.context?.file_path;

    try {
      let content = [];
      const isFileExists = fs.existsSync(contextFilePath);
      if (!isFileExists) {
        this._logger.error(`Job ${job.id} is failed`);
        await job.moveToFailed({
          message: `File ${contextFilePath} not found`,
        });
        return await this._bacthJobService.update(job.data.job_id, {
          status: BatchJobStatus.FAILED,
          failed_at: new Date(),
          result: {
            count: null,
            success_count: null,
            error_count: null,
            error_data: [],
            message: `File ${contextFilePath} not found`,
          },
        });
        // throw new Error(`File ${contextFilePath} not found`);
      }

      const mineFilePath = mine.lookup(contextFilePath);

      if (mineFilePath === 'text/csv') {
        const csvParser = new CsvParser();
        content = await csvParser.parse(result.context.file_path);
      } else if (
        mineFilePath ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        mineFilePath === 'application/vnd.ms-excel'
      ) {
        const xlsxParser = new XlsxParser();
        content = await xlsxParser.parse(result.context.file_path);
      }

      const transactionObject = z.object({
        date: z.string().transform((value) => strDMYToDatetime(value)), // 21/03/2020 10:20:11 -> 2020-03-21T03:20:11.000Z
        content: z.string().nullable(),
        amount: z
          .string()
          .transform((value) => parseFloat(value.replace(/[^\d-+]/g, ''))), // +100.000.000, -50.000 --> 100000000, -50000
        type: z.enum([TransactionType.DEPOSIT, TransactionType.WITHDRAW]),
      });

      const { validData, invalidData } = await buildData(
        content,
        transactionObject,
      );

      if (invalidData.length > 0 && isContextStrict) {
        await job.moveToFailed({
          message: 'Strict mode is on and there are invalid data',
        });

        return await this._bacthJobService.update(job.data.job_id, {
          status: BatchJobStatus.FAILED,
          failed_at: new Date(),
          result: {
            count: content.length,
            success_count: null,
            error_count: null,
            error_data: null,
            message: 'Strict mode is on and there are invalid data',
          },
        });
      }

      this._logger.debug(`process data ${validData.length} rows and ${invalidData.length} rows`);
      await this._transactionRepository.save(validData, {
        chunk: 1000,
      });

      this._logger.debug(`Job ${job.id} is completed`);
      await job.moveToCompleted();
      return await this._bacthJobService.update(job.data.job_id, {
        status: BatchJobStatus.COMPLETED,
        completed_at: new Date(),
        result: {
          count: content.length,
          success_count: validData.length,
          error_count: invalidData.length,
          error_data: [],
          message: null,
        },
      });
    } catch (error) {
      console.log(error);

      this._logger.error(`Job ${job.id} is failed`);
      await job.moveToFailed({ message: error.message });
      return await this._bacthJobService.update(job.data.job_id, {
        status: BatchJobStatus.FAILED,
        failed_at: new Date(),
        result: {
          count: null,
          success_count: null,
          error_count: null,
          error_data: [],
          message: error.message,
        },
      });
    }
  }
}

export async function buildData(
  data: any[],
  parseObject: ZodObject<any>,
): Promise<any> {
  let validData = [];
  let invalidData = [];
  data.forEach((row, i) => {
    try {
      const transaction = parseObject.parse(row);
      validData.push(transaction);
    } catch (error) {
      invalidData.push({ row_number: i, row, error: error.issues });
    }
  });

  return { validData, invalidData };
}
