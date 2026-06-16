import { getOpenRequests, getMyRequests, getTechnicianProfile } from '@/actions/technician'
import { ClipboardList, Inbox, Wrench, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn, getPriorityColor, getStatusColor, formatPriority, formatStatus, formatDateTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function TechnicianDashboardPage() {
  const [openRequests, myRequests, profile] = await Promise.all([
    getOpenRequests(),
    getMyRequests(),
    getTechnicianProfile(),
  ])

  const active = myRequests.filter(r => r.status === 'in_progress')
  const completed = myRequests.filter(r => r.status === 'completed')

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {profile?.full_name} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here are new service requests and your active jobs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Open Requests', value: openRequests.length, icon: Inbox, color: 'text-blue-600 bg-blue-50' },
          { label: 'My Active Jobs', value: active.length, icon: Wrench, color: 'text-orange-600 bg-orange-50' },
          { label: 'Completed', value: completed.length, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', s.color)}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Open / Available Requests */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-blue-500" />
            <h2 className="font-semibold text-gray-900">New Requests</h2>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {openRequests.length} open
            </span>
          </div>
        </div>

        {openRequests.length === 0 ? (
          <div className="text-center py-14">
            <Inbox className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No open requests right now</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {openRequests.map(req => (
              <Link key={req.id} href={`/technician/dashboard/requests/${req.id}`}
                className="flex items-start justify-between px-6 py-4 hover:bg-blue-50 transition-colors group">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-400">{req.ticket_id}</span>
                    <Badge className={cn('text-xs border', getPriorityColor(req.priority))}>
                      {formatPriority(req.priority)}
                    </Badge>
                  </div>
                  <p className="font-semibold text-gray-900 truncate group-hover:text-blue-700">{req.issue_title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{req.contact_person} · {req.city}, {req.state}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Available</span>
                  <p className="text-xs text-gray-400 mt-1">{formatDateTime(req.created_at)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* My Active Jobs */}
      {active.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
            <Wrench className="w-4 h-4 text-orange-500" />
            <h2 className="font-semibold text-gray-900">My Active Jobs</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {active.map(req => (
              <Link key={req.id} href={`/technician/dashboard/requests/${req.id}`}
                className="flex items-start justify-between px-6 py-4 hover:bg-orange-50 transition-colors group">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-400">{req.ticket_id}</span>
                    <Badge className={cn('text-xs border', getPriorityColor(req.priority))}>
                      {formatPriority(req.priority)}
                    </Badge>
                  </div>
                  <p className="font-semibold text-gray-900 truncate">{req.issue_title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{req.contact_person} · {req.city}, {req.state}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <Badge className={cn('text-xs border', getStatusColor(req.status))}>
                    {formatStatus(req.status)}
                  </Badge>
                  <p className="text-xs text-gray-400 mt-1">{formatDateTime(req.created_at)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
