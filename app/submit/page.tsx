import Link from 'next/link'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { SupportRequestForm } from '@/components/forms/SupportRequestForm'

export const metadata = {
  title: 'Submit Support Request — Notofire Service',
}

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Notofire Service</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Submit Support Request</h1>
          <p className="text-gray-500 mt-2">
            Fill in the details below and we&apos;ll assign a certified technician as soon as possible.
          </p>
        </div>

        <SupportRequestForm />
      </div>
    </div>
  )
}
