'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)

  // Check if admin
  const adminEmail = process.env.ADMIN_EMAIL
  if (data.user.email === adminEmail) {
    redirect('/admin/dashboard')
  }

  // Check if technician
  const { data: profile } = await supabase
    .from('technician_profiles')
    .select('id, is_active')
    .eq('id', data.user.id)
    .single()

  if (profile) {
    if (!profile.is_active) {
      await supabase.auth.signOut()
      throw new Error('Your account has been deactivated. Contact admin.')
    }
    redirect('/technician/dashboard')
  }

  await supabase.auth.signOut()
  throw new Error('No account found. Please contact admin.')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserRole(): Promise<'admin' | 'technician' | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  if (user.email === process.env.ADMIN_EMAIL) return 'admin'
  const { data } = await supabase.from('technician_profiles').select('id').eq('id', user.id).single()
  return data ? 'technician' : null
}
