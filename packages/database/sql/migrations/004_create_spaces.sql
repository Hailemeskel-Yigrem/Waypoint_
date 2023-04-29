-- Migration: 004_create_spaces.sql
CREATE TABLE IF NOT EXISTS spaces (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), name VARCHAR(200) NOT NULL, slug VARCHAR(64) NOT NULL, type VARCHAR(32) NOT NULL, capacity INT NOT NULL DEFAULT 1, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(org_id, slug));
