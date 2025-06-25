'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CategoryData {
  subCategory: string
  wordCount: number
  currentMain: string
}

export default function ReorganizePage() {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [changes, setChanges] = useState<Record<string, string>>({})

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/get-categories')
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.categories)
      } else {
        setMessage('Fout bij laden categorieën')
      }
    } catch (error) {
      setMessage('Fout bij laden: ' + error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (subCategory: string, newMain: string) => {
    setChanges(prev => ({
      ...prev,
      [subCategory]: newMain
    }))
  }

  const saveChanges = async () => {
    setSaving(true)
    setMessage('Bezig met opslaan...')

    try {
      const response = await fetch('/api/admin/update-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ changes }),
      })

      const result = await response.json()

      if (result.success) {
        setMessage(`✅ Succesvol ${result.updateCount} categorieën verplaatst`)
        setChanges({})
        await loadCategories() // Reload to show updated structure
      } else {
        setMessage(`❌ Fout: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Fout bij opslaan: ${error}`)
    } finally {
      setSaving(false)
    }
  }

  const getEffectiveMain = (category: CategoryData) => {
    return changes[category.subCategory] || category.currentMain
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Categorieën laden...</h2>
      </div>
    )
  }

  const hasChanges = Object.keys(changes).length > 0

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin" style={{ color: '#007AFF', textDecoration: 'none', marginRight: '2rem' }}>
          ← Terug naar beheer
        </Link>
        <Link href="/app" style={{ color: '#007AFF', textDecoration: 'none' }}>
          → Naar app
        </Link>
      </div>

      <h1 style={{ marginBottom: '2rem' }}>Categorieën Reorganiseren</h1>
      
      <div style={{ background: '#f5f5f7', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <p>Verplaats subcategorieën tussen Professioneel en Persoonlijk door op de knoppen te klikken.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Professioneel */}
        <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '1rem', color: '#1976d2' }}>Professioneel</h2>
          {categories
            .filter(cat => getEffectiveMain(cat) === 'Professioneel')
            .map(cat => (
              <div key={cat.subCategory} style={{ 
                background: 'white', 
                padding: '0.75rem', 
                marginBottom: '0.5rem', 
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: changes[cat.subCategory] ? '2px solid #ff9800' : '1px solid #ddd'
              }}>
                <div>
                  <strong>{cat.subCategory}</strong>
                  <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                    ({cat.wordCount} woorden)
                  </span>
                </div>
                <button
                  onClick={() => handleCategoryChange(cat.subCategory, 'Persoonlijk')}
                  style={{
                    background: '#ff5722',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  → Persoonlijk
                </button>
              </div>
            ))}
        </div>

        {/* Persoonlijk */}
        <div style={{ background: '#e8f5e9', padding: '1rem', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '1rem', color: '#388e3c' }}>Persoonlijk</h2>
          {categories
            .filter(cat => getEffectiveMain(cat) === 'Persoonlijk')
            .map(cat => (
              <div key={cat.subCategory} style={{ 
                background: 'white', 
                padding: '0.75rem', 
                marginBottom: '0.5rem', 
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: changes[cat.subCategory] ? '2px solid #ff9800' : '1px solid #ddd'
              }}>
                <div>
                  <strong>{cat.subCategory}</strong>
                  <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                    ({cat.wordCount} woorden)
                  </span>
                </div>
                <button
                  onClick={() => handleCategoryChange(cat.subCategory, 'Professioneel')}
                  style={{
                    background: '#2196f3',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  ← Professioneel
                </button>
              </div>
            ))}
        </div>
      </div>

      {hasChanges && (
        <div style={{ 
          background: '#fff3cd', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          border: '1px solid #ffeaa7'
        }}>
          <strong>Wijzigingen:</strong> {Object.keys(changes).length} categorieën worden verplaatst
        </div>
      )}

      <button
        onClick={saveChanges}
        disabled={!hasChanges || saving}
        style={{
          background: hasChanges ? '#4caf50' : '#ccc',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '8px',
          fontSize: '1.1rem',
          cursor: hasChanges && !saving ? 'pointer' : 'not-allowed',
          width: '100%',
          marginBottom: '1rem'
        }}
      >
        {saving ? 'Bezig met opslaan...' : `Wijzigingen opslaan (${Object.keys(changes).length})`}
      </button>

      {message && (
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          background: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}
    </div>
  )
}