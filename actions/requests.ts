'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateTicketId } from '@/lib/utils'
import { SupportRequestFormData } from '@/lib/validations'
import { Status } from '@/types'
import { revalidatePath } from 'next/cache'
import { notifyTechniciansNewRequest, notifyAdminNewRequest } from '@/lib/whatsapp'

export async function submitSupportRequest(
  data: SupportRequestFormData,
  mediaFiles: {
    productPhotos: { url: string; name: string }[]
    issuePhotos: { url: string; name: string }[]
    video: { url: string; name: string } | null
  }
) {
  const supabase = await createClient()
  const ticketId = generateTicketId()

  const { data: request, error } = await supabase
    .from('support_requests')
    .insert({
      ticket_id: ticketId,
      company_name: data.company_name,
      contact_person: data.contact_person,
      contact_number: data.contact_number,
      email: data.email,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      panel_brand: data.panel_brand,
      panel_model: data.panel_model,
      issue_title: data.issue_title,
      issue_description: data.issue_description,
      priority: data.priority,
      status: 'pending',
      visit_date: data.visit_date || null,
      visit_time: data.visit_time || null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Insert media records
  const mediaInserts = [
    ...mediaFiles.productPhotos.map((f) => ({
      request_id: request.id,
      file_url: f.url,
      file_name: f.name,
      file_type: 'product_photo' as const,
    })),
    ...mediaFiles.issuePhotos.map((f) => ({
      request_id: request.id,
      file_url: f.url,
      file_name: f.name,
      file_type: 'issue_photo' as const,
    })),
    ...(mediaFiles.video
      ? [
          {
            request_id: request.id,
            file_url: mediaFiles.video.url,
            file_name: mediaFiles.video.name,
            file_type: 'video' as const,
          },
        ]
      : []),
  ]

  if (mediaInserts.length > 0) {
    await supabase.from('request_media').insert(mediaInserts)
  }

  // Notify all active technicians via WhatsApp (non-blocking)
  const adminClient = createAdminClient()
  const { data: technicians } = await adminClient
    .from('technician_profiles')
    .select('full_name, phone')
    .eq('is_active', true)

  await Promise.allSettled([
    technicians?.length ? notifyTechniciansNewRequest(technicians) : Promise.resolve(),
    notifyAdminNewRequest(),
  ])

  return { ticketId, requestId: request.id }
}

export async function getRequests(filters?: {
  search?: string
  status?: string
  priority?: string
  dateFrom?: string
  dateTo?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from('support_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.search) {
    query = query.or(
      `ticket_id.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%,contact_person.ilike.%${filters.search}%`
    )
  }
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }
  if (filters?.priority && filters.priority !== 'all') {
    query = query.eq('priority', filters.priority)
  }
  if (filters?.dateFrom) {
    query = query.gte('created_at', filters.dateFrom)
  }
  if (filters?.dateTo) {
    query = query.lte('created_at', filters.dateTo + 'T23:59:59')
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data
}

export async function getRequestById(id: string) {
  const supabase = await createClient()

  const { data: request, error } = await supabase
    .from('support_requests')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)

  const [{ data: media }, { data: notes }] = await Promise.all([
    supabase.from('request_media').select('*').eq('request_id', id).order('created_at', { ascending: true }),
    supabase.from('technician_notes').select('*').eq('request_id', id).order('created_at', { ascending: false }),
  ])

  // Use admin client to bypass RLS — admin needs to see any technician's profile
  let technician = null
  if (request.assigned_to) {
    const adminClient = createAdminClient()
    const { data } = await adminClient
      .from('technician_profiles')
      .select('id, full_name, email, phone')
      .eq('id', request.assigned_to)
      .single()
    technician = data
  }

  return { ...request, media: media || [], notes: notes || [], technician }
}

export async function updateRequestStatus(id: string, status: Status) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('support_requests')
    .update({ status })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/dashboard')
  revalidatePath(`/admin/requests/${id}`)
}

export async function addTechnicianNote(
  requestId: string,
  note: string,
  createdBy: string
) {
  const supabase = await createClient()

  const { error } = await supabase.from('technician_notes').insert({
    request_id: requestId,
    note,
    created_by: createdBy,
  })

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/requests/${requestId}`)
}

export async function getDashboardStats() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('support_requests')
    .select('status, priority')

  if (error) throw new Error(error.message)

  return {
    total: data.length,
    pending: data.filter((r) => r.status === 'pending').length,
    in_progress: data.filter((r) => r.status === 'in_progress').length,
    completed: data.filter((r) => r.status === 'completed').length,
    critical: data.filter((r) => r.priority === 'critical').length,
  }
}
