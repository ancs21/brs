import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum BatchJobStatus {
  SUBMITTED = 'submitted',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  FAILED = 'failed',
}

@Entity()
export class BatchJob {
  @PrimaryGeneratedColumn('uuid')
  job_id: string;

  @Column()
  type: string;

  @Column({
    nullable: true,
  })
  created_by: string | null;

  @Column({
    type: 'enum',
    enum: BatchJobStatus,
    default: BatchJobStatus.SUBMITTED,
  })
  status: BatchJobStatus;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  context: Record<string, any>;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  result: Record<string, any>;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  submitted_at: Date;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  processing_at: Date | null;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  completed_at: Date | null;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  canceled_at: Date | null;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  failed_at: Date | null;
}
