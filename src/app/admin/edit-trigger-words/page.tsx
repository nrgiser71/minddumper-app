'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SynonymModal from '@/components/SynonymModal'

interface TriggerWord {
  id: string
  word: string
  display_order: number
}

interface Subcategory {
  id: string
  name: string
  display_order: number
  words: TriggerWord[]
}

interface MainCategory {
  id: string
  name: string
  display_order: number
  subcategories: Subcategory[]
}

type Language = 'nl' | 'en' | 'de' | 'fr' | 'es'

const languageNames = {
  nl: 'Nederlands',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español'
}

export default function EditTriggerWordsPage() {
  const [language, setLanguage] = useState<Language>('nl')
  const [data, setData] = useState<MainCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editingWordId, setEditingWordId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [wordToDelete, setWordToDelete] = useState<{ id: string; word: string } | null>(null)
  const [showSynonymModal, setShowSynonymModal] = useState(false)
  const [synonymContext, setSynonymContext] = useState<{
    id: string;
    text: string;
    type: 'word' | 'main-category' | 'sub-category';
  } | null>(null)

  // Load data for selected language
  useEffect(() => {
    loadData()
  }, [language]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/get-words-by-language?language=${language}`)
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      } else {
        setMessage(`❌ Error loading: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error loading: ${error}`)
    }
    setLoading(false)
  }

  const startEditing = (wordId: string, currentWord: string) => {
    setEditingWordId(wordId)
    setEditingValue(currentWord)
  }

  const cancelEditing = () => {
    setEditingWordId(null)
    setEditingValue('')
  }

  const saveEdit = async () => {
    if (!editingWordId || !editingValue.trim()) return

    setSaving(true)
    try {
      const response = await fetch('/api/admin/update-word', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wordId: editingWordId,
          newWord: editingValue.trim()
        }),
      })

      const result = await response.json()

      if (result.success) {
        setMessage('✅ Word successfully updated')
        // Update local data
        setData(prevData => 
          prevData.map(mainCat => ({
            ...mainCat,
            subcategories: mainCat.subcategories.map(subCat => ({
              ...subCat,
              words: subCat.words.map(word => 
                word.id === editingWordId ? { ...word, word: editingValue.trim() } : word
              )
            }))
          }))
        )
        setEditingWordId(null)
        setEditingValue('')
      } else {
        setMessage(`❌ Error saving: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error saving: ${error}`)
    }
    setSaving(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit()
    } else if (e.key === 'Escape') {
      cancelEditing()
    }
  }

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      cancelDelete()
    }
  }

  const confirmDelete = (wordId: string, word: string) => {
    setWordToDelete({ id: wordId, word })
    setShowDeleteModal(true)
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setWordToDelete(null)
  }

  const deleteWord = async () => {
    if (!wordToDelete) return

    setDeleting(wordToDelete.id)
    try {
      const response = await fetch('/api/admin/delete-word', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wordId: wordToDelete.id
        }),
      })

      const result = await response.json()

      if (result.success) {
        setMessage('✅ Word successfully deleted')
        // Remove word from local data
        setData(prevData => 
          prevData.map(mainCat => ({
            ...mainCat,
            subcategories: mainCat.subcategories.map(subCat => ({
              ...subCat,
              words: subCat.words.filter(word => word.id !== wordToDelete.id)
            }))
          }))
        )
        setShowDeleteModal(false)
        setWordToDelete(null)
      } else {
        setMessage(`❌ Error deleting: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error deleting: ${error}`)
    }
    setDeleting(null)
  }

  const openSynonymModal = (id: string, text: string, type: 'word' | 'main-category' | 'sub-category') => {
    setSynonymContext({ id, text, type })
    setShowSynonymModal(true)
  }

  const closeSynonymModal = () => {
    setShowSynonymModal(false)
    setSynonymContext(null)
  }

  const handleSynonymSelected = async (synonym: string) => {
    if (!synonymContext) return

    setSaving(true)
    try {
      let response
      
      if (synonymContext.type === 'word') {
        // Update word
        response = await fetch('/api/admin/update-word', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            wordId: synonymContext.id,
            newWord: synonym
          }),
        })
      } else {
        // Update category
        response = await fetch('/api/admin/update-category', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            categoryId: synonymContext.id,
            newName: synonym,
            categoryType: synonymContext.type === 'main-category' ? 'main' : 'sub'
          }),
        })
      }

      const result = await response.json()

      if (result.success) {
        setMessage(`✅ Successfully updated with synonym: "${synonym}"`)
        
        // Update local data
        if (synonymContext.type === 'word') {
          setData(prevData => 
            prevData.map(mainCat => ({
              ...mainCat,
              subcategories: mainCat.subcategories.map(subCat => ({
                ...subCat,
                words: subCat.words.map(word => 
                  word.id === synonymContext.id ? { ...word, word: synonym } : word
                )
              }))
            }))
          )
        } else if (synonymContext.type === 'main-category') {
          setData(prevData => 
            prevData.map(mainCat => 
              mainCat.id === synonymContext.id ? { ...mainCat, name: synonym } : mainCat
            )
          )
        } else if (synonymContext.type === 'sub-category') {
          setData(prevData => 
            prevData.map(mainCat => ({
              ...mainCat,
              subcategories: mainCat.subcategories.map(subCat => 
                subCat.id === synonymContext.id ? { ...subCat, name: synonym } : subCat
              )
            }))
          )
        }
      } else {
        setMessage(`❌ Error updating: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error updating: ${error}`)
    }
    setSaving(false)
  }

  const totalWords = data.reduce((total, mainCat) => 
    total + mainCat.subcategories.reduce((subTotal, subCat) => 
      subTotal + subCat.words.length, 0
    ), 0
  )

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui' }}>
      {/* Navigation */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <Link href="/admin" style={{ color: '#007AFF', textDecoration: 'none' }}>
          ← Back to Admin
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
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '1rem' }}>Edit Trigger Words by Language</h1>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Click on a word to edit it. Press Enter to save, Escape to cancel.
        </p>
      </div>

      {/* Language Selector */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <label style={{ fontWeight: 'bold' }}>Language:</label>
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          style={{ 
            padding: '0.5rem 1rem', 
            border: '2px solid #e5e5e7', 
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        >
          {Object.entries(languageNames).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
        {!loading && (
          <span style={{ color: '#666', fontSize: '0.9rem' }}>
            {totalWords} words loaded
          </span>
        )}
      </div>

      {/* Message */}
      {message && (
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          background: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          marginBottom: '2rem'
        }}>
          {message}
          <button 
            onClick={() => setMessage('')}
            style={{ 
              float: 'right', 
              background: 'none', 
              border: 'none', 
              fontSize: '1.2rem',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading...</div>
        </div>
      ) : (
        <div>
          {data.map(mainCategory => (
            <div key={mainCategory.id} style={{ marginBottom: '2rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderBottom: '2px solid #007AFF',
                paddingBottom: '0.5rem',
                marginBottom: '1rem'
              }}>
                <h2 style={{ 
                  color: '#333',
                  margin: 0
                }}>
                  {mainCategory.name}
                </h2>
                <button
                  onClick={() => openSynonymModal(mainCategory.id, mainCategory.name, 'main-category')}
                  style={{
                    background: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    minWidth: '80px'
                  }}
                  title="Synoniemen voor hoofdcategorie"
                >
                  📝 Synoniemen
                </button>
              </div>
              
              {mainCategory.subcategories.map(subcategory => (
                <div key={subcategory.id} style={{ marginBottom: '1.5rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <h3 style={{ 
                      color: '#555',
                      margin: 0,
                      fontSize: '1.1rem'
                    }}>
                      {subcategory.name} ({subcategory.words.length} words)
                    </h3>
                    <button
                      onClick={() => openSynonymModal(subcategory.id, subcategory.name, 'sub-category')}
                      style={{
                        background: '#6f42c1',
                        color: 'white',
                        border: 'none',
                        padding: '0.2rem 0.4rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        minWidth: '70px'
                      }}
                      title="Synoniemen voor subcategorie"
                    >
                      📝 Syn
                    </button>
                  </div>
                  
                  <div style={{ 
                    background: '#f8f9fa',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                  }}>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '0.5rem'
                    }}>
                      {subcategory.words.map(word => (
                        <div key={word.id} style={{ 
                          padding: '0.5rem',
                          background: 'white',
                          borderRadius: '4px',
                          border: '1px solid #dee2e6'
                        }}>
                          {editingWordId === word.id ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <input
                                type="text"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={{ 
                                  flex: 1,
                                  padding: '0.25rem',
                                  border: '1px solid #007AFF',
                                  borderRadius: '4px',
                                  fontSize: '0.9rem'
                                }}
                                autoFocus
                              />
                              <button
                                onClick={saveEdit}
                                disabled={saving}
                                style={{
                                  background: '#28a745',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '4px',
                                  cursor: saving ? 'not-allowed' : 'pointer',
                                  fontSize: '0.8rem'
                                }}
                              >
                                {saving ? '...' : '✓'}
                              </button>
                              <button
                                onClick={cancelEditing}
                                style={{
                                  background: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem'
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div 
                                onClick={() => startEditing(word.id, word.word)}
                                style={{ 
                                  cursor: 'pointer',
                                  fontSize: '0.9rem',
                                  padding: '0.25rem',
                                  borderRadius: '4px',
                                  transition: 'background-color 0.2s',
                                  flex: 1
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                {word.word}
                              </div>
                              <button
                                onClick={() => openSynonymModal(word.id, word.word, 'word')}
                                style={{
                                  background: '#28a745',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                  marginRight: '0.25rem'
                                }}
                                title="Synoniemen voor woord"
                              >
                                📝
                              </button>
                              <button
                                onClick={() => confirmDelete(word.id, word.word)}
                                disabled={deleting === word.id}
                                style={{
                                  background: deleting === word.id ? '#ccc' : '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '4px',
                                  cursor: deleting === word.id ? 'not-allowed' : 'pointer',
                                  fontSize: '0.8rem',
                                  minWidth: '24px'
                                }}
                                title="Delete word"
                              >
                                {deleting === word.id ? '...' : '🗑️'}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
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
          onClick={cancelDelete}
          onKeyDown={handleModalKeyDown}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '1rem', color: '#dc3545' }}>Delete Word</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Are you sure you want to delete the word <strong>&quot;{wordToDelete?.word}&quot;</strong>?
            </p>
            <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
              This word will be deactivated and will no longer be available to users.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={cancelDelete}
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
                Cancel
              </button>
              <button
                onClick={deleteWord}
                disabled={deleting === wordToDelete?.id}
                style={{
                  background: deleting === wordToDelete?.id ? '#ccc' : '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: deleting === wordToDelete?.id ? 'not-allowed' : 'pointer',
                  fontSize: '1rem'
                }}
              >
                {deleting === wordToDelete?.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Synonym Modal */}
      {synonymContext && (
        <SynonymModal
          isOpen={showSynonymModal}
          onClose={closeSynonymModal}
          onSelectSynonym={handleSynonymSelected}
          originalText={synonymContext.text}
          type={synonymContext.type === 'word' ? 'word' : 'category'}
          language={language}
        />
      )}

      {/* Instructions */}
      <div style={{ 
        marginTop: '3rem', 
        padding: '1rem', 
        background: '#f0f8ff', 
        borderRadius: '8px',
        border: '1px solid #b0c4de'
      }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Instructions:</h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Click on a word to edit it</li>
          <li>Press Enter to save, Escape to cancel</li>
          <li>Click the 📝 icon to see synonyms and replace</li>
          <li>Click the 🗑️ icon to delete a word</li>
          <li>Changes are saved directly to the database</li>
          <li>Use the language selector to switch between languages</li>
        </ul>
      </div>
    </div>
  )
}