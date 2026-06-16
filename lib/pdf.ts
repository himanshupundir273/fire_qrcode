import jsPDF from 'jspdf'
import { SupportRequest, RequestMedia, TechnicianNote } from '@/types'
import { formatDateTime, formatDate, formatPriority, formatStatus } from './utils'

export function downloadRequestPDF(
  request: SupportRequest & { media?: RequestMedia[]; notes?: TechnicianNote[] }
) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  const addLine = (label: string, value: string | null | undefined, indent = 14) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text(label, indent, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(30)
    doc.text(value || '—', indent + 45, y)
    y += 7
  }

  const addSection = (title: string) => {
    if (y > 260) { doc.addPage(); y = 20 }
    y += 4
    doc.setFillColor(220, 38, 38)
    doc.rect(14, y - 4, pageWidth - 28, 8, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(255)
    doc.text(title, 16, y + 1)
    doc.setTextColor(30)
    y += 10
  }

  // Header
  doc.setFillColor(30, 58, 95)
  doc.rect(0, 0, pageWidth, 30, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(255)
  doc.text('FireGuard Pro', 14, 13)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Fire Alarm Panel Support Report', 14, 22)
  doc.setFontSize(9)
  doc.text(`Ticket: ${request.ticket_id}`, pageWidth - 14, 13, { align: 'right' })
  doc.text(`Generated: ${formatDateTime(new Date().toISOString())}`, pageWidth - 14, 22, { align: 'right' })

  y = 40

  addSection('Customer Information')
  addLine('Company:', request.company_name)
  addLine('Contact Person:', request.contact_person)
  addLine('Phone:', request.contact_number)
  addLine('Email:', request.email)
  addLine('Address:', request.address)
  addLine('City / State:', `${request.city}, ${request.state} - ${request.pincode}`)

  addSection('Panel & Issue Details')
  addLine('Panel Brand:', request.panel_brand)
  addLine('Panel Model:', request.panel_model)
  addLine('Issue Title:', request.issue_title)
  addLine('Priority:', formatPriority(request.priority))
  addLine('Status:', formatStatus(request.status))
  if (request.visit_date) addLine('Visit Date:', formatDate(request.visit_date))
  if (request.visit_time) addLine('Visit Time:', request.visit_time)

  y += 3
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(100)
  doc.text('Issue Description:', 14, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(30)
  const descLines = doc.splitTextToSize(request.issue_description ?? '—', pageWidth - 28)
  doc.text(descLines, 14, y)
  y += descLines.length * 5 + 5

  if (request.notes && request.notes.length > 0) {
    addSection('Technician Notes')
    request.notes.forEach((note) => {
      if (y > 270) { doc.addPage(); y = 20 }
      const lines = doc.splitTextToSize(`• ${note.note}`, pageWidth - 30)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(30)
      doc.text(lines, 16, y)
      y += lines.length * 5
      doc.setFontSize(7)
      doc.setTextColor(150)
      doc.text(`  ${note.created_by} — ${formatDateTime(note.created_at)}`, 16, y)
      y += 7
    })
  }

  // Footer
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(150)
    doc.text(
      `Page ${i} of ${totalPages} — FireGuard Pro — Confidential`,
      pageWidth / 2, doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    )
  }

  doc.save(`${request.ticket_id}-report.pdf`)
}
