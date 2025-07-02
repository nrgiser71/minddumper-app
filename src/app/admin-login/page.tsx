'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import './admin-login.css'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to admin dashboard or app
        router.push('/app')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <img src="/minddump-logo.svg" alt="MindDump" className="admin-logo" />
        <h1 className="login-title">Admin Login</h1>
        <p className="login-subtitle">Toegang voor beheerders</p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="email" 
              className="form-input" 
              placeholder="Email adres" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <input 
              type="password" 
              className="form-input" 
              placeholder="Wachtwoord" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Bezig met inloggen...' : 'Inloggen'}
          </button>
        </form>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="waitlist-link">
          <a href="/minddump-waitlist">← Terug naar wachtlijst</a>
        </div>
      </div>
    </div>
  )
}