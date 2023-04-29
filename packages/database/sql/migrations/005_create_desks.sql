-- Migration: 005_create_desks.sql
CREATE TABLE IF NOT EXISTS desks (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), space_id UUID NOT NULL REFERENCES spaces(id), label VARCHAR(50) NOT NULL, is_bookable BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
