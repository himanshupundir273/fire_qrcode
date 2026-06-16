import { redirect } from 'next/navigation'
import { getTechnicianProfile } from '@/actions/technician'
import { TechnicianSidebar } from '@/components/technician/TechnicianSidebar'

export default async function TechnicianDashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getTechnicianProfile()
  if (!profile) redirect('/technician/login')

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <TechnicianSidebar name={profile.full_name} email={profile.email} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
