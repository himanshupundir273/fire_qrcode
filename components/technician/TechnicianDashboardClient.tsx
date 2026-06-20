'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ClipboardList, Inbox, Wrench, CheckCircle, Languages } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn, getPriorityColor, getStatusColor, formatPriority, formatStatus, formatDateTime } from '@/lib/utils'
import type { Priority, Status } from '@/types'

type Lang = 'en' | 'hi'

const text = {
  en: {
    welcome: (name: string) => `Welcome, ${name} 👋`,
    subtitle: 'Here are new service requests and your active jobs',
    open_requests: 'Open Requests',
    active_jobs: 'My Active Jobs',
    completed: 'Completed',
    new_requests: 'New Requests',
    open: 'open',
    no_open: 'No open requests right now',
    my_active: 'My Active Jobs',
    available: 'Available',
  },
  hi: {
    welcome: (name: string) => `स्वागत है, ${name} 👋`,
    subtitle: 'यहाँ नए सेवा अनुरोध और आपके सक्रिय कार्य हैं',
    open_requests: 'खुले अनुरोध',
    active_jobs: 'मेरे सक्रिय कार्य',
    completed: 'पूर्ण',
    new_requests: 'नए अनुरोध',
    open: 'खुले',
    no_open: 'अभी कोई खुला अनुरोध नहीं है',
    my_active: 'मेरे सक्रिय कार्य',
    available: 'उपलब्ध',
  },
}

interface Request {
  id: string
  ticket_id: string
  issue_title: string | null
  contact_person: string
  city: string
  state: string
  priority: string
  status: string
  created_at: string
}

interface Props {
  name: string
  openRequests: Request[]
  activeRequests: Request[]
  completedCount: number
}

export function TechnicianDashboardClient({ name, openRequests, activeRequests, completedCount }: Props) {
  const [lang, setLang] = useState<Lang>('en')
  const t = text[lang]

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.welcome(name)}</h1>
          <p className="text-gray-500 text-sm mt-1">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <Languages className="w-4 h-4 text-gray-500" />
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${lang === 'en' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              English
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${lang === 'hi' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t.open_requests, value: openRequests.length, icon: Inbox, color: 'text-blue-600 bg-blue-50' },
          { label: t.active_jobs, value: activeRequests.length, icon: Wrench, color: 'text-orange-600 bg-orange-50' },
          { label: t.completed, value: completedCount, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
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
            <h2 className="font-semibold text-gray-900">{t.new_requests}</h2>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {openRequests.length} {t.open}
            </span>
          </div>
        </div>

        {openRequests.length === 0 ? (
          <div className="text-center py-14">
            <Inbox className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">{t.no_open}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {openRequests.map(req => (
              <Link key={req.id} href={`/technician/dashboard/requests/${req.id}`}
                className="flex items-start justify-between px-6 py-4 hover:bg-blue-50 transition-colors group">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-400">{req.ticket_id}</span>
                    <Badge className={cn('text-xs border', getPriorityColor(req.priority as Priority))}>
                      {formatPriority(req.priority as Priority)}
                    </Badge>
                  </div>
                  <p className="font-semibold text-gray-900 truncate group-hover:text-blue-700">{req.issue_title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{req.contact_person} · {req.city}, {req.state}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">{t.available}</span>
                  <p className="text-xs text-gray-400 mt-1">{formatDateTime(req.created_at)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* My Active Jobs */}
      {activeRequests.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
            <Wrench className="w-4 h-4 text-orange-500" />
            <h2 className="font-semibold text-gray-900">{t.my_active}</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {activeRequests.map(req => (
              <Link key={req.id} href={`/technician/dashboard/requests/${req.id}`}
                className="flex items-start justify-between px-6 py-4 hover:bg-orange-50 transition-colors group">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-400">{req.ticket_id}</span>
                    <Badge className={cn('text-xs border', getPriorityColor(req.priority as Priority))}>
                      {formatPriority(req.priority as Priority)}
                    </Badge>
                  </div>
                  <p className="font-semibold text-gray-900 truncate">{req.issue_title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{req.contact_person} · {req.city}, {req.state}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <Badge className={cn('text-xs border', getStatusColor(req.status as Status))}>
                    {formatStatus(req.status as Status)}
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
