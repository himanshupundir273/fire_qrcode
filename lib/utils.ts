import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Priority, Status } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateTicketId(): string {
  const prefix = 'FAP'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export function getPriorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    critical: 'bg-red-100 text-red-800 border-red-200',
  }
  return colors[priority]
}

export function getStatusColor(status: Status): string {
  const colors: Record<Status, string> = {
    pending: 'bg-gray-100 text-gray-800 border-gray-200',
    assigned: 'bg-blue-100 text-blue-800 border-blue-200',
    in_progress: 'bg-purple-100 text-purple-800 border-purple-200',
    waiting_for_parts: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    closed: 'bg-slate-100 text-slate-800 border-slate-200',
  }
  return colors[status]
}

export function formatStatus(status: Status): string {
  const labels: Record<Status, string> = {
    pending: 'Pending',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    waiting_for_parts: 'Waiting for Parts',
    completed: 'Completed',
    closed: 'Closed',
  }
  return labels[status]
}

export function formatPriority(priority: Priority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
