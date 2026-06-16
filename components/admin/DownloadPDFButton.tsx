'use client'

import { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SupportRequest, RequestMedia, TechnicianNote } from '@/types'

export function DownloadPDFButton({
  request,
}: {
  request: SupportRequest & { media?: RequestMedia[]; notes?: TechnicianNote[] }
}) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    const { downloadRequestPDF } = await import('@/lib/pdf')
    downloadRequestPDF(request)
    setLoading(false)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={loading}
      className="gap-2"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
      Download PDF
    </Button>
  )
}
