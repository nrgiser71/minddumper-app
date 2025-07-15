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
  const [checkingPayment, setCheckingPayment] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  // Check payment status when user is loaded
  useEffect(() => {
    if (user && !loading) {
      const checkPaymentStatus = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('payment_status')
            .eq('id', user.id)
            .single()

          if (error) {
            console.error('Error checking payment status:', error)
            setPaymentStatus('error')
          } else {
            setPaymentStatus(data?.payment_status || 'pending')
          }
        } catch (error) {
          console.error('Error checking payment status:', error)
          setPaymentStatus('error')
        } finally {
          setCheckingPayment(false)
        }
      }

      checkPaymentStatus()
    }
  }, [user, loading])

  // Allow free access - no payment required for basic version
  // useEffect(() => {
  //   if (!checkingPayment && paymentStatus && paymentStatus !== 'paid') {
  //     window.location.href = '/'
  //   }
  // }, [checkingPayment, paymentStatus, router])

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