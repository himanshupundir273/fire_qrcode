'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HardHat, LayoutDashboard, ClipboardList, LogOut, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { technicianLogout } from '@/actions/technician'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/technician/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/technician/dashboard/requests', icon: ClipboardList, label: 'My Requests' },
]

export function TechnicianSidebar({ name, email }: { name: string; email: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-orange-700">
        <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <HardHat className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-white font-bold text-sm">Notofire Service</div>
          <div className="text-orange-300 text-xs">Technician Portal</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active =
            item.href === '/technician/dashboard'
              ? pathname === '/technician/dashboard'
              : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-orange-600 text-white'
                  : 'text-orange-200 hover:text-white hover:bg-orange-700'
              )}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-orange-700">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-orange-700 mb-3">
          <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-orange-200" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-white font-medium truncate">{name}</div>
            <div className="text-xs text-orange-300 truncate">{email}</div>
          </div>
        </div>
        <form action={technicianLogout}>
          <Button type="submit" variant="ghost"
            className="w-full justify-start text-orange-300 hover:text-white hover:bg-orange-700 text-sm">
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </form>
      </div>
    </>
  )

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-orange-700 text-white rounded-lg p-2 shadow-lg"
        onClick={() => setOpen(true)}>
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setOpen(false)} />
      )}

      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-orange-800 flex flex-col transition-transform duration-200 md:hidden',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <button className="absolute top-4 right-4 text-orange-300 hover:text-white" onClick={() => setOpen(false)}>
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>

      <aside className="hidden md:flex w-64 bg-orange-800 flex-col flex-shrink-0 h-full">
        {sidebarContent}
      </aside>
    </>
  )
}
