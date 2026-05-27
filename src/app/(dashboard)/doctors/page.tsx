'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { DoctorCard } from '@/components/doctor-card'
import { Plus } from 'lucide-react'

const doctorsData = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'General Practitioner',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    todayAppointments: 5,
    status: 'active' as const,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Cardiologist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    todayAppointments: 3,
    status: 'active' as const,
  },
  {
    id: '3',
    name: 'Dr. James Martinez',
    specialization: 'Orthopedic Surgeon',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    todayAppointments: 4,
    status: 'active' as const,
  },
  {
    id: '4',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatrician',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    todayAppointments: 0,
    status: 'inactive' as const,
  },
  {
    id: '5',
    name: 'Dr. David Lee',
    specialization: 'Dermatologist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    todayAppointments: 6,
    status: 'active' as const,
  },
  {
    id: '6',
    name: 'Dr. Lisa Thompson',
    specialization: 'Neurologist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    todayAppointments: 2,
    status: 'active' as const,
  },
]

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState(doctorsData)

  const handleStatusToggle = (id: string) => {
    setDoctors(
      doctors.map((doc) =>
        doc.id === id
          ? { ...doc, status: doc.status === 'active' ? 'inactive' : 'active' }
          : doc
      )
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Doctors</h2>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="w-4 h-4" />
            Add Doctor
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onStatusToggle={handleStatusToggle}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
