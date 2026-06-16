'use client'

import { useState } from 'react'
import { MessageCircle, Loader2, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { testWhatsAppNotification } from '@/actions/whatsapp-test'

interface Result {
  name: string
  phone: string
  status: 'sent' | 'failed' | 'error'
  httpStatus: number
  response: any
}

export function WhatsAppTester() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Result[]>([])
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const run = async () => {
    setLoading(true)
    setDone(false)
    setResults([])
    setError(null)
    setShowDetails(false)

    const res = await testWhatsAppNotification()
    setLoading(false)
    setDone(true)
    setResults(res.results as Result[])
    setError(res.error)
  }

  const sentCount = results.filter((r) => r.status === 'sent').length
  const failedCount = results.filter((r) => r.status !== 'sent').length

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-green-600" />
          <h2 className="font-semibold text-gray-900 text-sm">WhatsApp Notification Test</h2>
        </div>
        <Button
          onClick={run}
          disabled={loading}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white text-xs"
        >
          {loading ? (
            <><Loader2 className="w-3 h-3 mr-1.5 animate-spin" />Sending…</>
          ) : (
            'Send Test'
          )}
        </Button>
      </div>

      {/* Error before results (env / db issue) */}
      {done && error && results.length === 0 && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Summary row */}
      {done && results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {sentCount > 0 && (
              <span className="flex items-center gap-1 text-sm text-green-700 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                {sentCount} sent
              </span>
            )}
            {failedCount > 0 && (
              <span className="flex items-center gap-1 text-sm text-red-600 font-medium">
                <XCircle className="w-4 h-4" />
                {failedCount} failed
              </span>
            )}
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
            >
              {showDetails ? 'Hide details' : 'Show details'}
              {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {showDetails && (
            <div className="space-y-2">
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-3 text-xs ${
                    r.status === 'sent'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800">{r.name}</span>
                    <span className={r.status === 'sent' ? 'text-green-600' : 'text-red-600'}>
                      {r.status === 'sent' ? '✓ Sent' : `✗ ${r.status} (HTTP ${r.httpStatus})`}
                    </span>
                  </div>
                  <div className="text-gray-500 font-mono">+{r.phone}</div>
                  {r.status !== 'sent' && (
                    <div className="mt-1 text-red-600 break-all">
                      {typeof r.response === 'string'
                        ? r.response
                        : JSON.stringify(r.response)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!done && !loading && (
        <p className="text-xs text-gray-400">
          Sends a test WhatsApp message to all active technicians using the <span className="font-mono">qr_code</span> template.
        </p>
      )}
    </div>
  )
}
