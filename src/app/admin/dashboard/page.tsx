'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DashboardStats {
  users: {
    total: number
    newInLast30Days: number
    registrationTrend: Record<string, number>
  }
  brainDumps: {
    total: number
    recentInLast7Days: number
    byLanguage: Record<string, number>
    averageIdeas: number
    averageDuration: number
  }
  content: {
    systemWords: number
    customWords: number
  }
  activity: {
    topUsers: Array<{
      userId: string
      name: string
      email: string
      brainDumps: number
    }>
  }
}

const languageNames: Record<string, string> = {
  'nl': '🇳🇱 Nederlands',
  'en': '🇬🇧 English',
  'de': '🇩🇪 Deutsch',
  'fr': '🇫🇷 Français',
  'es': '🇪🇸 Español'
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const router = useRouter()

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      
      if (response.status === 401) {
        router.push('/admin/login')
        return
      }
      
      const result = await response.json()
      
      if (result.success) {
        setStats(result.stats)
        setLastUpdated(new Date())
        setError('')
      } else {
        setError(result.error || 'Failed to load statistics')
      }
    } catch {
      setError('Er is een fout opgetreden bij het laden van statistieken')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
      })
      router.push('/admin/login')
    } catch {
      // Force redirect even if logout fails
      router.push('/admin/login')
    }
  }

  useEffect(() => {
    fetchStats()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
          <div>Dashboard laden...</div>
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
          <button 
            onClick={fetchStats}
            style={{
              backgroundColor: '#007AFF',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Opnieuw proberen
          </button>
        </div>
      </div>
    )
  }

  if (!stats) return null

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
              📊 Admin Dashboard
            </h1>
            <p style={{ margin: 0, color: '#666' }}>
              MindDumper Statistieken
              {lastUpdated && (
                <span style={{ marginLeft: '1rem', fontSize: '0.875rem' }}>
                  Laatst bijgewerkt: {lastUpdated.toLocaleTimeString('nl-NL')}
                </span>
              )}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link 
              href="/admin" 
              style={{ 
                color: '#007AFF', 
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                border: '1px solid #007AFF',
                borderRadius: '6px'
              }}
            >
              Admin Tools
            </Link>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Uitloggen
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Users Stats */}
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
              👥 Gebruikers
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007AFF' }}>
                  {stats.users.total}
                </div>
                <div style={{ color: '#666', fontSize: '0.875rem' }}>Totaal</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                  +{stats.users.newInLast30Days}
                </div>
                <div style={{ color: '#666', fontSize: '0.875rem' }}>Laatste 30 dagen</div>
              </div>
            </div>
          </div>

          {/* Brain Dumps Stats */}
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
              🧠 Mind Dumps
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007AFF' }}>
                  {stats.brainDumps.total}
                </div>
                <div style={{ color: '#666', fontSize: '0.875rem' }}>Totaal</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                  +{stats.brainDumps.recentInLast7Days}
                </div>
                <div style={{ color: '#666', fontSize: '0.875rem' }}>Laatste 7 dagen</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <div>
                <strong>{stats.brainDumps.averageIdeas}</strong> gem. ideeën
              </div>
              <div>
                <strong>{stats.brainDumps.averageDuration}</strong> gem. minuten
              </div>
            </div>
          </div>

          {/* Content Stats */}
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
              📝 Content
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007AFF' }}>
                  {stats.content.systemWords}
                </div>
                <div style={{ color: '#666', fontSize: '0.875rem' }}>Systeem woorden</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                  {stats.content.customWords}
                </div>
                <div style={{ color: '#666', fontSize: '0.875rem' }}>Eigen woorden</div>
              </div>
            </div>
          </div>
        </div>

        {/* Language Distribution & Top Users */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Language Distribution */}
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
              🌍 Mind Dumps per Taal
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.entries(stats.brainDumps.byLanguage)
                .sort(([,a], [,b]) => b - a)
                .map(([lang, count]) => (
                  <div key={lang} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px'
                  }}>
                    <span>{languageNames[lang] || lang}</span>
                    <span style={{ fontWeight: 'bold', color: '#007AFF' }}>
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Top Users */}
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
              🏆 Meest Actieve Gebruikers
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.activity.topUsers.slice(0, 5).map((user, index) => (
                <div key={user.userId} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                      #{index + 1} {user.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#666' }}>
                      {user.email}
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: '#007AFF',
                    fontSize: '1.1rem'
                  }}>
                    {user.brainDumps}
                  </div>
                </div>
              ))}
              {stats.activity.topUsers.length === 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#666',
                  padding: '1rem'
                }}>
                  Nog geen actieve gebruikers
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}