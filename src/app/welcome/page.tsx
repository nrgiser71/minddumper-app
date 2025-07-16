'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function WelcomeContent() {
  const [status, setStatus] = useState<'checking' | 'found' | 'timeout'>('checking')
  const [userInfo, setUserInfo] = useState<{
    id: string
    email: string
    full_name: string
    login_token: string
  } | null>(null)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const router = useRouter()

  useEffect(() => {
    const checkForRecentPurchase = async () => {
      try {
        console.log('🔍 Checking for recent purchase...')
        const response = await fetch('/api/auth/recent-purchase')
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Recent purchase found:', data)
          setUserInfo(data.user)
          setStatus('found')
          
          // Auto-login with token
          const loginResponse = await fetch('/api/auth/login-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: data.user.login_token
            })
          })
          
          if (loginResponse.ok) {
            console.log('🎉 Auto-login successful, redirecting to app...')
            // Redirect to app after successful login
            setTimeout(() => {
              router.push('/app')
            }, 2000)
          } else {
            console.error('❌ Auto-login failed')
          }
        } else {
          console.log('ℹ️ No recent purchase found yet')
        }
      } catch (error) {
        console.error('💥 Error checking for recent purchase:', error)
      }
    }

    // Check immediately
    checkForRecentPurchase()
    
    // Set up polling every 5 seconds
    const interval = setInterval(checkForRecentPurchase, 5000)
    
    // Set up countdown timer
    const countdownInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setStatus('timeout')
          clearInterval(interval)
          clearInterval(countdownInterval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Cleanup after 2 minutes
    const timeout = setTimeout(() => {
      if (status === 'checking') {
        setStatus('timeout')
        clearInterval(interval)
        clearInterval(countdownInterval)
      }
    }, 120000) // 2 minutes

    return () => {
      clearInterval(interval)
      clearInterval(countdownInterval)
      clearTimeout(timeout)
    }
  }, [status, router])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center">
          
          {status === 'checking' && (
            <>
              <div className="mb-8">
                <div className="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Processing your purchase...
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Please wait while we set up your account. This usually takes just a few seconds.
              </p>

              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <p className="text-gray-700 mb-2">
                  Time remaining: <span className="font-semibold">{formatTime(timeLeft)}</span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${((120 - timeLeft) / 120) * 100}%` }}
                  ></div>
                </div>
              </div>
            </>
          )}

          {status === 'found' && userInfo && (
            <>
              <div className="mb-8">
                <svg className="w-20 h-20 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Welcome, {userInfo.full_name}!
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Your account has been created successfully. You&apos;re being logged in automatically...
              </p>

              <div className="bg-green-50 rounded-lg p-6 mb-8">
                <p className="text-green-700 font-semibold mb-2">✅ Payment processed successfully</p>
                <p className="text-green-700">🔑 Logging you in automatically...</p>
                <p className="text-green-700">🚀 Redirecting to your MindDumper app...</p>
              </div>
            </>
          )}

          {status === 'timeout' && (
            <>
              <div className="mb-8">
                <svg className="w-20 h-20 mx-auto text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.73 0L4.084 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Please check your email
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                We&apos;re still processing your payment. Please check your email for login instructions.
              </p>

              <div className="bg-yellow-50 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">What to do next:</h2>
                <div className="text-left space-y-3 text-gray-700">
                  <p className="flex items-start">
                    <span className="text-yellow-600 mr-2">📧</span>
                    Check your email inbox for your login credentials
                  </p>
                  <p className="flex items-start">
                    <span className="text-yellow-600 mr-2">📁</span>
                    Don&apos;t forget to check your spam folder
                  </p>
                  <p className="flex items-start">
                    <span className="text-yellow-600 mr-2">🔄</span>
                    You can also try refreshing this page in a few minutes
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Refresh Page
                </button>
                
                <Link 
                  href="/auth/login" 
                  className="block w-full bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition duration-200"
                >
                  Go to Login
                </Link>
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