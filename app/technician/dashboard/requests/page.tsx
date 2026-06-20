import { getOpenRequests, getMyRequests } from '@/actions/technician'
import { TechnicianRequestsClient } from '@/components/technician/TechnicianRequestsClient'

export const dynamic = 'force-dynamic'

export default async function TechnicianRequestsPage() {
  const [openRequests, myRequests] = await Promise.all([getOpenRequests(), getMyRequests()])

  return <TechnicianRequestsClient openRequests={openRequests} myRequests={myRequests} />
}
