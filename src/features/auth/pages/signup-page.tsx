'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth'
import {
  Button,
  Card,
  Input,
  Spinner,
  Link
} from '@heroui/react'
import {
  User,
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Shield
} from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()
  const { signup, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState<{text: string; type: 'success' | 'error' | 'info'} | null>(null)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!validateEmail(email)) {
      setMessage({
        text: 'Please enter a valid email address',
        type: 'error'
      })
      return
    }

    if (!validateName(name)) {
      setMessage({
        text: 'Name must be at least 2 characters long',
        type: 'error'
      })
      return
    }

    // Direct signup - no PIN verification needed
    const result = await signup(email, name)
    
    if (result.success) {
      setMessage({
        text: 'Account created successfully! Please sign in.',
        type: 'success'
      })
      setTimeout(() => {
        router.push('/signin')
      }, 2000)
    } else {
      setMessage({
        text: result.error?.message || 'Failed to create account. Please try again.',
        type: 'error'
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="w-full max-w-md">
        <Card className="p-6 md:p-8 shadow-2xl dark:shadow-gray-900/30 border dark:border-gray-800">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl blur bg-gradient-to-br from-blue-500 to-purple-600 opacity-70"></div>
                <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-xl">
                  TradeGuard AI
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Trademark Protection Platform
                </span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Start protecting your trademarks today
            </p>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    Full Name
                    {name && validateName(name) && (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    )}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                      className="w-full pl-10"
                      required
                      aria-label="Full Name"
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  {name && !validateName(name) && (
                    <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Name must be at least 2 characters long
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    Email Address
                    {email && validateEmail(email) && (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    )}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="w-full pl-10"
                      required
                      aria-label="Email Address"
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  {email && !validateEmail(email) && (
                    <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Please enter a valid email address
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-3"
                isDisabled={isLoading || !email || !name || !validateEmail(email) || !validateName(name)}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Feedback message */}
            {message && (
              <div className={`p-3 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : message.type === 'error'
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
              }`}>
                <div className="flex items-center gap-2">
                  {message.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />}
                  {message.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />}
                  {message.type === 'info' && <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  <p className={`text-sm ${
                    message.type === 'success'
                      ? 'text-green-800 dark:text-green-300'
                      : message.type === 'error'
                      ? 'text-red-800 dark:text-red-300'
                      : 'text-blue-800 dark:text-blue-300'
                  }`}>
                    {message.text}
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="relative my-6">
              <hr className="border-gray-300 dark:border-gray-700" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white dark:bg-gray-900 px-2 text-xs text-gray-500 dark:text-gray-400 uppercase">
                  Already have an account?
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <Link href="/signin" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                Sign in to your account
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
