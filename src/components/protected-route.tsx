'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const [trialExpiresAt, setTrialExpiresAt] = useState<Date | null>(null)
  const [checkingPayment, setCheckingPayment] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  // Check payment and trial status when user is loaded
  useEffect(() => {
    if (user && !loading) {
      const checkStatus = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('payment_status, trial_expires_at')
            .eq('id', user.id)
            .single()

          if (error) {
            console.error('Error checking payment status:', error)
            setPaymentStatus('error')
          } else {
            setPaymentStatus(data?.payment_status || 'pending')
            setTrialExpiresAt(data?.trial_expires_at ? new Date(data.trial_expires_at) : null)
          }
        } catch (error) {
          console.error('Error checking payment status:', error)
          setPaymentStatus('error')
        } finally {
          setCheckingPayment(false)
        }
      }

      checkStatus()
    }
  }, [user, loading])

  // Check if user has valid access (paid or active trial)
  const hasValidAccess = () => {
    if (paymentStatus === 'paid') {
      return true
    }
    
    if (paymentStatus === 'trial' && trialExpiresAt) {
      return trialExpiresAt > new Date()
    }
    
    return false
  }

  // Redirect to appropriate page if no valid access
  useEffect(() => {
    if (!checkingPayment && paymentStatus) {
      if (!hasValidAccess()) {
        // Trial expired or no payment - redirect to upgrade page
        if (paymentStatus === 'trial') {
          router.push('/upgrade')
        } else {
          // No trial, no payment - redirect to landing
          router.push('/')
        }
      }
    }
  }, [checkingPayment, paymentStatus, trialExpiresAt, router])

  if (loading || checkingPayment) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#666'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #ddd',
            borderTop: '3px solid #007AFF',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Laden...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!user) {
    return fallback || null
  }

  return <>{children}</>
}