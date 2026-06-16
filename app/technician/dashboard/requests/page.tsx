import { getOpenRequests, getMyRequests } from '@/actions/technician'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ClipboardList } from 'lucide-react'
import { cn, getPriorityColor, getStatusColor, formatPriority, formatStatus, formatDateTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function TechnicianRequestsPage() {
  const [openRequests, myRequests] = await Promise.all([getOpenRequests(), getMyRequests()])

  const sections = [
    { title: 'New Requests (Available)', items: openRequests, emptyMsg: 'No open requests right now.' },
    { title: 'My Jobs', items: myRequests, emptyMsg: 'You have no active or completed jobs.' },
  ]

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Requests</h1>
        <p className="text-gray-500 text-sm mt-1">Open requests you can accept, and your current jobs</p>
      </div>

      {sections.map(section => (
        <div key={section.title} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <h2 className="font-semibold text-gray-900">{section.title}</h2>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{section.items.length}</span>
          </div>

          {section.items.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">{section.emptyMsg}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Ticket', 'Issue', 'Contact', 'Location', 'Priority', 'Status', 'Date'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {section.items.map(req => (
                    <tr key={req.id} className="hover:bg-orange-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/technician/dashboard/requests/${req.id}`} className="font-mono text-xs text-gray-500 hover:text-orange-600">
                          {req.ticket_id}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/technician/dashboard/requests/${req.id}`} className="block">
                          <p className="font-medium text-gray-900 truncate max-w-[180px]">{req.issue_title}</p>
                          <p className="text-xs text-gray-400">{req.panel_brand}</p>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{req.contact_person}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{req.city}, {req.state}</td>
                      <td className="px-4 py-3">
                        <Badge className={cn('text-xs border', getPriorityColor(req.priority))}>
                          {formatPriority(req.priority)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={cn('text-xs border', getStatusColor(req.status))}>
                          {formatStatus(req.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{formatDateTime(req.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
