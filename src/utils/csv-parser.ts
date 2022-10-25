import { createReadStream } from 'fs';
import * as csv from 'csv-parser';
import { ZodObject } from 'zod';

export class CsvParser {
  public async parse(path: string): Promise<any> {
    try {
      const records = [];
      const parser = createReadStream(path).pipe(csv());
      for await (const record of parser) {
        records.push(record);
      }
      return records;
    } catch (error) {
      throw new Error(error);
    }
  }
}
