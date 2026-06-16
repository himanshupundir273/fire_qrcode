import Link from 'next/link'
import {
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  ArrowRight,
} from 'lucide-react'
import { getDashboardStats, getRequests } from '@/actions/requests'
import { StatCard } from '@/components/admin/StatCard'
import { RequestCard } from '@/components/admin/RequestCard'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [stats, requests] = await Promise.all([
    getDashboardStats(),
    getRequests(),
  ])

  const recentRequests = requests.slice(0, 6)

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of all fire alarm support requests
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Total Requests"
          value={stats.total}
          icon={ClipboardList}
          color="blue"
          description="All time"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="orange"
          description="Awaiting assignment"
        />
        <StatCard
          title="In Progress"
          value={stats.in_progress}
          icon={Activity}
          color="purple"
          description="Active repairs"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          color="green"
          description="Resolved issues"
        />
        <StatCard
          title="Critical"
          value={stats.critical}
          icon={AlertTriangle}
          color="red"
          description="Urgent attention"
        />
      </div>

      {/* Recent Requests */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
        <Link href="/admin/dashboard/requests">
          <Button variant="outline" size="sm" className="text-sm">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {recentRequests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-gray-500 font-medium">No requests yet</h3>
          <p className="text-sm text-gray-400 mt-1">
            Support requests will appear here after submission
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {recentRequests.map((request) => (
            <RequestCard key={request.id} request={request as any} />
          ))}
        </div>
      )}
    </div>
  )
}
