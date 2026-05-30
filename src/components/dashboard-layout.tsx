'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Calendar,
  MessageSquare,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  Stethoscope,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useClinic } from '@/context/ClinicContext'
import { createClient } from '@/lib/supabase/client'

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface Appointment {
  id: string
  patient_name: string
  patient_phone: string
  appointment_date: string
  appointment_time: string
  status: string
  created_at: string
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { settings } = useClinic()
  const [notifications, setNotifications] = useState<Appointment[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const clinicName = settings.name || 'Clinic'

  useEffect(() => {
    fetchRecentAppointments()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function fetchRecentAppointments() {
    const { data } = await supabase
      .from('appointments')
      .select('id, patient_name, patient_phone, appointment_date, appointment_time, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    if (data) {
      setNotifications(data)
      setUnreadCount(data.filter(a => a.status === 'confirmed').length)
    }
  }

  const menuItems = [
    { href: '/appointments', icon: Calendar, label: 'Appointments' },
    { href: '/inbox', icon: MessageSquare, label: 'Inbox' },
    { href: '/doctors', icon: Users, label: 'Doctors' },
    { href: '/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 overflow-hidden md:w-64 md:overflow-visible`}
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ClinicAI</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start gap-3 ${
                    isActive ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=ClinicAI" />
              <AvatarFallback>{clinicName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{clinicName}</p>
              <p className="text-xs text-slate-400">Admin Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-slate-300 hover:text-white"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <h1 className="text-lg font-semibold text-white">{clinicName}</h1>
          </div>

          {/* Bell with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-300 hover:text-white relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50">
                <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="text-white font-semibold text-sm">Recent Appointments</h3>
                  <Link
                    href="/appointments"
                    className="text-blue-400 text-xs hover:underline"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all
                  </Link>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-6">No appointments</p>
                  ) : (
                    notifications.map((appt) => (
                      <div key={appt.id} className="px-4 py-3 border-b border-slate-700 hover:bg-slate-700 transition-colors">
                        <div className="flex items-center justify-between">
                          <p className="text-white text-sm font-medium">{appt.patient_name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            appt.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                            appt.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {appt.status}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {appt.appointment_date} at {appt.appointment_time}
                        </p>
                        <p className="text-slate-500 text-xs">{appt.patient_phone}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-slate-950 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}