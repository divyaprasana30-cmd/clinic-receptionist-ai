'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

type ClinicSettings = {
  name: string
  email: string
  address: string
  whatsapp_number: string
  timezone: string
  auto_respond: boolean
  email_alerts: boolean
}

type ClinicContextType = {
  settings: ClinicSettings
  setSettings: (s: ClinicSettings) => void
  loading: boolean
}

const defaultSettings: ClinicSettings = {
  name: '',
  email: '',
  address: '',
  whatsapp_number: '',
  timezone: 'Asia/Kolkata',
  auto_respond: true,
  email_alerts: true,
}

const ClinicContext = createContext<ClinicContextType>({
  settings: defaultSettings,
  setSettings: () => {},
  loading: true,
})

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ClinicSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('clinics')        // ✅ matches your actual table
        .select('*')
        .limit(1)
        .single()

      if (data) {
        setSettings({
          name: data.name || '',
          email: data.email || '',
          address: data.address || '',
          whatsapp_number: data.whatsapp_number || '',
          timezone: data.timezone || 'Asia/Kolkata',
          auto_respond: data.auto_respond ?? true,
          email_alerts: data.email_alerts ?? true,
        })
      }
      setLoading(false)
    }

    fetchSettings()
  }, [])

  return (
    <ClinicContext.Provider value={{ settings, setSettings, loading }}>
      {children}
    </ClinicContext.Provider>
  )
}

export const useClinic = () => useContext(ClinicContext)