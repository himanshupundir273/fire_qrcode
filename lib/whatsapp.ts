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

// Notify all active technicians when a new request is submitted
export async function notifyTechniciansNewRequest(
  technicians: { full_name: string; phone: string }[]
) {
  if (!technicians.length) return

  await Promise.allSettled(
    technicians.map((tech) => sendWhatsApp(tech.phone, tech.full_name))
  )
}

// Notify admin when a new request is submitted
export async function notifyAdminNewRequest() {
  const adminPhone = process.env.ADMIN_PHONE
  if (!adminPhone) {
    console.error('[WhatsApp] Missing ADMIN_PHONE')
    return
  }
  await sendWhatsApp(adminPhone, 'Admin')
}

// Notify a specific technician when admin assigns them to a request
export async function notifyTechnicianAssigned(phone: string, name: string) {
  await sendWhatsApp(phone, name)
}

// Notify customer when their request is marked completed
export async function notifyCustomerCompleted(phone: string, name: string, ticketId: string) {
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
        campaignName: 'query_completed',
        destination,
        userName: name,
        templateName: 'query_complete',
        templateParams: [ticketId],
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`[WhatsApp] Completion notify failed for ${destination}: ${res.status} — ${text}`)
    }
  } catch (err) {
    console.error(`[WhatsApp] Completion notify network error:`, err)
  }
}

// Notify customer when a technician is assigned to their request
export async function notifyCustomerAssigned(params: {
  phone: string
  name: string
  ticketId: string
  technicianName: string
  visitDate: string
  visitTime: string
}) {
  const apiKey = process.env.AISENSY_API_KEY
  if (!apiKey) {
    console.error('[WhatsApp] Missing AISENSY_API_KEY')
    return
  }

  const destination = params.phone.replace(/\D/g, '')

  try {
    const res = await fetch(AISENSY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey,
        campaignName: 'query_submission',
        destination,
        userName: params.name,
        templateName: 'query_submit',
        templateParams: [
          params.ticketId,
          params.technicianName,
          params.visitDate,
          params.visitTime,
        ],
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`[WhatsApp] Customer notify failed for ${destination}: ${res.status} — ${text}`)
    }
  } catch (err) {
    console.error(`[WhatsApp] Customer notify network error:`, err)
  }
}
