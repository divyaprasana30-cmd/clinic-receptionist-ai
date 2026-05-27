'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Save } from 'lucide-react'

export default function SettingsPage() {
  const [clinicName, setClinicName] = useState('Sunrise Clinic')
  const [clinicPhone, setClinicPhone] = useState('+1 (555) 123-4567')
  const [clinicEmail, setClinicEmail] = useState('info@sunriseclinic.com')
  const [aiAutoRespond, setAiAutoRespond] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(false)

  const handleSave = () => {
    // Handle save logic
    console.log('Settings saved')
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-slate-400 mt-2">Manage your clinic and AI receptionist settings</p>
        </div>

        {/* Clinic Information */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Clinic Information</CardTitle>
            <CardDescription className="text-slate-400">
              Update your clinic details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clinicName" className="text-slate-300">
                Clinic Name
              </Label>
              <Input
                id="clinicName"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinicPhone" className="text-slate-300">
                Phone Number
              </Label>
              <Input
                id="clinicPhone"
                value={clinicPhone}
                onChange={(e) => setClinicPhone(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinicEmail" className="text-slate-300">
                Email Address
              </Label>
              <Input
                id="clinicEmail"
                value={clinicEmail}
                onChange={(e) => setClinicEmail(e.target.value)}
                type="email"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Receptionist Settings */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">AI Receptionist</CardTitle>
            <CardDescription className="text-slate-400">
              Configure your WhatsApp AI receptionist behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="font-medium text-white">Auto-respond to Messages</p>
                <p className="text-sm text-slate-400">
                  Enable AI to automatically respond to incoming messages
                </p>
              </div>
              <Switch
                checked={aiAutoRespond}
                onCheckedChange={setAiAutoRespond}
              />
            </div>

            <Separator className="bg-slate-800" />

            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="font-medium text-white">In-app Notifications</p>
                <p className="text-sm text-slate-400">
                  Get notified about new messages and appointments
                </p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            <Separator className="bg-slate-800" />

            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="font-medium text-white">Email Alerts</p>
                <p className="text-sm text-slate-400">
                  Receive email alerts for important events
                </p>
              </div>
              <Switch
                checked={emailAlerts}
                onCheckedChange={setEmailAlerts}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Account</CardTitle>
            <CardDescription className="text-slate-400">
              Manage your account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
              Change Password
            </Button>
            <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
              Two-Factor Authentication
            </Button>
            <Button
              variant="outline"
              className="w-full border-red-700 text-red-400 hover:bg-red-600/20"
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
