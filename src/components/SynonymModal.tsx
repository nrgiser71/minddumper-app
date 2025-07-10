'use client'

import { useState, useEffect } from 'react'

interface SynonymModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectSynonym: (synonym: string) => void
  originalText: string
  type: 'word' | 'category'
  language: string
}

export default function SynonymModal({
  isOpen,
  onClose,
  onSelectSynonym,
  originalText,
  type,
  language
}: SynonymModalProps) {
  const [synonyms, setSynonyms] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSynonym, setSelectedSynonym] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && originalText) {
      fetchSynonyms()
    }
  }, [isOpen, originalText, type, language]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSynonyms = async () => {
    setLoading(true)
    setError(null)
    setSynonyms([])
    setSelectedSynonym(null)

    try {
      const response = await fetch('/api/admin/get-synonyms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: originalText,
          type,
          language
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSynonyms(result.synonyms || [])
      } else {
        setError(result.error || 'Failed to fetch synonyms')
      }
    } catch {
      setError('Error fetching synonyms')
    }
    setLoading(false)
  }

  const handleConfirm = () => {
    if (selectedSynonym) {
      onSelectSynonym(selectedSynonym)
      onClose()
    }
  }

  const handleCancel = () => {
    setSelectedSynonym(null)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    } else if (e.key === 'Enter' && selectedSynonym) {
      handleConfirm()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={handleCancel}
      onKeyDown={handleKeyDown}
    >
      <div 
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginBottom: '1rem', color: '#007AFF' }}>
          {type === 'word' ? 'Synoniemen voor triggerwoord' : 'Synoniemen voor categorie'}
        </h3>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Origineel: <span style={{ color: '#666' }}>&quot;{originalText}&quot;</span>
          </p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Selecteer een synoniem om het originele {type === 'word' ? 'woord' : 'categorie'} te vervangen:
          </p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '1.2rem', color: '#666' }}>
              Synoniemen genereren...
            </div>
          </div>
        )}

        {error && (
          <div style={{
            padding: '1rem',
            borderRadius: '6px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {!loading && !error && synonyms.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            {synonyms.map((synonym, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  border: '1px solid #e9ecef',
                  borderRadius: '6px',
                  backgroundColor: selectedSynonym === synonym ? '#e3f2fd' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => setSelectedSynonym(synonym)}
                onMouseEnter={(e) => {
                  if (selectedSynonym !== synonym) {
                    e.currentTarget.style.backgroundColor = '#f8f9fa'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSynonym !== synonym) {
                    e.currentTarget.style.backgroundColor = 'white'
                  }
                }}
              >
                <input
                  type="radio"
                  name="synonym"
                  value={synonym}
                  checked={selectedSynonym === synonym}
                  onChange={() => setSelectedSynonym(synonym)}
                  style={{ marginRight: '0.75rem' }}
                />
                <span style={{ fontSize: '1rem' }}>{synonym}</span>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && synonyms.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            Geen synoniemen beschikbaar voor &quot;{originalText}&quot;
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            onClick={handleCancel}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Annuleren
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedSynonym || loading}
            style={{
              background: selectedSynonym && !loading ? '#007AFF' : '#ccc',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: selectedSynonym && !loading ? 'pointer' : 'not-allowed',
              fontSize: '1rem'
            }}
          >
            Vervangen
          </button>
        </div>
      </div>
    </div>
  )
}