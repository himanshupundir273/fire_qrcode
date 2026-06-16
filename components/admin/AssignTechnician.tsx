'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { UserCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { assignRequestToTechnician } from '@/actions/technician'
import { TechnicianProfile } from '@/types'

export function AssignTechnician({
  requestId,
  technicians,
  currentAssignedId,
}: {
  requestId: string
  technicians: TechnicianProfile[]
  currentAssignedId: string | null
}) {
  const router = useRouter()
  const [selected, setSelected] = useState(currentAssignedId || '')
  const [loading, setLoading] = useState(false)

  const handleAssign = async () => {
    if (!selected) { toast.error('Please select a technician.'); return }
    setLoading(true)
    try {
      await assignRequestToTechnician(requestId, selected)
      toast.success('Request assigned to technician!')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Failed to assign.')
    } finally {
      setLoading(false)
    }
  }

  if (technicians.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-3">
        No technicians registered yet.{' '}
        <a href="/technician/signup" className="text-blue-500 hover:underline" target="_blank">
          Create one →
        </a>
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-red-500">
          <SelectValue placeholder="Select a technician" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg">
          {technicians.map((t) => (
            <SelectItem key={t.id} value={t.id}
              className="text-gray-900 hover:bg-red-50 hover:text-red-700 cursor-pointer py-2">
              <div>
                <span className="font-medium">{t.full_name}</span>
                <span className="text-gray-400 ml-2 text-xs">{t.email}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={handleAssign}
        disabled={loading || selected === currentAssignedId}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Assigning...</>
          : <><UserCheck className="w-4 h-4 mr-2" />{currentAssignedId ? 'Reassign' : 'Assign'} Technician</>}
      </Button>
    </div>
  )
}
