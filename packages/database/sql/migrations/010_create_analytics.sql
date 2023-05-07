-- Migration: 010_create_analytics.sql
CREATE TABLE IF NOT EXISTS analytics_rollups (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), date DATE NOT NULL, bookings_count INT NOT NULL DEFAULT 0, visitors_count INT NOT NULL DEFAULT 0, occupancy_rate NUMERIC(5,2) NOT NULL DEFAULT 0, revenue_cents INT NOT NULL DEFAULT 0, UNIQUE(org_id, date));
