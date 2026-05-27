import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface AppointmentsHeaderProps {
  selectedDate: string
  onDateChange: (date: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function AppointmentsHeader({
  selectedDate,
  onDateChange,
  searchQuery,
  onSearchChange,
}: AppointmentsHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-white">Appointments</h2>
        <Button
          onClick={() => onDateChange('today')}
          className={`${
            selectedDate === 'today'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          Today
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by patient name, phone, or doctor..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-600"
        />
      </div>
    </div>
  )
}
