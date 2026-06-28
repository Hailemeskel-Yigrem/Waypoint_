CREATE TABLE IF NOT EXISTS pipeline_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_name VARCHAR(100) NOT NULL,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  business_date DATE NOT NULL,
  status VARCHAR(16) NOT NULL,
  row_count INT NOT NULL DEFAULT 0,
  run_count INT NOT NULL DEFAULT 1,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  UNIQUE (pipeline_name, org_id, business_date),
  CHECK (status IN ('running', 'succeeded', 'failed')),
  CHECK (row_count >= 0),
  CHECK (run_count > 0)
);

CREATE INDEX IF NOT EXISTS idx_pipeline_runs_status_date
  ON pipeline_runs (status, business_date DESC);
