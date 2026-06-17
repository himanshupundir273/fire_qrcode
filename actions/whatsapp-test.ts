'use server'

import { createAdminClient } from '@/lib/supabase/admin'

const AISENSY_URL = 'https://backend.aisensy.com/campaign/t1/api/v2'
const CAMPAIGN_NAME = 'qr_code_app'
const TEMPLATE_NAME = 'qr_code'

export async function testWhatsAppNotification() {
  const apiKey = process.env.AISENSY_API_KEY

  if (!apiKey) {
    return {
      success: false,
      error: 'Missing AISENSY_API_KEY in environment',
      results: [],
    }
  }

  const adminClient = createAdminClient()
  const { data: technicians, error: dbError } = await adminClient
    .from('technician_profiles')
    .select('full_name, phone')
    .eq('is_active', true)

  if (dbError) {
    return { success: false, error: dbError.message, results: [] }
  }

  if (!technicians || technicians.length === 0) {
    return { success: false, error: 'No active technicians found in database', results: [] }
  }

  const results = await Promise.all(
    technicians.map(async (tech) => {
      const destination = tech.phone.replace(/\D/g, '')
      try {
        const res = await fetch(AISENSY_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey,
            campaignName: CAMPAIGN_NAME,
            destination,
            userName: tech.full_name,
            templateName: TEMPLATE_NAME,
          }),
        })

        const text = await res.text()
        let parsed: any = null
        try { parsed = JSON.parse(text) } catch {}

        return {
          name: tech.full_name,
          phone: destination,
          status: res.ok ? 'sent' : 'failed',
          httpStatus: res.status,
          response: parsed ?? text,
        }
      } catch (err: any) {
        return {
          name: tech.full_name,
          phone: destination,
          status: 'error',
          httpStatus: 0,
          response: err?.message ?? 'Network error',
        }
      }
    })
  )

  const allSent = results.every((r) => r.status === 'sent')
  return { success: allSent, error: null, results }
}
