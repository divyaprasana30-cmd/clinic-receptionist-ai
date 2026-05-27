import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Eye, X } from 'lucide-react'

interface Appointment {
  id: string
  patientName: string
  phoneNumber: string
  doctorName: string
  dateTime: string
  status: 'confirmed' | 'pending' | 'cancelled'
}

interface AppointmentsTableProps {
  appointments: Appointment[]
}

export function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-600/20 text-green-300 border-green-600/30'
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30'
      case 'cancelled':
        return 'bg-red-600/20 text-red-300 border-red-600/30'
      default:
        return 'bg-slate-600/20 text-slate-300'
    }
  }

  if (appointments.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
        <p className="text-slate-400">No appointments found. Try adjusting your search.</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-800 bg-slate-800/50 hover:bg-slate-800/50">
            <TableHead className="text-slate-300">Patient Name</TableHead>
            <TableHead className="text-slate-300">Phone Number</TableHead>
            <TableHead className="text-slate-300">Doctor</TableHead>
            <TableHead className="text-slate-300">Date & Time</TableHead>
            <TableHead className="text-slate-300">Status</TableHead>
            <TableHead className="text-slate-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow
              key={appointment.id}
              className="border-slate-800 hover:bg-slate-800/50"
            >
              <TableCell className="text-white font-medium">
                {appointment.patientName}
              </TableCell>
              <TableCell className="text-slate-300">
                {appointment.phoneNumber}
              </TableCell>
              <TableCell className="text-slate-300">
                {appointment.doctorName}
              </TableCell>
              <TableCell className="text-slate-300">
                {appointment.dateTime}
              </TableCell>
              <TableCell>
                <Badge
                  className={`capitalize border ${getStatusColor(
                    appointment.status
                  )}`}
                  variant="outline"
                >
                  {appointment.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
