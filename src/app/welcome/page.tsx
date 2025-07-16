'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function WelcomeContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const firstname = searchParams.get('firstname') || ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center">
          <div className="mb-8">
            <svg className="w-20 h-20 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome{firstname ? `, ${firstname}` : ''}!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for purchasing MindDumper. Your account has been created successfully.
          </p>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">What&apos;s next?</h2>
            <div className="text-left space-y-3 text-gray-700">
              <p className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Check your email ({email || 'your inbox'}) for your login credentials
              </p>
              <p className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Your temporary password has been sent to your inbox
              </p>
              <p className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                You can change your password after logging in
              </p>
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
              Didn&apos;t receive an email? Check your spam folder or{' '}
              <Link href="/contact" className="text-blue-600 hover:underline">
                contact support
              </Link>
            </p>
          </div>
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