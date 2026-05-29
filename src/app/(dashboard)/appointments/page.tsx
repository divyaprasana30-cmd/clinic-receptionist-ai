'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DashboardLayout } from '@/components/dashboard-layout'
import { StatsCards } from '@/components/stats-cards'
import { AppointmentsTable } from '@/components/appointments-table'
import { AppointmentsHeader } from '@/components/appointments-header'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('today')
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchAppointments()

    const channel = supabase
      .channel('appointments')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments'
      }, () => fetchAppointments())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchAppointments() {
    const { data } = await supabase
      .from('appointments')
      .select(`*, doctors (name, specialization)`)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })

    if (data) setAppointments(data)
    setLoading(false)
  }

  async function cancelAppointment(id: string) {
    await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', id)
    fetchAppointments()
  }

  function exportSchedule() {
    const exportDate = selectedDate === 'today'
      ? new Date().toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
    window.open(`/api/export?date=${exportDate}`, '_blank')
  }

  const today = new Date().toISOString().split('T')[0]

  const filteredAppointments = appointments.filter(a => {
    const matchesDate = selectedDate === 'today' ? a.appointment_date === today : true
    const matchesSearch = searchQuery === '' ||
      a.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.patient_phone?.includes(searchQuery) ||
      a.doctors?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDate && matchesSearch
  })

  const todayAppointments = appointments.filter(a => a.appointment_date === today)
  const stats = {
    totalToday: todayAppointments.length,
    confirmed: todayAppointments.filter(a => a.status === 'confirmed').length,
    pending: todayAppointments.filter(a => a.status === 'pending').length,
    cancelled: todayAppointments.filter(a => a.status === 'cancelled').length,
  }

  const tableData = filteredAppointments.map(a => ({
    id: a.id,
    patientName: a.patient_name,
    phoneNumber: a.patient_phone,
    doctorName: a.doctors?.name || 'Unknown',
    dateTime: `${a.appointment_date} ${a.appointment_time?.slice(0, 5)}`,
    status: a.status as 'confirmed' | 'pending' | 'cancelled',
  }))

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <AppointmentsHeader
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
          <button
            onClick={exportSchedule}
            className="mt-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap"
          >
            📄 Export Schedule
          </button>
        </div>
        {loading ? (
          <div className="text-slate-400 text-center py-8">Loading appointments...</div>
        ) : (
          <>
            <StatsCards stats={stats} />
            <AppointmentsTable
              appointments={tableData}
              onCancel={cancelAppointment}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}