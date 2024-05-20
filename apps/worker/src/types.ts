export interface JobContext {
  logger: {
    info: (obj: unknown, msg?: string) => void;
    error: (obj: unknown, msg?: string) => void;
    warn: (obj: unknown, msg?: string) => void;
    debug: (obj: unknown, msg?: string) => void;
  };
  metrics: {
    increment: (name: string, tags?: Record<string, string>) => Promise<void>;
  };
}

export interface JobHandler<TPayload> {
  name: string;
  handle: (payload: TPayload, ctx: JobContext) => Promise<void>;
}
