'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const isWelcome = searchParams.get('welcome') === 'true'
  const accessToken = searchParams.get('access_token')
  const refreshToken = searchParams.get('refresh_token')

  useEffect(() => {
    // If we have tokens in URL, set the session
    if (accessToken && refreshToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })
    }
  }, [accessToken, refreshToken])

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
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setMessage('Fout bij het instellen van wachtwoord: ' + error.message)
        setIsError(true)
      } else {
        if (isWelcome) {
          setMessage('Welkom bij MindDumper! Je wachtwoord is ingesteld. Je wordt doorgestuurd naar de app...')
        } else {
          setMessage('Wachtwoord succesvol gewijzigd! Je wordt doorgestuurd naar de app...')
        }
        setIsError(false)
        
        // Redirect to app after 2 seconds
        setTimeout(() => {
          router.push('/app')
        }, 2000)
      }
    } catch {
      setMessage('Er is een fout opgetreden')
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg mx-auto">
        {/* Logo and branding */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>

        <div className="text-center mb-24">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            {isWelcome ? 'TEST: Welkom bij MindDumper!' : 'Wachtwoord instellen'}
          </h1>
          <p className="text-lg text-gray-600">
            {isWelcome 
              ? 'Bedankt voor je aankoop! Stel je wachtwoord in om te beginnen.'
              : 'Kies een nieuw wachtwoord voor je account.'
            }
          </p>
        </div>

        {isWelcome && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Account succesvol aangemaakt!</p>
                <p className="text-sm text-green-700 mt-1">Je bent automatisch ingelogd.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white py-10 px-8 shadow-xl rounded-2xl border border-gray-100">
          <form className="space-y-16" onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-6">
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
                    className="appearance-none block w-full px-4 py-4 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                    placeholder="Minimaal 6 karakters"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-6">
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
                    className="appearance-none block w-full px-4 py-4 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
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
                    {isWelcome ? 'Account activeren' : 'Wachtwoord instellen'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            © 2025 MindDumper. Veilig en betrouwbaar.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Hulp nodig? Neem contact op via{' '}
            <a href="mailto:support@minddumper.com" className="text-blue-600 hover:underline">
              support@minddumper.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}