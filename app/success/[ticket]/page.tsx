import Link from 'next/link'
import { CheckCircle, ArrowRight, MessageCircle, Home, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CopyTicketButton } from '@/components/CopyTicketButton'

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ ticket: string }>
}) {
  const { ticket } = await params

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <Badge className="bg-green-100 text-green-700 border-green-200 mb-4">
            Request Submitted Successfully
          </Badge>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your Support Request Has Been Received!
          </h1>
          <p className="text-gray-500 mb-6">
            Our team will review your request and assign a certified technician shortly.
            Please save your ticket ID for future reference.
          </p>

          {/* Ticket ID */}
          <div className="bg-slate-900 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mb-2">
              <Ticket className="w-4 h-4" />
              Your Ticket ID
            </div>
            <div className="text-2xl font-mono font-bold text-white tracking-widest">
              {ticket}
            </div>
            <CopyTicketButton ticket={ticket} />
          </div>

          {/* Timeline */}
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              What happens next?
            </p>
            {[
              { step: '1', text: 'We review your request (within 1 hour)' },
              { step: '2', text: 'A technician is assigned to your ticket' },
              { step: '3', text: 'You receive a confirmation call' },
              { step: '4', text: 'Technician visits on your preferred date' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-red-600">{item.step}</span>
                </div>
                <span className="text-sm text-gray-600">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </Link>
            <a
              href="https://wa.me/919999999999?text=Hello, my ticket ID is ${ticket}"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                Follow up on WhatsApp
              </Button>
            </a>
          </div>

          <div className="mt-4">
            <Link href="/submit">
              <Button variant="ghost" size="sm" className="text-gray-500">
                Submit Another Request
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
