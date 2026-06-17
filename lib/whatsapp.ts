const AISENSY_URL = 'https://backend.aisensy.com/campaign/t1/api/v2'
const CAMPAIGN_NAME = 'qr_code_app'
const TEMPLATE_NAME = 'qr_code'

async function sendWhatsApp(phone: string, name: string) {
  const apiKey = process.env.AISENSY_API_KEY

  if (!apiKey) {
    console.error('[WhatsApp] Missing AISENSY_API_KEY')
    return
  }

  const destination = phone.replace(/\D/g, '')

  try {
    const res = await fetch(AISENSY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey,
        campaignName: CAMPAIGN_NAME,
        destination,
        userName: name,
        templateName: TEMPLATE_NAME,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`[WhatsApp] Failed for ${destination}: ${res.status} — ${text}`)
    }
  } catch (err) {
    console.error(`[WhatsApp] Network error for ${destination}:`, err)
  }
}

// Notify all active technicians — template has no dynamic params
export async function notifyTechniciansNewRequest(
  technicians: { full_name: string; phone: string }[]
) {
  if (!technicians.length) return

  await Promise.allSettled(
    technicians.map((tech) => sendWhatsApp(tech.phone, tech.full_name))
  )
}
