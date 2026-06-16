'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { SupportRequest } from '@/types'
import {
  cn,
  getPriorityColor,
  getStatusColor,
  formatPriority,
  formatStatus,
  formatDate,
} from '@/lib/utils'
import * as XLSX from 'xlsx'

const PAGE_SIZE = 20

export function RequestsTable({ requests }: { requests: SupportRequest[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [isPending, startTransition] = useTransition()

  const filtered = requests.filter((r) => {
    const matchesSearch =
      !search ||
      r.ticket_id.toLowerCase().includes(search.toLowerCase()) ||
      (r.company_name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      r.contact_person.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || r.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const exportToExcel = () => {
    const data = filtered.map((r) => ({
      'Ticket ID': r.ticket_id,
      'Company': r.company_name,
      'Contact Person': r.contact_person,
      'Phone': r.contact_number,
      'Email': r.email,
      'City': r.city,
      'State': r.state,
      'Panel Brand': r.panel_brand,
      'Panel Model': r.panel_model,
      'Issue': r.issue_title,
      'Priority': formatPriority(r.priority),
      'Status': formatStatus(r.status),
      'Date': formatDate(r.created_at),
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Requests')
    XLSX.writeFile(wb, `fire-alarm-requests-${Date.now()}.xlsx`)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by ticket ID, company, or contact..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="waiting_for_parts">Waiting for Parts</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); setPage(1) }}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => startTransition(() => router.refresh())}
          >
            <RefreshCw className={cn('w-4 h-4', isPending && 'animate-spin')} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToExcel}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center gap-2 text-sm text-gray-500 px-1">
        <Filter className="w-4 h-4" />
        Showing {paged.length} of {filtered.length} requests
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Ticket ID', 'Company', 'Contact', 'Phone', 'Brand / Model', 'Issue', 'Priority', 'Status', 'Date', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-gray-400">
                    No requests found matching your filters
                  </td>
                </tr>
              ) : (
                paged.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-slate-600 whitespace-nowrap">
                      {r.ticket_id}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap max-w-[150px] truncate">
                      {r.company_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.contact_person}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.contact_number}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      <div>{r.panel_brand}</div>
                      <div className="text-xs text-gray-400">{r.panel_model}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[180px]">
                      <span className="line-clamp-1">{r.issue_title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={cn('text-xs border whitespace-nowrap', getPriorityColor(r.priority))}>
                        {formatPriority(r.priority)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={cn('text-xs border whitespace-nowrap', getStatusColor(r.status))}>
                        {formatStatus(r.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                      {formatDate(r.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/dashboard/requests/${r.id}`}>
                        <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
