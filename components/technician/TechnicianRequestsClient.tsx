'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ClipboardList } from 'lucide-react'
import { cn, getPriorityColor, getStatusColor } from '@/lib/utils'
import type { Priority, Status } from '@/types'

function priorityHi(p: string) {
  const map: Record<string, string> = { low: 'कम', medium: 'मध्यम', high: 'उच्च', critical: 'गंभीर' }
  return map[p] ?? p
}

function statusHi(s: string) {
  const map: Record<string, string> = {
    pending: 'लंबित',
    assigned: 'सौंपा गया',
    in_progress: 'प्रगति में',
    waiting_for_parts: 'पार्ट्स का इंतजार',
    completed: 'पूर्ण',
    closed: 'बंद',
  }
  return map[s] ?? s
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString('hi-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

interface Request {
  id: string
  ticket_id: string
  issue_title: string | null
  panel_brand: string | null
  contact_person: string
  city: string
  state: string
  priority: string
  status: string
  created_at: string
}

interface Props {
  openRequests: Request[]
  myRequests: Request[]
}

const sections = [
  { key: 'open', title: 'नए अनुरोध (उपलब्ध)', emptyMsg: 'अभी कोई खुला अनुरोध नहीं है।' },
  { key: 'my', title: 'मेरे कार्य', emptyMsg: 'आपके पास कोई सक्रिय या पूर्ण कार्य नहीं है।' },
]

const headers = ['टिकट', 'समस्या', 'संपर्क', 'स्थान', 'प्राथमिकता', 'स्थिति', 'दिनांक']

export function TechnicianRequestsClient({ openRequests, myRequests }: Props) {
  const data: Record<string, Request[]> = { open: openRequests, my: myRequests }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">अनुरोध</h1>
        <p className="text-gray-500 text-sm mt-1">खुले अनुरोध जिन्हें आप स्वीकार कर सकते हैं, और आपके वर्तमान कार्य</p>
      </div>

      {sections.map(section => (
        <div key={section.key} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <h2 className="font-semibold text-gray-900">{section.title}</h2>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{data[section.key].length}</span>
          </div>

          {data[section.key].length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">{section.emptyMsg}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {headers.map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data[section.key].map(req => (
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
                        <Badge className={cn('text-xs border', getPriorityColor(req.priority as Priority))}>
                          {priorityHi(req.priority)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={cn('text-xs border', getStatusColor(req.status as Status))}>
                          {statusHi(req.status)}
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
