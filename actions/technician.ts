'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function technicianSignup(data: {
  full_name: string
  email: string
  phone: string
  password: string
}) {
  const admin = createAdminClient()

  const { data: authData, error: signUpError } = await admin.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
  })

  if (signUpError) throw new Error(signUpError.message)
  if (!authData.user) throw new Error('Signup failed')

  const { error: profileError } = await admin
    .from('technician_profiles')
    .insert({
      id: authData.user.id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
    })

  if (profileError) {
    await admin.auth.admin.deleteUser(authData.user.id)
    throw new Error(profileError.message)
  }

  return { userId: authData.user.id }
}

export async function getTechnicianProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('technician_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data
}

// All pending (unassigned) requests — visible to every technician
export async function getOpenRequests() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('support_requests')
    .select('*')
    .is('assigned_to', null)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

// Requests this technician has accepted
export async function getMyRequests() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('support_requests')
    .select('*')
    .eq('assigned_to', user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

// Atomically claim a request — only succeeds if still unassigned
export async function acceptRequest(requestId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('support_requests')
    .update({ assigned_to: user.id, status: 'in_progress' })
    .eq('id', requestId)
    .is('assigned_to', null)   // only claim if still open
    .eq('status', 'pending')
    .select()
    .single()

  if (error || !data) throw new Error('Request already taken by another technician.')

  revalidatePath('/technician/dashboard')
  revalidatePath(`/technician/dashboard/requests/${requestId}`)
}

export async function rejectRequest(requestId: string, note: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // If they already accepted it, unassign and return to pool
  const { error } = await supabase
    .from('support_requests')
    .update({
      assigned_to: null,
      status: 'pending',
      technician_action: 'rejected',
      technician_action_note: note,
      technician_action_at: new Date().toISOString(),
    })
    .eq('id', requestId)
    .eq('assigned_to', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/technician/dashboard')
}

export async function technicianMarkComplete(requestId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('support_requests')
    .update({ status: 'completed' })
    .eq('id', requestId)
    .eq('assigned_to', user.id)

  if (error) throw new Error(error.message)

  // Notify customer
  const { data: req } = await createAdminClient()
    .from('support_requests')
    .select('ticket_id, contact_person, contact_number')
    .eq('id', requestId)
    .single()

  if (req?.contact_number) {
    const { notifyCustomerCompleted } = await import('@/lib/whatsapp')
    await notifyCustomerCompleted(req.contact_number, req.contact_person, req.ticket_id).catch(() => {})
  }

  revalidatePath('/technician/dashboard')
}

export async function getAllTechnicians() {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from('technician_profiles')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

// Admin manually assigns a technician to a request
export async function assignRequestToTechnician(requestId: string, technicianId: string) {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  const { error } = await supabase
    .from('support_requests')
    .update({ assigned_to: technicianId, status: 'in_progress' })
    .eq('id', requestId)

  if (error) throw new Error(error.message)

  // Fetch technician + request details in parallel
  const [{ data: tech }, { data: req }] = await Promise.all([
    adminClient
      .from('technician_profiles')
      .select('full_name, phone')
      .eq('id', technicianId)
      .single(),
    adminClient
      .from('support_requests')
      .select('ticket_id, contact_person, contact_number, visit_date, visit_time')
      .eq('id', requestId)
      .single(),
  ])

  const { notifyTechnicianAssigned, notifyCustomerAssigned } = await import('@/lib/whatsapp')

  await Promise.allSettled([
    // Notify the assigned technician
    tech?.phone
      ? notifyTechnicianAssigned(tech.phone, tech.full_name)
      : Promise.resolve(),

    // Notify the customer
    req?.contact_number
      ? notifyCustomerAssigned({
          phone: req.contact_number,
          name: req.contact_person,
          ticketId: req.ticket_id,
          technicianName: tech?.full_name ?? 'Our Technician',
          visitDate: req.visit_date ?? 'To be confirmed',
          visitTime: req.visit_time ?? 'To be confirmed',
        })
      : Promise.resolve(),
  ])

  revalidatePath(`/admin/dashboard/requests/${requestId}`)
  revalidatePath('/admin/dashboard/requests')
}

export async function technicianLogout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
