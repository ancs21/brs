import * as xlsx from 'xlsx';

export class XlsxParser {
  public async parse(path: string): Promise<any> {
    try {
      const records = [];
      const workbook = xlsx.readFile(path);
      const sheetNames = workbook.SheetNames;
      const sheetIndex = 1;
      const parser = xlsx.utils.sheet_to_json(
        workbook.Sheets[sheetNames[sheetIndex - 1]],
      );
      for await (const record of parser) {
        records.push(record);
      }
      return records;
    } catch (error) {
      throw new Error(error);
    }
  }
}
