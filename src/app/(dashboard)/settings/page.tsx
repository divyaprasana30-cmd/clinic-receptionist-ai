'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DashboardLayout } from '@/components/dashboard-layout'
import { useClinic } from '@/context/ClinicContext'

export default function SettingsPage() {
  const { setSettings } = useClinic()
  const [clinic, setClinic] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    whatsapp_number: '',
    timezone: 'Asia/Kolkata',
  })
  const supabase = createClient()

  useEffect(() => {
    fetchClinic()
  }, [])

  async function fetchClinic() {
    const { data } = await supabase
      .from('clinics')
      .select('*')
      .limit(1)
      .single()

    if (data) {
      setClinic(data)
      setForm({
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        whatsapp_number: data.whatsapp_number || '',
        timezone: data.timezone || 'Asia/Kolkata',
      })
    }
    setLoading(false)
  }

  async function saveSettings() {
    setSaving(true)
    await supabase
      .from('clinics')
      .update({
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        whatsapp_number: form.whatsapp_number,
        timezone: form.timezone,
      })
      .eq('id', clinic.id)

    setSettings({
      name: form.name,
      email: form.email,
      address: form.address,
      whatsapp_number: form.whatsapp_number,
      timezone: form.timezone,
      auto_respond: true,
      email_alerts: true,
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-slate-400">Loading settings...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>

        {/* Clinic Information */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Clinic Information</h2>
            <p className="text-slate-400 text-sm">Update your clinic details</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-1">Clinic Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium block mb-1">Phone Number</label>
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium block mb-1">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium block mb-1">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium block mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={form.whatsapp_number}
                onChange={e => setForm({ ...form, whatsapp_number: e.target.value })}
                placeholder="+14155238886"
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <p className="text-slate-500 text-xs mt-1">This is the WhatsApp number patients message to book appointments</p>
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium block mb-1">Timezone</label>
              <select
                value={form.timezone}
                onChange={e => setForm({ ...form, timezone: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Receptionist */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">AI Receptionist</h2>
            <p className="text-slate-400 text-sm">Configure your WhatsApp AI behavior</p>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-700">
            <div>
              <p className="text-white text-sm font-medium">Auto-respond to Messages</p>
              <p className="text-slate-400 text-xs">AI automatically responds to incoming messages</p>
            </div>
            <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-white text-sm font-medium">Email Alerts</p>
              <p className="text-slate-400 text-xs">Receive email alerts for new bookings</p>
            </div>
            <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={saveSettings}
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 rounded-xl transition-colors"
        >
          {saving ? 'Saving...' : saved ? '✅ Saved!' : 'Save Changes'}
        </button>
      </div>
    </DashboardLayout>
  )
}