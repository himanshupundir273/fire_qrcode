import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  MapPin,
  Wrench,
  FileText,
  Calendar,
  Clock,
  StickyNote,
} from 'lucide-react'
import { getRequestById } from '@/actions/requests'
import { getUser } from '@/actions/auth'
import { getAllTechnicians } from '@/actions/technician'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { StatusUpdater } from '@/components/admin/StatusUpdater'
import { AddNoteForm } from '@/components/admin/AddNoteForm'
import { MediaGallery } from '@/components/admin/MediaGallery'
import { DownloadPDFButton } from '@/components/admin/DownloadPDFButton'
import { AssignTechnician } from '@/components/admin/AssignTechnician'
import {
  cn,
  getPriorityColor,
  getStatusColor,
  formatPriority,
  formatStatus,
  formatDate,
  formatDateTime,
} from '@/lib/utils'
import { SupportRequest, RequestMedia, TechnicianNote } from '@/types'

export const dynamic = 'force-dynamic'

function InfoRow({ icon: Icon, label, value }: {
  icon: React.ElementType
  label: string
  value: string | null | undefined
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-sm font-medium text-gray-900">{value || '—'}</div>
      </div>
    </div>
  )
}

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let request: SupportRequest & { media: RequestMedia[]; notes: TechnicianNote[] }
  try {
    request = await getRequestById(id) as any
  } catch {
    notFound()
  }

  const [user, technicians] = await Promise.all([
    getUser(),
    getAllTechnicians(),
  ])

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/dashboard/requests">
          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </Link>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex-1 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">
                {request.ticket_id}
              </h1>
              <Badge className={cn('border', getPriorityColor(request.priority))}>
                {formatPriority(request.priority)}
              </Badge>
              <Badge className={cn('border', getStatusColor(request.status))}>
                {formatStatus(request.status)}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Submitted on {formatDateTime(request.created_at)}
            </p>
          </div>
          <DownloadPDFButton request={request as any} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-red-600" />
              Customer Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <InfoRow icon={Building2} label="Company" value={request.company_name} />
              <InfoRow icon={Building2} label="Contact Person" value={request.contact_person} />
              <InfoRow icon={Phone} label="Phone" value={request.contact_number} />
              <InfoRow icon={Mail} label="Email" value={request.email} />
            </div>
            <Separator className="my-3" />
            <div className="flex items-start gap-3 py-1">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-400">Address</div>
                <div className="text-sm font-medium text-gray-900">
                  {request.address}, {request.city}, {request.state} — {request.pincode}
                </div>
              </div>
            </div>
            {/* Google Maps Link */}
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(`${request.address}, ${request.city}, ${request.state} ${request.pincode}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-2"
            >
              <MapPin className="w-3 h-3" />
              View on Google Maps
            </a>
          </div>

          {/* Issue Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-red-600" />
              Issue Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-4">
              <InfoRow icon={Wrench} label="Panel Brand" value={request.panel_brand} />
              <InfoRow icon={Wrench} label="Panel Model" value={request.panel_model} />
              {request.visit_date && (
                <InfoRow icon={Calendar} label="Preferred Visit Date" value={formatDate(request.visit_date)} />
              )}
              {request.visit_time && (
                <InfoRow icon={Clock} label="Preferred Visit Time" value={request.visit_time} />
              )}
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Issue Title</div>
              <div className="font-semibold text-gray-900 mb-3">{request.issue_title}</div>
              <div className="text-xs text-gray-400 mb-1">Description</div>
              <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed whitespace-pre-wrap">
                {request.issue_description}
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-600" />
              Attached Media
              <span className="text-xs text-gray-400 font-normal">
                ({request.media?.length ?? 0} files)
              </span>
            </h2>
            <MediaGallery media={request.media ?? []} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Assign Technician */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full inline-block ${(request as any).technician ? 'bg-blue-500' : 'bg-gray-300'}`} />
              Assigned Technician
            </h2>

            {/* Current assignment info */}
            {(request as any).technician && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100 space-y-1">
                <div className="text-sm font-semibold text-gray-900">{(request as any).technician.full_name}</div>
                <div className="text-xs text-gray-500">{(request as any).technician.email}</div>
                {(request as any).technician.phone && (
                  <a href={`tel:${(request as any).technician.phone}`} className="text-xs text-blue-600 hover:underline block">
                    {(request as any).technician.phone}
                  </a>
                )}
              </div>
            )}

            <AssignTechnician
              requestId={request.id}
              technicians={technicians as any}
              currentAssignedId={request.assigned_to}
            />
          </div>

          {/* Status Management */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Status Management</h2>
            <StatusUpdater
              requestId={request.id}
              currentStatus={request.status}
            />
          </div>

          {/* Technician Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-red-600" />
              Technician Notes
            </h2>
            <AddNoteForm
              requestId={request.id}
              adminEmail={user?.email ?? 'admin'}
            />
            <div className="mt-5 space-y-3">
              {request.notes && request.notes.length > 0 ? (
                request.notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                  >
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.note}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">{note.created_by}</span>
                      <span className="text-xs text-gray-400">
                        {formatDateTime(note.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">No notes yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
