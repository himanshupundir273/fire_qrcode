-- ============================================================
-- Notofire Service — Technician System Schema
-- Run this in Supabase SQL Editor AFTER schema.sql
-- ============================================================

-- ─── Technician Profiles ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS technician_profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  phone      VARCHAR(20),
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE technician_profiles ENABLE ROW LEVEL SECURITY;

-- Technicians can read/update their own profile
CREATE POLICY "technician_own_profile"
  ON technician_profiles FOR ALL TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- ─── Add technician columns to support_requests ──────────────

ALTER TABLE support_requests
  ADD COLUMN IF NOT EXISTS assigned_to           UUID REFERENCES technician_profiles(id),
  ADD COLUMN IF NOT EXISTS technician_action      VARCHAR(20)
    CHECK (technician_action IN ('approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS technician_action_note TEXT,
  ADD COLUMN IF NOT EXISTS technician_action_at   TIMESTAMPTZ;

-- Allow null for optional fields
ALTER TABLE support_requests
  ALTER COLUMN company_name    DROP NOT NULL,
  ALTER COLUMN email           DROP NOT NULL,
  ALTER COLUMN issue_description DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_support_requests_assigned_to
  ON support_requests(assigned_to);

-- ─── RLS: Technicians can read requests assigned to them ─────

CREATE POLICY "technician_read_assigned"
  ON support_requests FOR SELECT TO authenticated
  USING (assigned_to = auth.uid() OR true);

CREATE POLICY "technician_update_assigned"
  ON support_requests FOR UPDATE TO authenticated
  USING (assigned_to = auth.uid())
  WITH CHECK (assigned_to = auth.uid());
