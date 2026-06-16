import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Wrench, FileText, Phone } from 'lucide-react'
import { getRequestById } from '@/actions/requests'
import { getTechnicianProfile } from '@/actions/technician'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TechnicianActionPanel } from '@/components/technician/TechnicianActionPanel'
import { MediaGallery } from '@/components/admin/MediaGallery'
import { AddNoteForm } from '@/components/admin/AddNoteForm'
import { cn, getPriorityColor, getStatusColor, formatPriority, formatStatus, formatDate, formatDateTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function TechnicianRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const profile = await getTechnicianProfile()
  if (!profile) notFound()

  let request: any
  try {
    request = await getRequestById(id)
  } catch {
    notFound()
  }

  // Allow viewing if: request is pending (open) OR assigned to this technician
  const isOpen = request.status === 'pending' && !request.assigned_to
  const isAssignedToMe = request.assigned_to === profile.id
  if (!isOpen && !isAssignedToMe) notFound()

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/technician/dashboard"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <Separator orientation="vertical" className="h-5" />
        <h1 className="text-lg font-bold text-gray-900">{request.ticket_id}</h1>
        <Badge className={cn('border', getPriorityColor(request.priority))}>
          {formatPriority(request.priority)}
        </Badge>
        <Badge className={cn('border', getStatusColor(request.status))}>
          {formatStatus(request.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left */}
        <div className="xl:col-span-2 space-y-6">
          {/* Issue */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-orange-600" /> Issue Details
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <div className="text-xs text-gray-400">Item Name</div>
                <div className="text-sm font-medium text-gray-900">{request.panel_brand}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Model</div>
                <div className="text-sm font-medium text-gray-900">{request.panel_model}</div>
              </div>
              {request.visit_date && (
                <div>
                  <div className="text-xs text-gray-400">Preferred Date</div>
                  <div className="text-sm font-medium text-gray-900">{formatDate(request.visit_date)}</div>
                </div>
              )}
              {request.visit_time && (
                <div>
                  <div className="text-xs text-gray-400">Preferred Time</div>
                  <div className="text-sm font-medium text-gray-900">{request.visit_time}</div>
                </div>
              )}
            </div>
            <p className="font-semibold text-gray-900 mb-2">{request.issue_title}</p>
            {request.issue_description && (
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed whitespace-pre-wrap">
                {request.issue_description}
              </p>
            )}
          </div>

          {/* Customer */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-600" /> Customer Info
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-xs text-gray-400">Contact Person</div>
                <div className="text-sm font-medium text-gray-900">{request.contact_person}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Phone</div>
                <a href={`tel:${request.contact_number}`} className="text-sm font-medium text-orange-600 hover:underline">
                  {request.contact_number}
                </a>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {request.address}, {request.city}, {request.state} — {request.pincode}
                </p>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(`${request.address}, ${request.city}, ${request.state}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>

          {/* Media */}
          {request.media?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" /> Media
                <span className="text-xs text-gray-400">({request.media.length} files)</span>
              </h2>
              <MediaGallery media={request.media} />
            </div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-6">
          <TechnicianActionPanel
            requestId={request.id}
            status={request.status}
            isAssignedToMe={isAssignedToMe}
          />

          {/* Notes — only show when working on it */}
          {isAssignedToMe && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">My Notes</h2>
              <AddNoteForm requestId={request.id} adminEmail={profile.full_name} />
              <div className="mt-4 space-y-3">
                {request.notes?.length > 0 ? request.notes.map((note: any) => (
                  <div key={note.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.note}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-400">{note.created_by}</span>
                      <span className="text-xs text-gray-400">{formatDateTime(note.created_at)}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-400 text-center py-3">No notes yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
