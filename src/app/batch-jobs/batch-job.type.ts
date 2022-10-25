export enum BatchJobType {
  TRANSACTION_IMPORT = 'transaction-import',
}

export enum BatchJobEvent {
  SUBMITTED = 'batchjob.submitted',
  PROCESSING = 'batchjob.processing',
  COMPLETED = 'batchjob.completed',
  CANCELED = 'batchjob.canceled',
  FAILED = 'batchjob.failed',
}
