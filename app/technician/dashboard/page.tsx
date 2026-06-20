import { getOpenRequests, getMyRequests, getTechnicianProfile } from '@/actions/technician'
import { TechnicianDashboardClient } from '@/components/technician/TechnicianDashboardClient'

export const dynamic = 'force-dynamic'

export default async function TechnicianDashboardPage() {
  const [openRequests, myRequests, profile] = await Promise.all([
    getOpenRequests(),
    getMyRequests(),
    getTechnicianProfile(),
  ])

  const active = myRequests.filter(r => r.status === 'in_progress')
  const completed = myRequests.filter(r => r.status === 'completed')

  return (
    <TechnicianDashboardClient
      name={profile?.full_name ?? 'Technician'}
      openRequests={openRequests}
      activeRequests={active}
      completedCount={completed.length}
    />
  )
}
