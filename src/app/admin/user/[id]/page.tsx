'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface UserDetails {
  id: string
  email: string
  fullName: string
  firstName?: string
  lastName?: string
  phone?: string
  language: string
  createdAt: string
  updatedAt: string
  
  // Payment info
  paymentStatus: string
  paidAt?: string
  amountPaid: number
  plugandpayOrderId?: string
  
  // Billing info
  customerType?: string
  companyName?: string
  vatNumber?: string
  billingAddress: {
    line1?: string
    line2?: string
    city?: string
    postalCode?: string
    country?: string
    state?: string
  }
  
  // Newsletter
  newsletterOptedIn?: boolean
  
  // Brain dump statistics
  brainDumpStats: {
    total: number
    totalIdeas: number
    totalWords: number
    totalDuration: number
    byLanguage: Record<string, number>
  }
  
  // Recent brain dumps
  recentBrainDumps: Array<{
    id: string
    createdAt: string
    language: string
    totalIdeas: number
    totalWords: number
    durationMinutes: number
    isDraft: boolean
  }>
}

const languageNames: Record<string, string> = {
  'nl': '🇳🇱 Nederlands',
  'en': '🇬🇧 English',
  'de': '🇩🇪 Deutsch',
  'fr': '🇫🇷 Français',
  'es': '🇪🇸 Español'
}

const paymentStatusColors: Record<string, string> = {
  'paid': '#28a745',
  'pending': '#ffc107',
  'failed': '#dc3545',
  'disabled': '#6c757d'
}

