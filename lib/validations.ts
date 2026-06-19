import { z } from 'zod'

export const panelItemSchema = z.object({
  item_name: z.string().min(1, 'Item name is required'),
  model: z.string().min(1, 'Model is required'),
  serial_number: z.string().min(1, 'Serial number is required'),
  issue_title: z.string().min(3, 'Issue description is required'),
})

export type PanelItem = z.infer<typeof panelItemSchema>

export const supportRequestSchema = z.object({
  company_name: z.string().optional(),
  contact_person: z.string().min(2, 'Contact person name is required'),
  contact_number: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().optional(),
  address: z.string().min(10, 'Please enter complete address'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  panels: z.array(panelItemSchema).min(1, 'Add at least one panel'),
  // These are derived from panels[0] before submission
  panel_brand: z.string().optional(),
  panel_model: z.string().optional(),
  issue_title: z.string().optional(),
  issue_description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  visit_date: z.string().optional(),
  visit_time: z.string().optional(),
})

export type SupportRequestFormData = z.infer<typeof supportRequestSchema>

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const technicianSignupSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

export type TechnicianSignupData = z.infer<typeof technicianSignupSchema>
