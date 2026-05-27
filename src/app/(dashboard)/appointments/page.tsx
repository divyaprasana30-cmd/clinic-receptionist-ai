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
  const supabase = createClient()

  useEffect(() => {
    fetchAppointments()

    const channel = supabase
      .channel('appointments')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments'
      }, () => {
        fetchAppointments()
      })
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

  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.filter(a => a.appointment_date === today)
  const confirmed = todayAppointments.filter(a => a.status === 'confirmed').length
  const pending = todayAppointments.filter(a => a.status === 'pending').length
  const cancelled = todayAppointments.filter(a => a.status === 'cancelled').length

  const stats = {
    totalToday: todayAppointments.length,
    confirmed,
    pending,
    cancelled
  }

  const tableData = appointments.map(a => ({
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
        <AppointmentsHeader />
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