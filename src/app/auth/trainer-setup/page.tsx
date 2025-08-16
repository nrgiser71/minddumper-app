'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function TrainerSetupForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const email = searchParams.get('email')
  const userId = searchParams.get('user_id')

  // Redirect if no email provided
  useEffect(() => {
    if (!email || !userId) {
      router.push('/auth/login?error=Invalid trainer setup link')
    }
  }, [email, userId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setMessage('Wachtwoorden komen niet overeen')
      setIsError(true)
      return
    }
    
    if (password.length < 6) {
      setMessage('Wachtwoord moet minimaal 6 karakters zijn')
      setIsError(true)
      return
    }

    setIsLoading(true)
    setMessage('')
    setIsError(false)

    try {
      // First, sign in the user with a temporary password (we'll update it)
      // This is safe because the account was just created by admin
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email!,
        password: 'temporary-admin-created-password'
      })

      if (signInError) {
        // If sign in fails, try using the admin API to set the password directly
        console.log('Direct sign in failed, using admin-created account flow')
        
        // Update the user's password using admin API
        const response = await fetch('/api/admin/set-trainer-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            password: password
          })
        })

        const result = await response.json()
        
        if (!result.success) {
          setMessage('Fout bij het instellen van wachtwoord: ' + result.error)
          setIsError(true)
          return
        }

        // Now sign in with the new password
        const { error: newSignInError } = await supabase.auth.signInWithPassword({
          email: email!,
          password: password
        })

        if (newSignInError) {
          setMessage('Wachtwoord ingesteld, maar inloggen mislukt. Probeer in te loggen op de normale login pagina.')
          setIsError(true)
          return
        }
      } else {
        // If sign in worked, update the password
        const { error: updateError } = await supabase.auth.updateUser({
          password: password
        })

        if (updateError) {
          setMessage('Fout bij het bijwerken van wachtwoord: ' + updateError.message)
          setIsError(true)
          return
        }
      }

      setMessage('Welkom bij MindDumper! Je account is klaar. Je wordt doorgestuurd naar de app...')
      setIsError(false)
      
      // Redirect to app after 2 seconds
      setTimeout(() => {
        router.push('/app')
      }, 2000)

    } catch {
      setMessage('Er is een fout opgetreden')
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (!email || !userId) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg mx-auto">
        {/* Logo and branding */}
        <div className="flex justify-center mb-8" style={{ marginBottom: '32px' }}>
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-gray-900">MindDumper</h2>
              <p className="text-sm text-gray-500">Brain dump tool</p>
            </div>
          </div>
        </div>

        <div className="text-center" style={{ marginBottom: '48px' }}>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welkom bij MindDumper!
          </h1>
          <p className="text-lg text-gray-600">
            Je trainer account is aangemaakt. Stel je wachtwoord in om te beginnen.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Account: {email}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Gratis trainer account!</p>
              <p className="text-sm text-green-700 mt-1">Volledige toegang tot alle MindDumper functies.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white py-10 px-8 shadow-xl rounded-2xl border border-gray-100">
          <form className="space-y-16" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} onSubmit={handleSubmit}>
            <div className="space-y-12" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700" style={{ marginBottom: '12px' }}>
                  Nieuw wachtwoord
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-4 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors text-gray-900"
                    placeholder="Minimaal 6 karakters"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700" style={{ marginBottom: '12px' }}>
                  Bevestig wachtwoord
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-4 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors text-gray-900"
                    placeholder="Herhaal je wachtwoord"
                  />
                </div>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-lg flex items-start space-x-3 ${isError ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isError ? 'bg-red-100' : 'bg-green-100'}`}>
                  <svg className={`w-3 h-3 ${isError ? 'text-red-600' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isError ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    )}
                  </svg>
                </div>
                <p className={`text-sm font-medium ${isError ? 'text-red-800' : 'text-green-800'}`}>
                  {message}
                </p>
              </div>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Bezig...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Account activeren
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center" style={{ marginTop: '48px' }}>
          <div className="border-t border-gray-200 pt-8" style={{ paddingTop: '32px' }}>
            <p className="text-sm text-gray-500 mb-2">
              © 2025 MindDumper. Trainer Account.
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Hulp nodig? Neem contact op via{' '}
              <a href="mailto:support@minddumper.com" className="text-blue-600 hover:underline">
                support@minddumper.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TrainerSetupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrainerSetupForm />
    </Suspense>
  )
}