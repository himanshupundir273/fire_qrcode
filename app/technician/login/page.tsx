'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, HardHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginSchema, LoginFormData } from '@/lib/validations'
import { login } from '@/actions/auth'

export default function TechnicianLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    try {
      await login(data.email, data.password)
    } catch (err: any) {
      if (err?.message?.includes('NEXT_REDIRECT')) return
      toast.error(err.message || 'लॉगिन विफल। कृपया अपनी जानकारी जांचें।')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-2xl mb-4 shadow-lg">
            <HardHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">तकनीशियन लॉगिन</h1>
          <p className="text-gray-500 text-sm mt-1">Notofire Service — फील्ड तकनीशियन पोर्टल</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" suppressHydrationWarning>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">ईमेल पता</Label>
              <Input id="email" type="email" placeholder="आपका ईमेल" className="mt-1" {...register('email')} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">पासवर्ड</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="आपका पासवर्ड"
                  className="pr-10"
                  {...register('password')}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <Button type="submit" disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />लॉगिन हो रहा है...</> : 'लॉगिन करें'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            खाता नहीं है?{' '}
            <Link href="/technician/signup" className="text-orange-600 hover:underline font-medium">
              साइन अप करें
            </Link>
          </p>
        </div>

        <div className="text-center mt-4 space-y-1">
          <p className="text-xs text-gray-400">
            <Link href="/admin/login" className="hover:text-gray-600">एडमिन लॉगिन →</Link>
          </p>
          <p className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-600">← होम पर वापस जाएं</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
