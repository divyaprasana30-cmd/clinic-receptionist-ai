import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Edit2 } from 'lucide-react'

interface Doctor {
  id: string
  name: string
  specialization: string
  avatar: string
  todayAppointments: number
  status: 'active' | 'inactive'
}

interface DoctorCardProps {
  doctor: Doctor
  onStatusToggle: (id: string) => void
}

export function DoctorCard({ doctor, onStatusToggle }: DoctorCardProps) {
  const initials = doctor.name
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <Avatar className="h-12 w-12">
            <AvatarImage src={doctor.avatar} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <Badge
            className={`${
              doctor.status === 'active'
                ? 'bg-green-600/20 text-green-300 border-green-600/30'
                : 'bg-slate-600/20 text-slate-300 border-slate-600/30'
            } border`}
          >
            {doctor.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-white text-lg">{doctor.name}</h3>
          <p className="text-sm text-slate-400">{doctor.specialization}</p>
        </div>

        <div className="bg-slate-800 rounded p-3">
          <p className="text-xs text-slate-400 mb-1">Today&apos;s Appointments</p>
          <p className="text-2xl font-bold text-blue-400">
            {doctor.todayAppointments}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-300">
              {doctor.status === 'active' ? 'Enable' : 'Disable'}
            </span>
            <Switch
              checked={doctor.status === 'active'}
              onCheckedChange={() => onStatusToggle(doctor.id)}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
