'use client'

import { useState } from 'react'
import { Loader2, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { assignRequestToTechnician } from '@/actions/technician'
import { TechnicianProfile } from '@/types'

interface Props {
  requestId: string
  technicians: TechnicianProfile[]
  currentAssignedId: string | null
}

export function AssignTechnician({ requestId, technicians, currentAssignedId }: Props) {
  const [selectedId, setSelectedId] = useState(currentAssignedId ?? '')
  const [loading, setLoading] = useState(false)

  const handleAssign = async () => {
    if (!selectedId) return
    setLoading(true)
    try {
      await assignRequestToTechnician(requestId, selectedId)
      toast.success('Technician assigned and notified via WhatsApp')
    } catch (err: any) {
      toast.error(err.message || 'Failed to assign technician')
    } finally {
      setLoading(false)
    }
  }

  if (technicians.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-2">
        No active technicians available
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <option value="">— Select technician —</option>
        {technicians.map((t) => (
          <option key={t.id} value={t.id}>
            {t.full_name}{t.phone ? ` · ${t.phone}` : ''}
          </option>
        ))}
      </select>

      <Button
        onClick={handleAssign}
        disabled={!selectedId || loading}
        className="w-full bg-red-600 hover:bg-red-700 text-white"
        size="sm"
      >
        {loading ? (
          <><Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />Assigning…</>
        ) : (
          <><UserCheck className="w-3.5 h-3.5 mr-2" />Assign & Notify</>
        )}
      </Button>
    </div>
  )
}
