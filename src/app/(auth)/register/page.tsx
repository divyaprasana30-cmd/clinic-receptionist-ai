'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
  const [clinicName, setClinicName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleRegister() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { clinic_name: clinicName }
      }
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">ClinicAI</span>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Register your clinic</h1>
            <p className="text-slate-400 mt-1">Start your free trial today</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm">
              ✅ Account created! Check your email to confirm. Redirecting to login...
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Clinic Name</Label>
              <Input
                type="text"
                placeholder="Sunrise Clinic"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-300">Email</Label>
              <Input
                type="email"
                placeholder="clinic@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-300">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white mt-1"
              />
            </div>
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
            onClick={handleRegister}
            disabled={loading || success}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>

          <p className="text-center text-slate-400 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-blue-400 hover:text-blue-300">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}