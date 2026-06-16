'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { addTechnicianNote } from '@/actions/requests'

export function AddNoteForm({
  requestId,
  adminEmail,
}: {
  requestId: string
  adminEmail: string
}) {
  const [note, setNote] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!note.trim()) return
    startTransition(async () => {
      try {
        await addTechnicianNote(requestId, note.trim(), adminEmail)
        setNote('')
        toast.success('Note added successfully')
      } catch {
        toast.error('Failed to add note')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a technician note or update..."
        className="resize-none"
        rows={3}
      />
      <Button
        type="submit"
        size="sm"
        disabled={!note.trim() || isPending}
        className="bg-slate-800 hover:bg-slate-700 text-white"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Send className="w-4 h-4 mr-2" />
        )}
        Add Note
      </Button>
    </form>
  )
}
