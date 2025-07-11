'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import './success.css'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(true)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) {
      router.push('/')
      return
    }

    // Verify the session
    const verifySession = async () => {
      try {
        const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`)
        const data = await response.json()
        
        if (data.success && data.email) {
          setEmail(data.email)
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Failed to verify session:', error)
        router.push('/')
      } finally {
        setIsVerifying(false)
      }
    }

    verifySession()
  }, [searchParams, router])

  if (isVerifying) {
    return (
      <div className="success-container">
        <div className="success-wrapper">
          <div className="loading">Verifying your payment...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="success-container">
      <div className="success-wrapper">
        <div className="success-icon">✓</div>
        
        <h1>Welcome to MindDumper!</h1>
        <p className="success-message">
          Your payment was successful. We&apos;ve sent login instructions to <strong>{email}</strong>
        </p>

        <div className="next-steps">
          <h2>What happens next?</h2>
          <ol>
            <li>Check your email for your login credentials</li>
            <li>Click the link in the email to set your password</li>
            <li>Start your first brain dump session!</li>
          </ol>
        </div>

        <div className="success-actions">
          <Link href="/auth/login" className="primary-button">
            Go to Login
          </Link>
          <Link href="/" className="secondary-button">
            Back to Home
          </Link>
        </div>

        <p className="support-note">
          Need help? Contact us at support@minddumper.com
        </p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="success-container">
        <div className="success-wrapper">
          <div className="loading">Loading...</div>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}