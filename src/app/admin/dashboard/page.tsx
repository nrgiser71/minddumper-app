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

interface RecentUser {
  id: string
  name: string
  email: string
  createdAt: string
  paymentStatus: string
  paidAt?: string
  amountPaid: number
  orderId?: string
  customerType?: string
  country?: string
  language: string
}

interface RecentBrainDump {
  id: string
  createdAt: string
  language: string
  totalIdeas: number
  totalWords: number
  durationMinutes: number
  user: {
    id: string
    name: string
    email: string
  }
}

interface RevenueStats {
  thisWeek: { amount: number; customers: number }
  thisMonth: { amount: number; customers: number }
  thisYear: { amount: number; customers: number }
  total: { amount: number; customers: number }
  monthlyBreakdown: Array<{ month: string; revenue: number; customers: number }>
  weeklyBreakdown: Array<{ week: string; revenue: number; customers: number }>
}

interface SearchResult {
  id: string
  name: string
  email: string
  createdAt: string
  paymentStatus: string
  paidAt?: string
  amountPaid: number
  orderId?: string
  customerType?: string
  country?: string
  language: string
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

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [recentBrainDumps, setRecentBrainDumps] = useState<RecentBrainDump[]>([])
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const router = useRouter()

  const fetchAllData = async () => {
    try {
      // Fetch all data in parallel
      const [statsRes, usersRes, dumpsRes, revenueRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/recent-users'),
        fetch('/api/admin/recent-brain-dumps'),
        fetch('/api/admin/revenue-stats')
      ])
      
      if (statsRes.status === 401) {
        router.push('/admin/login')
        return
      }
      
      const [statsData, usersData, dumpsData, revenueData] = await Promise.all([
        statsRes.json(),
        usersRes.json(),
        dumpsRes.json(),
        revenueRes.json()
      ])
      
      if (statsData.success) {
        setStats(statsData.stats)
      }
      if (usersData.success) {
        console.log('Loaded users:', usersData.users?.length || 0, usersData.users)
        setRecentUsers(usersData.users || [])
      } else {
        console.error('Failed to load users:', usersData)
      }
      if (dumpsData.success) {
        console.log('Loaded brain dumps:', dumpsData.brainDumps?.length || 0, dumpsData.brainDumps)
        setRecentBrainDumps(dumpsData.brainDumps || [])
      } else {
        console.error('Failed to load brain dumps:', dumpsData)
      }
      if (revenueData.success) {
        setRevenueStats(revenueData.revenue)
      }
      
      setLastUpdated(new Date())
      setError('')
    } catch {
      setError('Er is een fout opgetreden bij het laden van gegevens')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      const response = await fetch(`/api/admin/user-search?q=${encodeURIComponent(searchQuery)}`)
      const result = await response.json()
      
      if (result.success) {
        setSearchResults(result.users)
      } else {
        setSearchResults([])
      }
    } catch {
      setSearchResults([])
    } finally {
      setSearchLoading(false)
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
    fetchAllData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAllData, 30000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(handleSearch, 300)
    return () => clearTimeout(timeoutId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

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
            onClick={fetchAllData}
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
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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

        {/* User Search */}
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
            🔍 Gebruiker Zoeken
          </h3>
          <input
            type="text"
            placeholder="Zoek op naam, email, order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
          />
          {searchLoading && <div style={{ color: '#666' }}>Zoeken...</div>}
          {searchResults.length > 0 && (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {searchResults.map(user => (
                <Link 
                  key={user.id}
                  href={`/admin/user/${user.id}`}
                  style={{ 
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    padding: '0.75rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    marginBottom: '0.5rem',
                    border: '1px solid #e9ecef'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>{user.email}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        backgroundColor: paymentStatusColors[user.paymentStatus] || '#666',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        marginBottom: '0.25rem'
                      }}>
                        {user.paymentStatus}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        {formatDate(user.createdAt)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Revenue Dashboard */}
        {revenueStats && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
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
                💰 Deze Week
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
                {formatCurrency(revenueStats.thisWeek.amount)}
              </div>
              <div style={{ color: '#666', fontSize: '0.875rem' }}>
                {revenueStats.thisWeek.customers} klanten
              </div>
            </div>

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
                📅 Deze Maand
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007AFF' }}>
                {formatCurrency(revenueStats.thisMonth.amount)}
              </div>
              <div style={{ color: '#666', fontSize: '0.875rem' }}>
                {revenueStats.thisMonth.customers} klanten
              </div>
            </div>

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
                🎯 Dit Jaar
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#17a2b8' }}>
                {formatCurrency(revenueStats.thisYear.amount)}
              </div>
              <div style={{ color: '#666', fontSize: '0.875rem' }}>
                {revenueStats.thisYear.customers} klanten
              </div>
            </div>

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
                🏆 Totaal
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6f42c1' }}>
                {formatCurrency(revenueStats.total.amount)}
              </div>
              <div style={{ color: '#666', fontSize: '0.875rem' }}>
                {revenueStats.total.customers} klanten
              </div>
            </div>
          </div>
        )}

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

        {/* Recent Users and Brain Dumps */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Recent Users */}
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
              🆕 Laatste 20 Nieuwe Gebruikers
            </h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {recentUsers.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#666',
                  padding: '2rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px'
                }}>
                  Geen gebruikers gevonden of nog aan het laden...
                </div>
              ) : (
                recentUsers.slice(0, 20).map(user => (
                <Link 
                  key={user.id}
                  href={`/admin/user/${user.id}`}
                  style={{ 
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    padding: '0.75rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    marginBottom: '0.5rem',
                    border: '1px solid #e9ecef'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        {user.email}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        backgroundColor: paymentStatusColors[user.paymentStatus] || '#666',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        marginBottom: '0.25rem'
                      }}>
                        {user.paymentStatus}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        {formatDate(user.createdAt)}
                      </div>
                    </div>
                  </div>
                </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Brain Dumps */}
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
              🧠 Laatste 50 Mind Dumps
            </h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {recentBrainDumps.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#666',
                  padding: '2rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px'
                }}>
                  Geen mind dumps gevonden of nog aan het laden...
                </div>
              ) : (
                recentBrainDumps.slice(0, 50).map(dump => (
                <div 
                  key={dump.id}
                  style={{ 
                    padding: '0.75rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    marginBottom: '0.5rem',
                    border: '1px solid #e9ecef'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                        <Link 
                          href={`/admin/user/${dump.user.id}`}
                          style={{ textDecoration: 'none', color: '#007AFF' }}
                        >
                          {dump.user.name}
                        </Link>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        {languageNames[dump.language] || dump.language} • {dump.totalIdeas} ideeën • {dump.durationMinutes}min
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        {formatDate(dump.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
                ))
              )}
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
                <Link
                  key={user.userId}
                  href={`/admin/user/${user.userId}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px'
                  }}
                >
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
                </Link>
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