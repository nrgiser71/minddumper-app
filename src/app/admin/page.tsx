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
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <Link href="/app" style={{ color: '#007AFF', textDecoration: 'none' }}>
          ← Back to app
        </Link>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/admin/dashboard" style={{ 
            color: 'white', 
            textDecoration: 'none',
            backgroundColor: '#007AFF',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontWeight: 'bold'
          }}>
            📊 Dashboard
          </Link>
          <Link href="/admin/words-management" style={{ 
            color: 'white', 
            textDecoration: 'none',
            backgroundColor: '#28a745',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontWeight: 'bold'
          }}>
            📝 Words Management
          </Link>
          <Link href="/admin/edit-trigger-words" style={{ 
            color: 'white', 
            textDecoration: 'none',
            backgroundColor: '#ff9500',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontWeight: 'bold'
          }}>
            ✏️ Edit by Language
          </Link>
          <Link href="/admin/reorganize" style={{ color: '#007AFF', textDecoration: 'none' }}>
            📁 Reorganize Categories →
          </Link>
        </div>
      </div>

      <h1 style={{ marginBottom: '2rem' }}>Trigger Words Management</h1>
      
      <div style={{ background: '#f5f5f7', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3>Instructions:</h3>
        <ul>
          <li>First choose the main category (Professional or Personal)</li>
          <li>Fill in the subcategory name</li>
          <li>Fill in the words, separated by commas</li>
          <li>The words are automatically split and saved</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Main category:
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
            <option value="Professioneel">Professional</option>
            <option value="Persoonlijk">Personal</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Subcategory name:
          </label>
          <input
            type="text"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            placeholder="E.g.: Projects, Financial, Family..."
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
            Trigger words (separated by commas):
          </label>
          <textarea
            value={words}
            onChange={(e) => setWords(e.target.value)}
            placeholder="E.g.: Started but not finished, Yet to start, To be evaluated"
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
          {loading ? 'Saving...' : 'Save Category'}
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
        <h3>Example:</h3>
        <p><strong>Main category:</strong> Professional</p>
        <p><strong>Subcategory:</strong> Projects</p>
        <p><strong>Words:</strong> Started but not finished, Yet to start, To be evaluated</p>
        <p><em>This will be automatically split into 3 separate trigger words.</em></p>
      </div>

      <div style={{ marginTop: '3rem', padding: '1rem', background: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
        <h3>🆕 Nieuwe Database Structuur</h3>
        <p style={{ marginBottom: '1rem' }}>Voor de nieuwe genormaliseerde database structuur:</p>
        <Link 
          href="/admin/import-json" 
          style={{ 
            display: 'inline-block',
            background: '#007AFF',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          📥 JSON Import Tool →
        </Link>
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
        <h3>Backup & Restore (Oude Structuur)</h3>
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