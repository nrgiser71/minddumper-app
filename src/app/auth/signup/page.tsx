'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Wachtwoord moet minimaal 6 karakters zijn')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        if (data.user.email_confirmed_at) {
          // User is immediately confirmed, redirect to app
          router.push('/app')
        } else {
          // User needs to confirm email
          setMessage('Check je email voor een bevestigingslink voordat je kunt inloggen.')
        }
      }
    } catch (err) {
      setError('Er is een fout opgetreden bij het registreren')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#007AFF',
            marginBottom: '0.5rem'
          }}>
            MindDumper
          </h1>
          <p style={{ color: '#666', fontSize: '1rem' }}>
            Maak een account aan om je brain dumps op te slaan.
          </p>
        </div>

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="fullName" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Volledige naam
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Je volledige naam"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="je@voorbeeld.nl"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Wachtwoord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Minimaal 6 karakters"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="confirmPassword" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#333'
            }}>
              Bevestig wachtwoord
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Herhaal je wachtwoord"
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{
              backgroundColor: '#efe',
              color: '#363',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#ccc' : '#007AFF',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '1rem'
            }}
          >
            {loading ? 'Registreren...' : 'Account aanmaken'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '0.875rem' }}>
            Al een account?{' '}
            <Link href="/auth/login" style={{ color: '#007AFF', textDecoration: 'none' }}>
              Log hier in
            </Link>
          </p>
          <Link href="/" style={{ 
            color: '#666', 
            textDecoration: 'none',
            fontSize: '0.875rem',
            display: 'inline-block',
            marginTop: '0.5rem'
          }}>
            ← Terug naar website
          </Link>
        </div>
      </div>
    </div>
  )
}