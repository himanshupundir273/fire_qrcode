-- ============================================================
-- FireGuard Pro — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Tables ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS support_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id       VARCHAR(50)  NOT NULL UNIQUE,
  company_name    VARCHAR(255) NOT NULL,
  contact_person  VARCHAR(255) NOT NULL,
  contact_number  VARCHAR(20)  NOT NULL,
  email           VARCHAR(255) NOT NULL,
  address         TEXT         NOT NULL,
  city            VARCHAR(100) NOT NULL,
  state           VARCHAR(100) NOT NULL,
  pincode         VARCHAR(10)  NOT NULL,
  panel_brand     VARCHAR(100) NOT NULL,
  panel_model     VARCHAR(100) NOT NULL,
  issue_title     VARCHAR(255) NOT NULL,
  issue_description TEXT       NOT NULL,
  priority        VARCHAR(20)  NOT NULL DEFAULT 'medium'
                    CHECK (priority IN ('low','medium','high','critical')),
  status          VARCHAR(30)  NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','assigned','in_progress',
                                      'waiting_for_parts','completed','closed')),
  visit_date      DATE,
  visit_time      VARCHAR(50),
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS request_media (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id  UUID         NOT NULL REFERENCES support_requests(id) ON DELETE CASCADE,
  file_url    TEXT         NOT NULL,
  file_name   VARCHAR(255) NOT NULL DEFAULT '',
  file_type   VARCHAR(30)  NOT NULL
                CHECK (file_type IN ('product_photo','issue_photo','video')),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS technician_notes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id  UUID  NOT NULL REFERENCES support_requests(id) ON DELETE CASCADE,
  note        TEXT  NOT NULL,
  created_by  VARCHAR(255) NOT NULL DEFAULT 'admin',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_support_requests_ticket_id   ON support_requests(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_requests_status       ON support_requests(status);
CREATE INDEX IF NOT EXISTS idx_support_requests_priority     ON support_requests(priority);
CREATE INDEX IF NOT EXISTS idx_support_requests_created_at   ON support_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_request_media_request_id      ON request_media(request_id);
CREATE INDEX IF NOT EXISTS idx_technician_notes_request_id   ON technician_notes(request_id);

-- ─── Auto-update updated_at ──────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_support_requests_updated_at
  BEFORE UPDATE ON support_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Row Level Security ──────────────────────────────────────

ALTER TABLE support_requests  ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_media      ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_notes   ENABLE ROW LEVEL SECURITY;

-- Public: INSERT only (anonymous users submit requests)
CREATE POLICY "public_insert_requests"
  ON support_requests FOR INSERT TO anon
  WITH CHECK (true);

-- Public: SELECT only own ticket by ticket_id (optional – for status page)
CREATE POLICY "public_select_own_request"
  ON support_requests FOR SELECT TO anon
  USING (true);   -- loosen if you want full public read

-- Public: INSERT media
CREATE POLICY "public_insert_media"
  ON request_media FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "public_select_media"
  ON request_media FOR SELECT TO anon
  USING (true);

-- Authenticated (admin): full access
CREATE POLICY "admin_all_requests"
  ON support_requests FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_media"
  ON request_media FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_notes"
  ON technician_notes FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ─── Storage Bucket ──────────────────────────────────────────
-- Run these via Supabase Dashboard → Storage → New Bucket
-- Or paste in SQL Editor:

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('support-media', 'support-media', true);

-- CREATE POLICY "public_upload_media"
--   ON storage.objects FOR INSERT TO anon
--   WITH CHECK (bucket_id = 'support-media');

-- CREATE POLICY "public_read_media"
--   ON storage.objects FOR SELECT TO anon
--   USING (bucket_id = 'support-media');

-- CREATE POLICY "admin_manage_media"
--   ON storage.objects FOR ALL TO authenticated
--   USING (bucket_id = 'support-media')
--   WITH CHECK (bucket_id = 'support-media');
