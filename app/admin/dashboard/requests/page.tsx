import { getRequests } from '@/actions/requests'
import { RequestsTable } from '@/components/admin/RequestsTable'
import { SupportRequest } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'All Requests — Admin Dashboard',
}

export default async function RequestsPage() {
  const requests = await getRequests()

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Support Requests</h1>
        <p className="text-gray-500 text-sm mt-1">
          View, filter, and manage all fire alarm support requests
        </p>
      </div>
      <RequestsTable requests={requests as SupportRequest[]} />
    </div>
  )
}
