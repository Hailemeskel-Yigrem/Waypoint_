export type JobStatus = 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';

export type JobData = Record<string, unknown>;

export interface Job<T = JobData> {
  id: string;
  name: string;
  data: T;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  failedReason?: string;
  delayMs?: number;
}

export type JobHandler<T = JobData> = (job: Job<T>) => Promise<void>;

export interface QueueAdapter {
  add<T = JobData>(
    name: string,
    data: T,
    opts?: { delayMs?: number; maxAttempts?: number },
  ): Promise<Job<T>>;
  process(name: string, handler: JobHandler): void;
  start(): Promise<void>;
  stop(): Promise<void>;
  getJob(id: string): Promise<Job | null>;
  getStats(): Promise<{ waiting: number; active: number; completed: number; failed: number }>;
}
