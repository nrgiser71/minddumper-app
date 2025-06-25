'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const [mainCategory, setMainCategory] = useState<'Professioneel' | 'Persoonlijk'>('Professioneel')
  const [subCategory, setSubCategory] = useState('')
  const [words, setWords] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!subCategory.trim() || !words.trim()) {
      setMessage('Vul alle velden in')
      return
    }

    setLoading(true)
    setMessage('Bezig met opslaan...')

    try {
      const response = await fetch('/api/admin/add-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mainCategory,
          subCategory: subCategory.trim(),
          words: words.trim()
        }),
      })

      const result = await response.json()

      if (result.success) {
        setMessage(`✅ Succesvol opgeslagen: ${result.wordCount} woorden in "${subCategory}"`)
        setSubCategory('')
        setWords('')
      } else {
        setMessage(`❌ Fout: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Fout bij opslaan: ${error}`)
    }
    
    setLoading(false)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/app" style={{ color: '#007AFF', textDecoration: 'none' }}>
          ← Terug naar app
        </Link>
        <Link href="/admin/reorganize" style={{ color: '#007AFF', textDecoration: 'none' }}>
          📁 Categorieën reorganiseren →
        </Link>
      </div>

      <h1 style={{ marginBottom: '2rem' }}>Triggerwoorden Beheer</h1>
      
      <div style={{ background: '#f5f5f7', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3>Instructies:</h3>
        <ul>
          <li>Kies eerst de hoofdcategorie (Professioneel of Persoonlijk)</li>
          <li>Vul de subcategorie naam in</li>
          <li>Vul de woorden in, gescheiden door komma&apos;s</li>
          <li>De woorden worden automatisch opgesplitst en opgeslagen</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Hoofdcategorie:
          </label>
          <select 
            value={mainCategory}
            onChange={(e) => setMainCategory(e.target.value as 'Professioneel' | 'Persoonlijk')}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '2px solid #e5e5e7', 
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          >
            <option value="Professioneel">Professioneel</option>
            <option value="Persoonlijk">Persoonlijk</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Subcategorie naam:
          </label>
          <input
            type="text"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            placeholder="Bijv: Projecten, Financieel, Familie..."
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '2px solid #e5e5e7', 
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Triggerwoorden (gescheiden door komma&apos;s):
          </label>
          <textarea
            value={words}
            onChange={(e) => setWords(e.target.value)}
            placeholder="Bijv: Gestart maar niet afgerond, Nog te starten, Nog te beoordelen"
            rows={6}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '2px solid #e5e5e7', 
              borderRadius: '8px',
              fontSize: '1rem',
              resize: 'vertical',
              fontFamily: 'system-ui'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? '#ccc' : '#007AFF',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {loading ? 'Bezig met opslaan...' : 'Categorie opslaan'}
        </button>
      </form>

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

      <div style={{ marginTop: '3rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
        <h3>Voorbeeld:</h3>
        <p><strong>Hoofdcategorie:</strong> Professioneel</p>
        <p><strong>Subcategorie:</strong> Projecten</p>
        <p><strong>Woorden:</strong> Gestart maar niet afgerond, Nog te starten, Nog te beoordelen</p>
        <p><em>Dit wordt automatisch opgesplitst in 3 aparte triggerwoorden.</em></p>
      </div>

      <div style={{ marginTop: '3rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
        <h3>Backup & Restore</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={async () => {
              try {
                const response = await fetch('/api/admin/export-backup')
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `minddumper-backup-${new Date().toISOString().split('T')[0]}.json`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
                setMessage('✅ Backup gedownload!')
              } catch (error) {
                setMessage(`❌ Fout bij backup: ${error}`)
              }
            }}
            style={{
              background: '#4caf50',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            📥 Backup Downloaden
          </button>

          <input
            type="file"
            accept=".json"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return

              try {
                const text = await file.text()
                const backup = JSON.parse(text)
                
                if (confirm(`Wil je de backup van ${backup.exportDate} importeren? Dit vervangt alle huidige Nederlandse woorden!`)) {
                  const response = await fetch('/api/admin/import-backup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: text
                  })
                  
                  const result = await response.json()
                  if (result.success) {
                    setMessage(`✅ Backup geïmporteerd: ${result.imported} woorden`)
                  } else {
                    setMessage(`❌ Fout bij importeren: ${result.error}`)
                  }
                }
              } catch (error) {
                setMessage(`❌ Fout bij lezen backup: ${error}`)
              }
            }}
            style={{ display: 'none' }}
            id="backup-upload"
          />
          <label
            htmlFor="backup-upload"
            style={{
              background: '#2196f3',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'inline-block'
            }}
          >
            📤 Backup Importeren
          </label>
        </div>
      </div>
    </div>
  )
}