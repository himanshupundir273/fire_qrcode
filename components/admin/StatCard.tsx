import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  color: 'red' | 'blue' | 'purple' | 'green' | 'orange'
  description?: string
}

const colorMap = {
  red: 'bg-red-50 border-red-100 text-red-600',
  blue: 'bg-blue-50 border-blue-100 text-blue-600',
  purple: 'bg-purple-50 border-purple-100 text-purple-600',
  green: 'bg-green-50 border-green-100 text-green-600',
  orange: 'bg-orange-50 border-orange-100 text-orange-600',
}

const iconBg = {
  red: 'bg-red-100',
  blue: 'bg-blue-100',
  purple: 'bg-purple-100',
  green: 'bg-green-100',
  orange: 'bg-orange-100',
}

export function StatCard({ title, value, icon: Icon, color, description }: StatCardProps) {
  return (
    <div className={cn('rounded-xl border p-5 shadow-sm bg-white')}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', iconBg[color])}>
          <Icon className={cn('w-5 h-5', colorMap[color].split(' ')[2])} />
        </div>
      </div>
      <div className="text-3xl font-extrabold text-gray-900">{value.toLocaleString()}</div>
      {description && (
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      )}
    </div>
  )
}
