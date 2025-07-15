'use client'

import { useEffect } from 'react'

export default function CheckoutPage() {
  useEffect(() => {
    // Redirect to PlugAndPay checkout
    // Temporary: redirect to signup first, then PlugAndPay
    // TODO: Replace with direct PlugAndPay checkout URL
    window.location.href = '/auth/signup'
  }, [])

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
        <p>Redirecting to checkout...</p>
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