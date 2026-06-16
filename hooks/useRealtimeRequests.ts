'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SupportRequest } from '@/types'

export function useRealtimeRequests(initialRequests: SupportRequest[]) {
  const [requests, setRequests] = useState<SupportRequest[]>(initialRequests)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('support_requests_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'support_requests' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setRequests((prev) => [payload.new as SupportRequest, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setRequests((prev) =>
              prev.map((r) =>
                r.id === payload.new.id ? (payload.new as SupportRequest) : r
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setRequests((prev) => prev.filter((r) => r.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return requests
}
