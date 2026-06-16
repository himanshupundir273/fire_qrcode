'use client'

export function CopyTicketButton({ ticket }: { ticket: string }) {
  return (
    <button
      onClick={() => navigator.clipboard?.writeText(ticket)}
      className="text-xs text-slate-400 hover:text-white mt-2 transition-colors"
    >
      Click to copy
    </button>
  )
}
