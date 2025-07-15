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
    const orderEmail = searchParams.get('email')
    // Order ID is optional - payment can work without it
    
    if (orderEmail) {
      setEmail(orderEmail)
    }
    setIsVerifying(false)
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
        
        <h1>Bedankt voor je aankoop!</h1>
        <p className="success-message">
          Je betaling is succesvol verwerkt. {email && <>Je account is aangemaakt met <strong>{email}</strong></>}
        </p>

        <div className="next-steps">
          <h2>Volgende stappen:</h2>
          <ol>
            <li>Check je email voor een wachtwoord reset link</li>
            <li>Klik op de link om je wachtwoord in te stellen</li>
            <li>Ga naar MindDumper en log in met je nieuwe wachtwoord</li>
            <li>Start je eerste brain dump sessie!</li>
          </ol>
        </div>

        <div className="success-actions">
          <Link href="/app" className="primary-button">
            🧠 Ga naar MindDumper App
          </Link>
          <Link href="/auth/login" className="secondary-button">
            🔑 Inloggen
          </Link>
        </div>

        <p className="support-note">
          Hulp nodig? Neem contact op via support@minddumper.com
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