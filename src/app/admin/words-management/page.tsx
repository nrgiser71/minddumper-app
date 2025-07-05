'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Word {
  id: string
  word: string
  language: string
  sub_category: {
    id: string
    name: string
    main_category: {
      id: string
      name: string
    }
  }
}

interface Category {
  id: string
  name: string
  display_order: number
  subCategories: SubCategory[]
}

interface SubCategory {
  id: string
  name: string
  display_order: number
  main_category_id: string
}

export default function WordsManagementPage() {
  const [words, setWords] = useState<Word[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedMainCategory, setSelectedMainCategory] = useState('all')
  const [selectedSubCategory, setSelectedSubCategory] = useState('all')
  
  // Bulk operations
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set())
  const [bulkAction, setBulkAction] = useState('')
  const [bulkTargetCategory, setBulkTargetCategory] = useState('')
  
  // Edit mode
  const [editingWord, setEditingWord] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  
  // Drag and drop
  const [draggedWord, setDraggedWord] = useState<string | null>(null)
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [wordsPerPage] = useState(50)

  const languages = ['nl', 'en', 'de', 'fr', 'es']
  const languageNames: Record<string, string> = {
    nl: 'Nederlands',
    en: 'English',
    de: 'Deutsch',
    fr: 'Français',
    es: 'Español'
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load words
      const wordsResponse = await fetch('/api/admin/get-all-words')
      const wordsData = await wordsResponse.json()
      
      // Load categories
      const categoriesResponse = await fetch('/api/admin/get-categories')
      const categoriesData = await categoriesResponse.json()
      
      if (wordsData.success && categoriesData.success) {
        setWords(wordsData.words || [])
        setCategories(categoriesData.categories || [])
        
        // Flatten subcategories for easy access
        const allSubCategories: SubCategory[] = []
        categoriesData.categories.forEach((cat: Category) => {
          cat.subCategories.forEach((subCat: SubCategory) => {
            allSubCategories.push({
              ...subCat,
              main_category_id: cat.id
            })
          })
        })
        setSubCategories(allSubCategories)
      }
    } catch (error) {
      setMessage(`Fout bij laden: ${error}`)
    }
    setLoading(false)
  }

  // Filter words based on search and filters
  const filteredWords = words.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.sub_category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.sub_category.main_category.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesLanguage = selectedLanguage === 'all' || word.language === selectedLanguage
    const matchesMainCategory = selectedMainCategory === 'all' || word.sub_category.main_category.id === selectedMainCategory
    const matchesSubCategory = selectedSubCategory === 'all' || word.sub_category.id === selectedSubCategory
    
    return matchesSearch && matchesLanguage && matchesMainCategory && matchesSubCategory
  })

  // Pagination
  const totalPages = Math.ceil(filteredWords.length / wordsPerPage)
  const startIndex = (currentPage - 1) * wordsPerPage
  const paginatedWords = filteredWords.slice(startIndex, startIndex + wordsPerPage)

  const handleWordEdit = async (wordId: string, newWord: string) => {
    try {
      const response = await fetch('/api/admin/update-word', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wordId, newWord })
      })
      
      const result = await response.json()
      if (result.success) {
        setWords(words.map(w => w.id === wordId ? { ...w, word: newWord } : w))
        setMessage('✅ Woord bijgewerkt!')
        setEditingWord(null)
      } else {
        setMessage(`❌ Fout bij bijwerken: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Fout: ${error}`)
    }
  }

  const handleWordMove = async (wordId: string, newSubCategoryId: string) => {
    try {
      const response = await fetch('/api/admin/move-word', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wordId, newSubCategoryId })
      })
      
      const result = await response.json()
      if (result.success) {
        await loadData() // Reload to get updated category info
        setMessage('✅ Woord verplaatst!')
      } else {
        setMessage(`❌ Fout bij verplaatsen: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Fout: ${error}`)
    }
  }

  const handleWordDelete = async (wordId: string) => {
    if (!confirm('Weet je zeker dat je dit woord wilt verwijderen?')) return
    
    try {
      const response = await fetch('/api/admin/delete-word', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wordId })
      })
      
      const result = await response.json()
      if (result.success) {
        setWords(words.filter(w => w.id !== wordId))
        setMessage('✅ Woord verwijderd!')
      } else {
        setMessage(`❌ Fout bij verwijderen: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Fout: ${error}`)
    }
  }

  const handleBulkAction = async () => {
    if (selectedWords.size === 0) {
      setMessage('❌ Selecteer eerst woorden')
      return
    }
    
    const wordIds = Array.from(selectedWords)
    
    try {
      let response
      switch (bulkAction) {
        case 'delete':
          if (!confirm(`Weet je zeker dat je ${wordIds.length} woorden wilt verwijderen?`)) return
          response = await fetch('/api/admin/bulk-delete-words', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wordIds })
          })
          break
        case 'move':
          if (!bulkTargetCategory) {
            setMessage('❌ Selecteer een doelcategorie')
            return
          }
          response = await fetch('/api/admin/bulk-move-words', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wordIds, newSubCategoryId: bulkTargetCategory })
          })
          break
        default:
          setMessage('❌ Selecteer een actie')
          return
      }
      
      const result = await response.json()
      if (result.success) {
        await loadData()
        setSelectedWords(new Set())
        setBulkAction('')
        setBulkTargetCategory('')
        setMessage(`✅ ${wordIds.length} woorden bijgewerkt!`)
      } else {
        setMessage(`❌ Fout bij bulk actie: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Fout: ${error}`)
    }
  }

  const handleSelectAll = () => {
    if (selectedWords.size === paginatedWords.length) {
      setSelectedWords(new Set())
    } else {
      setSelectedWords(new Set(paginatedWords.map(w => w.id)))
    }
  }

  const handleDragStart = (e: React.DragEvent, wordId: string) => {
    setDraggedWord(wordId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (e: React.DragEvent, subCategoryId: string) => {
    e.preventDefault()
    setDragOverCategory(subCategoryId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the table row entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverCategory(null)
    }
  }

  const handleDrop = async (e: React.DragEvent, targetSubCategoryId: string) => {
    e.preventDefault()
    setDragOverCategory(null)
    
    if (!draggedWord) return
    
    const word = words.find(w => w.id === draggedWord)
    if (!word) return
    
    // Don't move if it's the same category
    if (word.sub_category.id === targetSubCategoryId) return
    
    await handleWordMove(draggedWord, targetSubCategoryId)
    setDraggedWord(null)
  }

  const exportWords = () => {
    const csv = [
      ['Woord', 'Taal', 'Hoofdcategorie', 'Subcategorie'].join(','),
      ...filteredWords.map(word => [
        `"${word.word}"`,
        word.language,
        `"${word.sub_category.main_category.name}"`,
        `"${word.sub_category.name}"`
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `words-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setMessage('✅ Woorden geëxporteerd!')
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem' }}>Laden...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '1400px', margin: '0 auto', fontFamily: 'system-ui' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ margin: 0, color: '#333' }}>Woorden Beheer</h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/admin" style={{ color: '#007AFF', textDecoration: 'none' }}>
            ← Terug naar Admin
          </Link>
          <Link href="/admin/dashboard" style={{ color: '#007AFF', textDecoration: 'none' }}>
            📊 Dashboard
          </Link>
        </div>
      </div>

      {/* Instructions */}
      <div style={{ 
        background: '#e3f2fd', 
        padding: '1rem', 
        borderRadius: '8px', 
        marginBottom: '2rem',
        border: '1px solid #bbdefb'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>🚀 Geavanceerde Functies</h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#1976d2' }}>
          <li><strong>Klik op woord</strong> om direct te bewerken</li>
          <li><strong>Sleep woorden</strong> om ze naar andere categorieën te verplaatsen</li>
          <li><strong>Selecteer meerdere woorden</strong> voor bulk operaties</li>
          <li><strong>Filter en zoek</strong> om specifieke woorden te vinden</li>
          <li><strong>Export naar CSV</strong> voor externe bewerking</li>
        </ul>
      </div>

      {/* Filters */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        marginBottom: '2rem',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Filters & Zoeken</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Zoeken:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Zoek woorden, categorieën..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Taal:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="all">Alle talen</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>{languageNames[lang]}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Hoofdcategorie:</label>
            <select
              value={selectedMainCategory}
              onChange={(e) => {
                setSelectedMainCategory(e.target.value)
                setSelectedSubCategory('all')
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="all">Alle hoofdcategorieën</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Subcategorie:</label>
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="all">Alle subcategorieën</option>
              {subCategories
                .filter(subCat => selectedMainCategory === 'all' || subCat.main_category_id === selectedMainCategory)
                .map(subCat => (
                  <option key={subCat.id} value={subCat.id}>{subCat.name}</option>
                ))}
            </select>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 'bold' }}>
            {filteredWords.length} woorden gevonden
          </span>
          <button
            onClick={exportWords}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            📥 Export naar CSV
          </button>
        </div>
      </div>

      {/* Bulk Operations */}
      {selectedWords.size > 0 && (
        <div style={{ 
          background: '#fff3cd', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          border: '1px solid #ffeaa7'
        }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>Bulk Operaties ({selectedWords.size} woorden geselecteerd)</h4>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">Selecteer actie...</option>
              <option value="move">Verplaats naar categorie</option>
              <option value="delete">Verwijder</option>
            </select>
            
            {bulkAction === 'move' && (
              <select
                value={bulkTargetCategory}
                onChange={(e) => setBulkTargetCategory(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              >
                <option value="">Selecteer doelcategorie...</option>
                {subCategories.map(subCat => (
                  <option key={subCat.id} value={subCat.id}>
                    {categories.find(c => c.id === subCat.main_category_id)?.name} → {subCat.name}
                  </option>
                ))}
              </select>
            )}
            
            <button
              onClick={handleBulkAction}
              style={{
                background: bulkAction === 'delete' ? '#dc3545' : '#007AFF',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Uitvoeren
            </button>
            
            <button
              onClick={() => setSelectedWords(new Set())}
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Deselecteren
            </button>
          </div>
        </div>
      )}

      {/* Drop Zones */}
      {draggedWord && (
        <div style={{ 
          background: '#e8f5e9', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          border: '2px dashed #4caf50'
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#2e7d32' }}>
            🎯 Sleep woord naar een van deze categorieën:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {subCategories.map(subCat => {
              const mainCategory = categories.find(c => c.id === subCat.main_category_id)
              return (
                <div
                  key={subCat.id}
                  style={{
                    padding: '1rem',
                    background: dragOverCategory === subCat.id ? '#c8e6c9' : 'white',
                    border: `2px ${dragOverCategory === subCat.id ? 'solid' : 'dashed'} #4caf50`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center'
                  }}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, subCat.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, subCat.id)}
                >
                  <div style={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    {mainCategory?.name}
                  </div>
                  <div style={{ color: '#4caf50', fontSize: '0.9rem' }}>
                    {subCat.name}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Words Table */}
      <div style={{ 
        background: 'white', 
        borderRadius: '8px', 
        border: '1px solid #e9ecef',
        overflow: 'hidden',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          padding: '1rem', 
          background: '#f8f9fa', 
          borderBottom: '1px solid #e9ecef',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0 }}>Woorden Lijst</h3>
          <button
            onClick={handleSelectAll}
            style={{
              background: '#007AFF',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {selectedWords.size === paginatedWords.length ? 'Deselecteer alle' : 'Selecteer alle'}
          </button>
        </div>
        
        <div style={{ overflow: 'auto', maxHeight: '70vh' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>□</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>Woord</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>Taal</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>Hoofdcategorie</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>Subcategorie</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>Acties</th>
              </tr>
            </thead>
            <tbody>
              {paginatedWords.map((word) => (
                <tr 
                  key={word.id} 
                  style={{ 
                    borderBottom: '1px solid #f1f3f4',
                    backgroundColor: dragOverCategory === word.sub_category.id ? '#e3f2fd' : 
                                   draggedWord === word.id ? '#fff3e0' : 'transparent',
                    cursor: draggedWord === word.id ? 'grabbing' : 'grab',
                    opacity: draggedWord === word.id ? 0.7 : 1,
                    transform: draggedWord === word.id ? 'scale(0.98)' : 'scale(1)',
                    transition: 'all 0.2s ease'
                  }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, word.id)}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, word.sub_category.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, word.sub_category.id)}
                >
                  <td style={{ padding: '0.75rem' }}>
                    <input
                      type="checkbox"
                      checked={selectedWords.has(word.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedWords)
                        if (e.target.checked) {
                          newSelected.add(word.id)
                        } else {
                          newSelected.delete(word.id)
                        }
                        setSelectedWords(newSelected)
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {editingWord === word.id ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          style={{
                            flex: 1,
                            padding: '0.25rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                          }}
                        />
                        <button
                          onClick={() => handleWordEdit(word.id, editValue)}
                          style={{
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingWord(null)}
                          style={{
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          ✗
                        </button>
                      </div>
                    ) : (
                      <span
                        onClick={() => {
                          setEditingWord(word.id)
                          setEditValue(word.word)
                        }}
                        style={{
                          cursor: 'pointer',
                          padding: '0.25rem',
                          borderRadius: '4px',
                          display: 'inline-block'
                        }}
                        title="Klik om te bewerken"
                      >
                        {word.word}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      background: '#e9ecef',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      {languageNames[word.language]}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{word.sub_category.main_category.name}</td>
                  <td style={{ padding: '0.75rem' }}>{word.sub_category.name}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleWordMove(word.id, e.target.value)
                          }
                        }}
                        style={{
                          padding: '0.25rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '0.8rem'
                        }}
                      >
                        <option value="">Verplaats naar...</option>
                        {subCategories.map(subCat => (
                          <option key={subCat.id} value={subCat.id}>
                            {categories.find(c => c.id === subCat.main_category_id)?.name} → {subCat.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleWordDelete(word.id)}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                        title="Verwijder woord"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '0.5rem', 
          marginBottom: '2rem',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              background: currentPage === 1 ? '#f8f9fa' : 'white'
            }}
          >
            ← Vorige
          </button>
          
          <span style={{ padding: '0.5rem 1rem' }}>
            Pagina {currentPage} van {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              background: currentPage === totalPages ? '#f8f9fa' : 'white'
            }}
          >
            Volgende →
          </button>
        </div>
      )}

      {/* Message */}
      {message && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '1rem',
          borderRadius: '8px',
          background: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          zIndex: 1000,
          maxWidth: '400px'
        }}>
          {message}
          <button
            onClick={() => setMessage('')}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              float: 'right',
              fontSize: '1.2rem',
              lineHeight: '1'
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}