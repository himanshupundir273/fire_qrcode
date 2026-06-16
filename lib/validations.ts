import { z } from 'zod'

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
  panel_brand: z.string().min(1, 'Panel brand is required'),
  panel_model: z.string().min(1, 'Panel model is required'),
  issue_title: z.string().min(5, 'Issue title must be at least 5 characters'),
  issue_description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
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
