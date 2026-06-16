'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { updateRequestStatus } from '@/actions/requests'
import { Status } from '@/types'
import { cn, getStatusColor, formatStatus } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const statuses: Status[] = [
  'pending', 'assigned', 'in_progress', 'waiting_for_parts', 'completed', 'closed',
]

export function StatusUpdater({
  requestId,
  currentStatus,
}: {
  requestId: string
  currentStatus: Status
}) {
  const [status, setStatus] = useState<Status>(currentStatus)
  const [selected, setSelected] = useState<Status>(currentStatus)
  const [isPending, startTransition] = useTransition()

  const handleUpdate = () => {
    startTransition(async () => {
      try {
        await updateRequestStatus(requestId, selected)
        setStatus(selected)
        toast.success('Status updated successfully')
      } catch {
        toast.error('Failed to update status')
      }
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Current:</span>
        <Badge className={cn('border', getStatusColor(status))}>
          {formatStatus(status)}
        </Badge>
      </div>
      <div className="flex gap-2">
        <Select value={selected} onValueChange={(v) => setSelected(v as Status)}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {formatStatus(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleUpdate}
          disabled={isPending || selected === status}
          className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
          size="sm"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update'}
        </Button>
      </div>
    </div>
  )
}
