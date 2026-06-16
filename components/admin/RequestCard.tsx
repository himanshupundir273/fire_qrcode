import Link from 'next/link'
import { Eye, Phone, Calendar, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SupportRequest } from '@/types'
import {
  cn,
  getPriorityColor,
  getStatusColor,
  formatPriority,
  formatStatus,
  formatDate,
} from '@/lib/utils'

export function RequestCard({ request }: { request: SupportRequest }) {
  const isCritical = request.priority === 'critical'

  return (
    <div
      className={cn(
        'bg-white rounded-xl border p-5 shadow-sm transition-all hover:shadow-md',
        isCritical && 'border-red-200 bg-red-50/30'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500">{request.ticket_id}</span>
            {isCritical && (
              <span className="text-xs font-bold text-red-600 critical-pulse">● CRITICAL</span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 mt-1">{request.company_name}</h3>
          <p className="text-sm text-gray-500">{request.contact_person}</p>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <Badge className={cn('text-xs border', getPriorityColor(request.priority))}>
            {formatPriority(request.priority)}
          </Badge>
          <Badge className={cn('text-xs border', getStatusColor(request.status))}>
            {formatStatus(request.status)}
          </Badge>
        </div>
      </div>

      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-3.5 h-3.5 text-gray-400" />
          {request.contact_number}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Tag className="w-3.5 h-3.5 text-gray-400" />
          <span className="truncate">{request.issue_title}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          {formatDate(request.created_at)}
        </div>
      </div>

      <Link href={`/admin/dashboard/requests/${request.id}`}>
        <Button
          size="sm"
          variant="outline"
          className="w-full border-gray-200 hover:border-red-300 hover:text-red-600"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </Link>
    </div>
  )
}
