const AISENSY_URL = 'https://backend.aisensy.com/campaign/t1/api/v2'

async function sendWhatsApp(phone: string, name: string) {
  const apiKey = process.env.AISENSY_API_KEY
  const campaignName = process.env.AISENSY_CAMPAIGN_NAME

  if (!apiKey || !campaignName) {
    console.error('[WhatsApp] Missing AISENSY_API_KEY or AISENSY_CAMPAIGN_NAME')
    return
  }

  const destination = phone.replace(/\D/g, '')

  try {
    const res = await fetch(AISENSY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey,
        campaignName,
        destination,
        userName: name,
        templateName: 'qr_code',
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
