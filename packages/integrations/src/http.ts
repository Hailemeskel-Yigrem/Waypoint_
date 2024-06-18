export interface HttpRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
}

export interface HttpResponse {
  status: number;
  body: unknown;
}

export type HttpTransport = (req: HttpRequest) => Promise<HttpResponse>;

export class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export async function requestJson(transport: HttpTransport, req: HttpRequest): Promise<unknown> {
  const response = await transport(req);
  if (response.status < 200 || response.status >= 300) {
    throw new HttpError(`HTTP ${response.status} for ${req.url}`, response.status, response.body);
  }
  return response.body;
}
