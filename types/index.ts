export type Priority = 'low' | 'medium' | 'high' | 'critical'

export type Status =
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'waiting_for_parts'
  | 'completed'
  | 'closed'

export interface TechnicianProfile {
  id: string
  full_name: string
  email: string
  phone: string | null
  is_active: boolean
  created_at: string
}

export interface SupportRequest {
  id: string
  ticket_id: string
  company_name: string | null
  contact_person: string
  contact_number: string
  email: string | null
  address: string
  city: string
  state: string
  pincode: string
  panel_brand: string
  panel_model: string
  issue_title: string
  issue_description: string | null
  priority: Priority
  status: Status
  visit_date: string | null
  visit_time: string | null
  assigned_to: string | null
  technician_action: 'approved' | 'rejected' | null
  technician_action_note: string | null
  technician_action_at: string | null
  created_at: string
  media?: RequestMedia[]
  notes?: TechnicianNote[]
  technician?: TechnicianProfile | null
}

export interface RequestMedia {
  id: string
  request_id: string
  file_url: string
  file_type: 'product_photo' | 'issue_photo' | 'video'
  file_name: string
  created_at: string
}

export interface TechnicianNote {
  id: string
  request_id: string
  note: string
  created_by: string
  created_at: string
}

export interface DashboardStats {
  total: number
  pending: number
  in_progress: number
  completed: number
  critical: number
}
