# FireGuard Pro — Setup & Deployment Guide

## 1. Supabase Project Setup

### Create Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Name it `fireguard-pro`, choose a region close to your users
3. Copy your **Project URL** and **Anon Key** from Settings → API

### Run Database Schema
1. Open **SQL Editor** in your Supabase dashboard
2. Paste the contents of `supabase/schema.sql`
3. Click **Run**

### Create Storage Bucket
1. Go to **Storage** → **New Bucket**
2. Name: `support-media`
3. Toggle **Public bucket** ON
4. Save

Then run these SQL policies in the SQL Editor:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('support-media', 'support-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public_upload_media" ON storage.objects
  FOR INSERT TO anon WITH CHECK (bucket_id = 'support-media');

CREATE POLICY "public_read_media" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'support-media');

CREATE POLICY "admin_manage_media" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'support-media')
  WITH CHECK (bucket_id = 'support-media');
```

### Create Admin User
1. Go to **Authentication** → **Users** → **Add User**
2. Email: `admin@fireguard.com`
3. Password: `Admin@123456` (change this!)
4. Or use the Supabase Auth API

### Enable Realtime
1. Go to **Database** → **Replication**
2. Enable replication for `support_requests` table

---

## 2. Local Development

```bash
# Clone and install
cd fire-alarm-support
npm install

# Copy env template and fill in your values
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
npm run dev
# Open http://localhost:3000
```

---

## 3. Deploy to Vercel

### One-Click Deploy
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Select your repo
4. Add **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)
5. Click **Deploy**

---

## 4. Application URLs

| Page | URL |
|------|-----|
| Homepage | `/` |
| Submit Request | `/submit` |
| Success Page | `/success/[ticket]` |
| Admin Login | `/admin/login` |
| Admin Dashboard | `/admin/dashboard` |
| All Requests | `/admin/dashboard/requests` |
| Request Detail | `/admin/dashboard/requests/[id]` |

---

## 5. Admin Credentials (default)

| Field | Value |
|-------|-------|
| Email | `admin@fireguard.com` |
| Password | `Admin@123456` |

> **Important**: Change these credentials before going to production!

---

## 6. Features Checklist

- [x] Customer request submission form
- [x] File/photo/video upload to Supabase Storage
- [x] Unique ticket ID generation
- [x] Success page with ticket ID
- [x] Admin dashboard with statistics
- [x] Requests table with search, filter, pagination
- [x] Export requests to Excel
- [x] Request detail page
- [x] Status management (Pending → Closed)
- [x] Technician notes
- [x] Media gallery with lightbox
- [x] Video player
- [x] Google Maps link from address
- [x] WhatsApp contact button
- [x] Realtime updates hook
- [x] Admin authentication (Supabase Auth)
- [x] Protected admin routes via proxy
- [x] Responsive, mobile-friendly UI
- [x] Toast notifications
- [x] Form validation with Zod
- [x] Priority badge coloring
- [x] Status badge coloring

---

## 7. Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | App Router framework |
| Supabase | 2.x | Database + Auth + Storage |
| Tailwind CSS | 4.x | Styling |
| ShadCN UI | Latest | Component library |
| React Hook Form | 7.x | Form state management |
| Zod | 4.x | Validation |
| xlsx | 0.18.x | Excel export |
| jspdf | 4.x | PDF export |
| Lucide React | Latest | Icons |
| Sonner | 2.x | Toast notifications |