export default function UserDetailPage() {
  const [user, setUser] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState('')
  const router = useRouter()
  const params = useParams()

  const userId = params.id as string

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/admin/user-details/${userId}`)
      
      if (response.status === 401) {
        router.push('/admin/login')
        return
      }
      
      if (response.status === 404) {
        setError('Gebruiker niet gevonden')
        setLoading(false)
        return
      }
      
      const result = await response.json()
      
      if (result.success) {
        setUser(result.user)
        setError('')
      } else {
        setError(result.error || 'Fout bij laden van gebruiker')
      }
    } catch {
      setError('Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (action: 'disable' | 'enable' | 'reset-password' | 'delete') => {
    if (action === 'delete') {
      if (!confirm(`Weet je zeker dat je gebruiker ${user?.fullName} wilt verwijderen? Dit kan niet ongedaan worden gemaakt!`)) {
        return
      }
    }

    if (action === 'reset-password') {
      if (!confirm(`Weet je zeker dat je een wachtwoord reset email wilt sturen naar ${user?.email}?`)) {
        return
      }
    }

    setActionLoading(true)
    setActionMessage('')

    try {
      const response = await fetch(`/api/admin/user-actions/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      const result = await response.json()

      if (result.success) {
        setActionMessage(result.message)
        
        if (action === 'delete') {
          // Redirect to dashboard after successful delete
          setTimeout(() => {
            router.push('/admin/dashboard')
          }, 2000)
        } else {
          // Refresh user data for other actions
          fetchUserDetails()
        }
      } else {
        setActionMessage(result.error || 'Actie mislukt')
      }
    } catch {
      setActionMessage('Er is een fout opgetreden')
    } finally {
      setActionLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  useEffect(() => {
    if (userId) {
      fetchUserDetails()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center', color: '#2c3e50' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👤</div>
          <div>Gebruiker laden...</div>
        </div>
      </div>
    )
  }

  if (error) {
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
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ color: '#c33', fontSize: '1.5rem', marginBottom: '1rem' }}>❌</div>
          <div style={{ color: '#c33', marginBottom: '1rem' }}>{error}</div>
          <Link 
            href="/admin/dashboard"
            style={{
              backgroundColor: '#007AFF',
              color: 'white',
              textDecoration: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              display: 'inline-block'
            }}
          >
            Terug naar Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      padding: '1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#007AFF',
              margin: 0,
              marginBottom: '0.5rem'
            }}>
              👤 {user.fullName || 'Onbekende Gebruiker'}
            </h1>
            <p style={{ margin: 0, color: '#2c3e50' }}>
              {user.email}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link 
              href="/admin/dashboard" 
              style={{ 
                color: '#2c3e50', 
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                border: '1px solid #ddd',
                borderRadius: '6px'
              }}
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* Action Message */}
        {actionMessage && (
          <div style={{
            backgroundColor: actionMessage.includes('succesvol') || actionMessage.includes('successfully') ? '#d4edda' : '#f8d7da',
            color: actionMessage.includes('succesvol') || actionMessage.includes('successfully') ? '#155724' : '#721c24',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: `1px solid ${actionMessage.includes('succesvol') || actionMessage.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {actionMessage}
          </div>
        )}

        {/* User Info Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Basic Info */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#333',
              margin: '0 0 1rem 0'
            }}>
              ℹ️ Basis Informatie
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div><strong>ID:</strong> {user.id}</div>
              <div><strong>Naam:</strong> {user.fullName || 'Niet ingevuld'}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Telefoon:</strong> {user.phone || 'Niet ingevuld'}</div>
              <div><strong>Taal:</strong> {languageNames[user.language] || user.language}</div>
              <div><strong>Aangemeld:</strong> {formatDate(user.createdAt)}</div>
              <div><strong>Laatst bijgewerkt:</strong> {formatDate(user.updatedAt)}</div>
            </div>
          </div>

          {/* Payment Info */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#333',
              margin: '0 0 1rem 0'
            }}>
              💰 Betaling Informatie
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <strong>Status:</strong>
                <span style={{ 
                  backgroundColor: paymentStatusColors[user.paymentStatus] || '#666',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}>
                  {user.paymentStatus}
                </span>
              </div>
              <div><strong>Bedrag betaald:</strong> {formatCurrency(user.amountPaid)}</div>
              <div><strong>Betaald op:</strong> {user.paidAt ? formatDate(user.paidAt) : 'Niet betaald'}</div>
              <div><strong>Order ID:</strong> {user.plugandpayOrderId || 'Geen'}</div>
              <div><strong>Klant type:</strong> {user.customerType || 'Niet opgegeven'}</div>
            </div>
          </div>

          {/* Brain Dump Stats */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#333',
              margin: '0 0 1rem 0'
            }}>
              🧠 Mind Dump Statistieken
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div><strong>Totaal dumps:</strong> {user.brainDumpStats.total}</div>
              <div><strong>Totaal ideeën:</strong> {user.brainDumpStats.totalIdeas}</div>
              <div><strong>Totaal woorden:</strong> {user.brainDumpStats.totalWords}</div>
              <div><strong>Totaal minuten:</strong> {user.brainDumpStats.totalDuration}</div>
              <div><strong>Gem. ideeën per dump:</strong> {
                user.brainDumpStats.total > 0 
                  ? Math.round(user.brainDumpStats.totalIdeas / user.brainDumpStats.total)
                  : 0
              }</div>
            </div>
          </div>
        </div>

        {/* Billing Address */}
        {(user.billingAddress.line1 || user.billingAddress.city || user.billingAddress.country) && (
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#333',
              margin: '0 0 1rem 0'
            }}>
              📍 Factuuradres
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {user.companyName && <div><strong>Bedrijf:</strong> {user.companyName}</div>}
              {user.vatNumber && <div><strong>BTW nummer:</strong> {user.vatNumber}</div>}
              {user.billingAddress.line1 && <div><strong>Adres:</strong> {user.billingAddress.line1}</div>}
              {user.billingAddress.line2 && <div><strong>Adres 2:</strong> {user.billingAddress.line2}</div>}
              {user.billingAddress.city && <div><strong>Stad:</strong> {user.billingAddress.city}</div>}
              {user.billingAddress.postalCode && <div><strong>Postcode:</strong> {user.billingAddress.postalCode}</div>}
              {user.billingAddress.country && <div><strong>Land:</strong> {user.billingAddress.country}</div>}
              {user.billingAddress.state && <div><strong>Staat/Provincie:</strong> {user.billingAddress.state}</div>}
            </div>
          </div>
        )}

        {/* Language Distribution */}
        {Object.keys(user.brainDumpStats.byLanguage).length > 0 && (
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#333',
              margin: '0 0 1rem 0'
            }}>
              🌍 Mind Dumps per Taal
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {Object.entries(user.brainDumpStats.byLanguage)
                .sort(([,a], [,b]) => b - a)
                .map(([lang, count]) => (
                  <div key={lang} style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    border: '1px solid #e9ecef'
                  }}>
                    <span>{languageNames[lang] || lang}</span>
                    <span style={{ fontWeight: 'bold', color: '#007AFF' }}>
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Recent Brain Dumps */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: '#333',
            margin: '0 0 1rem 0'
          }}>
            🧠 Laatste Mind Dumps ({user.recentBrainDumps.length})
          </h3>
          {user.recentBrainDumps.length > 0 ? (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {user.recentBrainDumps.map(dump => (
                <div 
                  key={dump.id}
                  style={{ 
                    padding: '1rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    marginBottom: '0.75rem',
                    border: '1px solid #e9ecef'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 'bold' }}>
                      {languageNames[dump.language] || dump.language}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#2c3e50' }}>
                      {formatDate(dump.createdAt)}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', fontSize: '0.875rem', color: '#2c3e50' }}>
                    <div><strong>Ideeën:</strong> {dump.totalIdeas}</div>
                    <div><strong>Woorden:</strong> {dump.totalWords}</div>
                    <div><strong>Duur:</strong> {dump.durationMinutes} min</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              color: '#2c3e50',
              padding: '2rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px'
            }}>
              Nog geen mind dumps gemaakt
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: '#333',
            margin: '0 0 1rem 0'
          }}>
            ⚙️ Acties
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {user.paymentStatus === 'disabled' ? (
              <button
                onClick={() => handleUserAction('enable')}
                disabled={actionLoading}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  opacity: actionLoading ? 0.6 : 1
                }}
              >
                ✅ Gebruiker Inschakelen
              </button>
            ) : (
              <button
                onClick={() => handleUserAction('disable')}
                disabled={actionLoading}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  opacity: actionLoading ? 0.6 : 1
                }}
              >
                🚫 Gebruiker Uitschakelen
              </button>
            )}
            
            <button
              onClick={() => handleUserAction('reset-password')}
              disabled={actionLoading}
              style={{
                backgroundColor: '#007AFF',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                opacity: actionLoading ? 0.6 : 1
              }}
            >
              🔑 Wachtwoord Resetten
            </button>
            
            <button
              onClick={() => handleUserAction('delete')}
              disabled={actionLoading}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                opacity: actionLoading ? 0.6 : 1
              }}
            >
              🗑️ Gebruiker Verwijderen
            </button>
          </div>
          
          {actionLoading && (
            <div style={{ marginTop: '1rem', color: '#2c3e50' }}>
              Bezig met actie...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}