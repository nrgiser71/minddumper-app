'use client'

import { useState } from 'react'

export default function ImportJsonPage() {
  const [jsonInput, setJsonInput] = useState('')
  const [sqlOutput, setSqlOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImport = async () => {
    if (!jsonInput.trim()) {
      setError('Plak je JSON backup hier')
      return
    }

    setLoading(true)
    setError('')
    setSqlOutput('')

    try {
      const jsonData = JSON.parse(jsonInput)
      
      const response = await fetch('/api/admin/import-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData)
      })

      const result = await response.json()

      if (result.success) {
        setSqlOutput(result.sql)
      } else {
        setError(result.error || 'Er is een fout opgetreden')
      }
    } catch {
      setError('Ongeldige JSON format')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlOutput)
    alert('SQL gekopieerd naar clipboard!')
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>JSON Backup Importeren</h1>
      <p>Plak je JSON backup hieronder en krijg SQL om in Supabase uit te voeren.</p>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="json-input" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          JSON Backup:
        </label>
        <textarea
          id="json-input"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Plak je JSON backup hier..."
          style={{
            width: '100%',
            height: '200px',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '14px'
          }}
        />
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          background: '#ffe6e6', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <button
        onClick={handleImport}
        disabled={loading}
        style={{
          background: loading ? '#ccc' : '#007AFF',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Bezig...' : 'Genereer SQL'}
      </button>

      {sqlOutput && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>SQL om uit te voeren in Supabase:</h3>
            <button
              onClick={copyToClipboard}
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Kopieer SQL
            </button>
          </div>
          <pre
            style={{
              background: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              padding: '15px',
              overflow: 'auto',
              fontSize: '12px',
              lineHeight: '1.4',
              maxHeight: '400px'
            }}
          >
            {sqlOutput}
          </pre>
          <div style={{ marginTop: '15px', padding: '10px', background: '#e7f3ff', borderRadius: '4px' }}>
            <strong>Instructies:</strong>
            <ol style={{ margin: '10px 0 0 20px' }}>
              <li>Kopieer de SQL hierboven</li>
              <li>Ga naar je Supabase Dashboard</li>
              <li>Open SQL Editor</li>
              <li>Plak de SQL en klik Run</li>
              <li>Je triggerwoorden zijn geïmporteerd!</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}