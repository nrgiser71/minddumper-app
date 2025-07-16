'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

function WelcomeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'logging_in' | 'success' | 'error'>('logging_in')
  const [userEmail, setUserEmail] = useState('')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const attemptAutoLogin = async () => {
      try {
        console.log('🔄 Attempting auto-login...')
        console.log('URL params:', searchParams.toString())
        
        // First, get the latest user's email from the API
        const response = await fetch('/api/auth/latest-user')
        const result = await response.json()
        
        if (!response.ok || !result.success) {
          console.error('❌ Failed to get latest user:', result.message)
          setStatus('error')
          return
        }
        
        const latestUserEmail = result.user.email
        setUserEmail(latestUserEmail)
        const tempPassword = 'minddumper123'
        
        console.log('📧 Using email for auto-login:', latestUserEmail)
        
        const { error } = await supabase.auth.signInWithPassword({
          email: latestUserEmail,
          password: tempPassword,
        })

        if (error) {
          console.error('❌ Auto-login failed:', error)
          setStatus('error')
        } else {
          console.log('✅ Auto-login successful!')
          setStatus('success')
          
          // Redirect to password reset after 3 seconds
          setTimeout(() => {
            router.push('/auth/reset-password?welcome=true')
          }, 3000)
        }
      } catch (error) {
        console.error('💥 Auto-login error:', error)
        setStatus('error')
      }
    }

    attemptAutoLogin()
  }, [router, supabase, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center">
          
          {status === 'logging_in' && (
            <>
              <div className="mb-8">
                <div className="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Setting up your account...
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                We&apos;re logging you in automatically. This will take just a moment.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mb-8">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Welcome!
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Thank you for purchasing MindDumper. Your account has been created successfully.
              </p>

              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">What&apos;s next?</h2>
                <div className="space-y-2 text-left">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Logged in automatically with {userEmail}</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Setting up your password (redirecting...)</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">Choose your new password</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-8">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Welcome!
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Thank you for purchasing MindDumper. Your account has been created successfully.
              </p>

              <div className="bg-orange-50 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Manual Login Required</h2>
                <div className="space-y-2 text-left">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-orange-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">Auto-login didn&apos;t work, but no worries!</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">Use email: <strong>{userEmail}</strong></span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">Password: <strong>minddumper123</strong></span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Link 
                  href="/auth/login" 
                  className="block w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Go to Login
                </Link>
                
                <p className="text-sm text-gray-500">
                  You can change your password after logging in
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function WelcomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <WelcomeContent />
    </Suspense>
  )
}