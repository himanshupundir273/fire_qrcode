'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { acceptRequest, rejectRequest, technicianMarkComplete } from '@/actions/technician'
import { Status } from '@/types'

export function TechnicianActionPanel({
  requestId,
  status,
  isAssignedToMe,
}: {
  requestId: string
  status: Status
  isAssignedToMe: boolean
}) {
  const router = useRouter()
  const [rejectNote, setRejectNote] = useState('')
  const [showReject, setShowReject] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const handleAccept = async () => {
    setLoading('accept')
    try {
      await acceptRequest(requestId)
      toast.success('Request accepted! It is now your active job.')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async () => {
    setLoading('reject')
    try {
      await rejectRequest(requestId, rejectNote)
      toast.success('Request returned to the pool.')
      router.push('/technician/dashboard')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(null)
    }
  }

  const handleComplete = async () => {
    setLoading('complete')
    try {
      await technicianMarkComplete(requestId)
      toast.success('Marked as completed!')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(null)
    }
  }

  // Open request — anyone can accept
  if (status === 'pending' && !isAssignedToMe) {
    return (
      <div className="bg-white rounded-xl border-2 border-blue-200 p-5 shadow-sm space-y-3">
        <div className="text-sm font-semibold text-gray-900">Available Request</div>
        <p className="text-sm text-gray-500">Accept this request to take it on. Once you accept, it will be assigned to you exclusively.</p>
        <Button onClick={handleAccept} disabled={!!loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          {loading === 'accept'
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Accepting...</>
            : <><CheckCircle className="w-4 h-4 mr-2" />Accept Request</>}
        </Button>
      </div>
    )
  }

  // My active job — can reject (return) or complete
  if (status === 'in_progress' && isAssignedToMe) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
        <div className="text-sm font-semibold text-gray-900">Your Active Job</div>

        <Button onClick={handleComplete} disabled={!!loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white">
          {loading === 'complete'
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Marking...</>
            : <><CheckCircle className="w-4 h-4 mr-2" />Mark as Completed</>}
        </Button>

        {!showReject ? (
          <button onClick={() => setShowReject(true)}
            className="w-full text-sm text-red-500 hover:text-red-700 text-center py-1">
            Can't handle this? Return to pool →
          </button>
        ) : (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <Textarea
              placeholder="Reason for returning (optional)"
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
              className="resize-none text-sm"
              rows={2}
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1"
                onClick={() => setShowReject(false)}>Cancel</Button>
              <Button size="sm" onClick={handleReject} disabled={!!loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                {loading === 'reject' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Return Request'}
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (status === 'completed') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div>
          <p className="font-semibold text-green-800">Completed</p>
          <p className="text-sm text-green-600">This request has been resolved.</p>
        </div>
      </div>
    )
  }

  return null
}
