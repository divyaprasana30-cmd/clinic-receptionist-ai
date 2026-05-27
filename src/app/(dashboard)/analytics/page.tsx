'use client'

import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

const appointmentsTrendData = [
  { name: 'Mon', total: 24, confirmed: 20, pending: 4 },
  { name: 'Tue', total: 19, confirmed: 16, pending: 3 },
  { name: 'Wed', total: 28, confirmed: 25, pending: 3 },
  { name: 'Thu', total: 22, confirmed: 18, pending: 4 },
  { name: 'Fri', total: 31, confirmed: 28, pending: 3 },
  { name: 'Sat', total: 15, confirmed: 14, pending: 1 },
  { name: 'Sun', total: 10, confirmed: 10, pending: 0 },
]

const messageTrendData = [
  { name: 'Week 1', aiHandled: 45, humanTakeover: 8 },
  { name: 'Week 2', aiHandled: 52, humanTakeover: 6 },
  { name: 'Week 3', aiHandled: 58, humanTakeover: 5 },
  { name: 'Week 4', aiHandled: 65, humanTakeover: 4 },
]

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Analytics</h2>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">149</div>
              <p className="text-xs text-green-400 mt-2">+12% from last week</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Confirmation Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">87%</div>
              <p className="text-xs text-green-400 mt-2">+5% from last week</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Avg Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">2.3s</div>
              <p className="text-xs text-green-400 mt-2">-0.5s from last week</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                AI Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">94%</div>
              <p className="text-xs text-green-400 mt-2">+3% from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Appointments Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={appointmentsTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="confirmed" stackId="a" fill="#16a34a" />
                  <Bar dataKey="pending" stackId="a" fill="#eab308" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Message Handling Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={messageTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="aiHandled"
                    stroke="#2563eb"
                    name="AI Handled"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="humanTakeover"
                    stroke="#ef4444"
                    name="Human Takeover"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
