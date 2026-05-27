import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Stats {
  totalToday: number
  confirmed: number
  pending: number
  cancelled: number
}

interface StatsCardsProps {
  stats: Stats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statItems = [
    { label: 'Total Today', value: stats.totalToday, bgColor: 'bg-blue-600/20', textColor: 'text-blue-400', borderColor: 'border-blue-600/30' },
    { label: 'Confirmed', value: stats.confirmed, bgColor: 'bg-green-600/20', textColor: 'text-green-400', borderColor: 'border-green-600/30' },
    { label: 'Pending', value: stats.pending, bgColor: 'bg-yellow-600/20', textColor: 'text-yellow-400', borderColor: 'border-yellow-600/30' },
    { label: 'Cancelled', value: stats.cancelled, bgColor: 'bg-red-600/20', textColor: 'text-red-400', borderColor: 'border-red-600/30' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <Card key={item.label} className={`bg-slate-900 border-slate-800 ${item.borderColor} border-2`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${item.textColor}`}>
              {item.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
