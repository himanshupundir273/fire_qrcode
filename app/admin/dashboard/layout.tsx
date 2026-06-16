import { redirect } from 'next/navigation'
import { getUser } from '@/actions/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  if (!user) redirect('/admin/login')

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar userEmail={user.email ?? ''} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
