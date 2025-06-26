'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from '@/components/protected-route'
import { saveBrainDump, getBrainDumpHistory, getTriggerWords } from '@/lib/database'
import { getTriggerWordsForBrainDump, getStructuredTriggerWords, updateWordPreference, getAvailableCategoriesV2 } from '@/lib/database-v2'
import { getUserCustomWords, addUserCustomWord, updateUserCustomWord, deleteUserCustomWord, type UserCustomWord } from '@/lib/user-words-v2'
import type { TriggerWord, BrainDump } from '@/lib/supabase'
import '../app.css'

type Language = 'nl' | 'en' | 'de' | 'fr' | 'es'
type Screen = 'home' | 'language' | 'minddump' | 'finish' | 'config' | 'history'

interface CategoryStructure {
  mainCategory: string
  subCategories: {
    name: string
    words: string[]
  }[]
}

function AppContent() {
  const { signOut } = useAuth()
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')
  const [currentLanguage, setCurrentLanguage] = useState<Language>('nl')
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentIdeas, setCurrentIdeas] = useState<string[]>([])
  const [allIdeas, setAllIdeas] = useState<string[]>([])
  const [ideaInput, setIdeaInput] = useState('')
  const [triggerWords, setTriggerWords] = useState<string[]>([])
  const [triggerWordsData, setTriggerWordsData] = useState<TriggerWord[]>([])
  const [configTriggerWords, setConfigTriggerWords] = useState<string[]>([])
  const [categoryStructure, setCategoryStructure] = useState<CategoryStructure[]>([])
  const [checkedMainCategories, setCheckedMainCategories] = useState<Record<string, boolean>>({})
  const [checkedSubCategories, setCheckedSubCategories] = useState<Record<string, boolean>>({})
  const [checkedWords, setCheckedWords] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [configLoading, setConfigLoading] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [brainDumpHistory, setBrainDumpHistory] = useState<BrainDump[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [userWords, setUserWords] = useState<UserCustomWord[]>([])
  const [availableCategories, setAvailableCategories] = useState<{mainCategories: string[], subCategories: Record<string, Array<{id: string, name: string}>>}>({mainCategories: [], subCategories: {}})
  const [newWordText, setNewWordText] = useState('')
  const [newWordMainCategory, setNewWordMainCategory] = useState('')
  const [newWordSubCategory, setNewWordSubCategory] = useState('')
  const [editingWordId, setEditingWordId] = useState<string | null>(null)
  const [userWordsLoading, setUserWordsLoading] = useState(false)

  const showScreen = (screenId: Screen) => {
    setCurrentScreen(screenId)
    
    // Load trigger words when going to config screen
    if (screenId === 'config' && configTriggerWords.length === 0) {
      loadConfigTriggerWords()
    }
    
    // Load brain dump history when going to history screen
    if (screenId === 'history') {
      loadBrainDumpHistory()
    }
    
    // Load user words when going to config screen
    if (screenId === 'config') {
      loadUserWords()
    }
  }

  const loadConfigTriggerWords = async () => {
    setConfigLoading(true)
    try {
      // Get structured data for hierarchical display
      const { categories } = await getStructuredTriggerWords(currentLanguage)
      
      // Build legacy structure for existing UI
      const structure: CategoryStructure[] = categories.map(mainCat => ({
        mainCategory: mainCat.name,
        subCategories: mainCat.subCategories.map(subCat => ({
          name: subCat.name,
          words: subCat.words.map(w => w.word)
        }))
      }))
      
      setCategoryStructure(structure)
      
      // Initialize checkboxes based on user preferences
      const mainCats: Record<string, boolean> = {}
      const subCats: Record<string, boolean> = {}
      const wordChecks: Record<string, boolean> = {}
      
      categories.forEach(mainCat => {
        mainCats[mainCat.name] = true
        mainCat.subCategories.forEach(subCat => {
          subCats[`${mainCat.name}-${subCat.name}`] = true
          subCat.words.forEach(word => {
            wordChecks[word.word] = word.enabled
          })
        })
      })
      
      setCheckedMainCategories(mainCats)
      setCheckedSubCategories(subCats)
      setCheckedWords(wordChecks)
      
      // Also get simple word list for backward compatibility
      const words = await getTriggerWordsForBrainDump(currentLanguage)
      setConfigTriggerWords(words)
    } catch (error) {
      console.error('Error loading config trigger words:', error)
    }
    setConfigLoading(false)
  }

  const loadBrainDumpHistory = async () => {
    setHistoryLoading(true)
    try {
      const history = await getBrainDumpHistory()
      setBrainDumpHistory(history)
    } catch (error) {
      console.error('Error loading brain dump history:', error)
      setBrainDumpHistory([])
    }
    setHistoryLoading(false)
  }

  const loadUserWords = async () => {
    setUserWordsLoading(true)
    try {
      const [words, categories] = await Promise.all([
        getUserCustomWords(),
        getAvailableCategoriesV2()
      ])
      setUserWords(words)
      setAvailableCategories(categories)
      
      // Set default categories if empty
      if (!newWordMainCategory && categories.mainCategories.length > 0) {
        setNewWordMainCategory(categories.mainCategories[0])
        if (categories.subCategories[categories.mainCategories[0]]?.length > 0) {
          setNewWordSubCategory(categories.subCategories[categories.mainCategories[0]][0].name)
        }
      }
    } catch (error) {
      console.error('Error loading user words:', error)
    }
    setUserWordsLoading(false)
  }

  const handleAddUserWord = async () => {
    if (!newWordText.trim() || !newWordMainCategory || !newWordSubCategory) {
      alert('Vul alle velden in')
      return
    }

    // Find subcategory ID
    const subCatOptions = availableCategories.subCategories[newWordMainCategory] || []
    const subCat = subCatOptions.find(s => s.name === newWordSubCategory)
    if (!subCat) {
      alert('Ongeldige subcategorie')
      return
    }

    const result = await addUserCustomWord(newWordText, subCat.id)
    if (result.success) {
      setNewWordText('')
      loadUserWords() // Refresh list
    } else {
      alert(result.error || 'Er is een fout opgetreden')
    }
  }

  const handleEditUserWord = (word: UserCustomWord) => {
    setEditingWordId(word.id)
    setNewWordText(word.word)
    if (word.sub_category) {
      setNewWordMainCategory(word.sub_category.main_category.name)
      setNewWordSubCategory(word.sub_category.name)
    }
  }

  const handleUpdateUserWord = async () => {
    if (!editingWordId || !newWordText.trim() || !newWordMainCategory || !newWordSubCategory) {
      return
    }

    // Find subcategory ID
    const subCatOptions = availableCategories.subCategories[newWordMainCategory] || []
    const subCat = subCatOptions.find(s => s.name === newWordSubCategory)
    if (!subCat) {
      alert('Ongeldige subcategorie')
      return
    }

    const result = await updateUserCustomWord(editingWordId, newWordText, subCat.id)
    if (result.success) {
      setEditingWordId(null)
      setNewWordText('')
      loadUserWords() // Refresh list
    } else {
      alert(result.error || 'Er is een fout opgetreden')
    }
  }

  const handleDeleteUserWord = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit woord wilt verwijderen?')) {
      return
    }

    const result = await deleteUserCustomWord(id)
    if (result.success) {
      loadUserWords() // Refresh list
    } else {
      alert(result.error || 'Er is een fout opgetreden')
    }
  }

  const handleCancelEdit = () => {
    setEditingWordId(null)
    setNewWordText('')
    if (availableCategories.mainCategories.length > 0) {
      setNewWordMainCategory(availableCategories.mainCategories[0])
      if (availableCategories.subCategories[availableCategories.mainCategories[0]]?.length > 0) {
        setNewWordSubCategory(availableCategories.subCategories[availableCategories.mainCategories[0]][0].name)
      }
    }
  }

  const buildCategoryStructure = (words: { main_category?: string; sub_category?: string; word: string; category?: string }[]): CategoryStructure[] => {
    const structure: Record<string, Record<string, string[]>> = {
      'Professioneel': {},
      'Persoonlijk': {}
    }
    
    words.forEach(word => {
      let mainCat = 'Persoonlijk' // default
      let subCat = word.category || 'Algemeen'
      
      // Check if category contains main category info (format: "MainCategory|SubCategory")
      if (word.category && word.category.includes('|')) {
        const [main, sub] = word.category.split('|')
        mainCat = main
        subCat = sub
      } else {
        // Fallback for old data - keep existing subcategory name
        subCat = word.category || 'Algemeen'
      }
      
      if (!structure[mainCat][subCat]) {
        structure[mainCat][subCat] = []
      }
      structure[mainCat][subCat].push(word.word)
    })
    
    // Filter out empty main categories and sort
    return Object.entries(structure)
      .filter(([, subCategories]) => Object.keys(subCategories).length > 0)
      .map(([mainCategory, subCategories]) => ({
        mainCategory,
        subCategories: Object.entries(subCategories)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([name, words]) => ({
            name,
            words: words.sort()
          }))
      }))
  }

  const handleMainCategoryCheck = (mainCategory: string, checked: boolean) => {
    setCheckedMainCategories(prev => ({ ...prev, [mainCategory]: checked }))
    
    // Update all subcategories and words in this main category
    const category = categoryStructure.find(c => c.mainCategory === mainCategory)
    if (category) {
      const newSubCats = { ...checkedSubCategories }
      const newWords = { ...checkedWords }
      
      category.subCategories.forEach(subCat => {
        const subCatKey = `${mainCategory}-${subCat.name}`
        newSubCats[subCatKey] = checked
        
        subCat.words.forEach(word => {
          newWords[word] = checked
        })
      })
      
      setCheckedSubCategories(newSubCats)
      setCheckedWords(newWords)
    }
  }

  const handleSubCategoryCheck = (mainCategory: string, subCategory: string, checked: boolean) => {
    const subCatKey = `${mainCategory}-${subCategory}`
    setCheckedSubCategories(prev => ({ ...prev, [subCatKey]: checked }))
    
    // Update all words in this subcategory
    const category = categoryStructure.find(c => c.mainCategory === mainCategory)
    const subCat = category?.subCategories.find(s => s.name === subCategory)
    
    if (subCat) {
      const newWords = { ...checkedWords }
      subCat.words.forEach(word => {
        newWords[word] = checked
      })
      setCheckedWords(newWords)
      
      // Update main category if needed
      const allSubCatsInMain = category!.subCategories.every(sc => 
        checkedSubCategories[`${mainCategory}-${sc.name}`] || sc.name === subCategory ? checked : checkedSubCategories[`${mainCategory}-${sc.name}`]
      )
      setCheckedMainCategories(prev => ({ ...prev, [mainCategory]: allSubCatsInMain }))
    }
  }

  const handleWordCheck = async (word: string, checked: boolean) => {
    setCheckedWords(prev => ({ ...prev, [word]: checked }))
    
    // Find the system word ID for this word to update preferences
    const systemWord = triggerWordsData.find(w => w.word === word)
    if (systemWord) {
      await updateWordPreference(systemWord.id, checked)
    }
    
    // Update parent categories based on word states
    for (const category of categoryStructure) {
      for (const subCat of category.subCategories) {
        if (subCat.words.includes(word)) {
          const subCatKey = `${category.mainCategory}-${subCat.name}`
          
          // Check if all words in subcategory are checked
          const allWordsInSubCat = subCat.words.every(w => 
            w === word ? checked : checkedWords[w]
          )
          setCheckedSubCategories(prev => ({ ...prev, [subCatKey]: allWordsInSubCat }))
          
          // Check if all subcategories in main category are checked
          const allSubCatsInMain = category.subCategories.every(sc => {
            const scKey = `${category.mainCategory}-${sc.name}`
            if (sc.name === subCat.name) return allWordsInSubCat
            return checkedSubCategories[scKey]
          })
          setCheckedMainCategories(prev => ({ ...prev, [category.mainCategory]: allSubCatsInMain }))
          
          break
        }
      }
    }
  }

  const startMindDump = async (language: Language) => {
    setLoading(true)
    setCurrentLanguage(language)
    setCurrentWordIndex(0)
    setCurrentIdeas([])
    setAllIdeas([])
    setStartTime(new Date())
    
    // Load trigger words from database
    try {
      const words = await getTriggerWordsForBrainDump(language)
      setTriggerWords(words)
      
      // Also load full data for category display
      const fullWords = await getTriggerWords(language)
      setTriggerWordsData(fullWords)
    } catch (error) {
      console.error('Error loading trigger words:', error)
      // Fallback to empty array, database.ts will handle fallback
      setTriggerWords([])
      setTriggerWordsData([])
    }
    
    setLoading(false)
    setCurrentScreen('minddump')
  }

  const handleIdeaSubmit = (idea: string) => {
    if (idea.trim()) {
      setCurrentIdeas(prev => [...prev, idea])
      setAllIdeas(prev => [...prev, idea])
      setIdeaInput('')
    } else {
      nextWord()
    }
  }

  const nextWord = () => {
    setCurrentIdeas([])
    const nextIndex = currentWordIndex + 1
    
    if (nextIndex >= triggerWords.length) {
      finishMindDump()
    } else {
      setCurrentWordIndex(nextIndex)
    }
  }

  const finishMindDump = async () => {
    // Calculate duration
    const duration = startTime ? Math.round((Date.now() - startTime.getTime()) / 60000) : 0
    
    // Save to database (optional, continues even if it fails)
    try {
      await saveBrainDump({
        language: currentLanguage,
        ideas: allIdeas,
        total_words: currentWordIndex,
        duration_minutes: duration
      })
    } catch (error) {
      console.error('Error saving brain dump:', error)
      // Continue anyway - user can still export
    }
    
    setCurrentScreen('finish')
  }

  const exportMindDump = () => {
    const textList = allIdeas.map(idea => `- ${idea}`).join('\n')
    const blob = new Blob([textList], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mind-dump-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    alert('Je mind dump is geëxporteerd als tekstbestand!')
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleIdeaSubmit(ideaInput)
    }
  }

  const currentWord = triggerWords[currentWordIndex] || 'Loading...'
  const progress = triggerWords.length > 0 ? Math.round((currentWordIndex / triggerWords.length) * 100) : 0

  // Get category info for current word
  const getCurrentCategories = () => {
    const wordData = triggerWordsData.find(w => w.word === currentWord)
    if (!wordData || !wordData.category) {
      return { mainCategory: '', subCategory: '' }
    }
    
    if (wordData.category.includes('|')) {
      const [main, sub] = wordData.category.split('|')
      return { mainCategory: main, subCategory: sub }
    }
    
    return { mainCategory: '', subCategory: wordData.category }
  }
  
  const { mainCategory, subCategory } = getCurrentCategories()

  return (
    <div>
      {/* Home Screen */}
      {currentScreen === 'home' && (
        <div className="screen active">
          <div className="app-container">
            <div className="app-header">
              <h1 className="app-title">MindDumper</h1>
              <p className="app-subtitle">Maak je hoofd leeg van alle taken</p>
            </div>
            
            <div className="main-actions">
              <button className="btn-primary large" onClick={() => showScreen('language')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L19.5 12.5L12 23L4.5 12.5L12 2Z" fill="currentColor"/>
                </svg>
                Start Brain Dump
              </button>
              
              <button className="btn-secondary large" onClick={() => showScreen('config')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Configuratie
              </button>
            </div>
            
            <div className="secondary-actions">
              <button className="btn-text" onClick={() => showScreen('history')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Geschiedenis bekijken
              </button>
              <button className="btn-text" onClick={() => signOut()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Uitloggen
              </button>
              <Link href="/" className="btn-text">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Terug naar website
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Language Selection Screen */}
      {currentScreen === 'language' && (
        <div className="screen active">
          <div className="app-container">
            <div className="screen-header">
              <button className="btn-back" onClick={() => showScreen('home')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
              <h2>Kies je taal</h2>
            </div>
            
            <div className="language-grid">
              <button className="language-option" onClick={() => startMindDump('nl')} disabled={loading}>
                <div className="flag">🇳🇱</div>
                <span>Nederlands</span>
              </button>
              
              <button className="language-option" onClick={() => startMindDump('en')} disabled={loading}>
                <div className="flag">🇬🇧</div>
                <span>English</span>
              </button>
              
              <button className="language-option" onClick={() => startMindDump('de')} disabled={loading}>
                <div className="flag">🇩🇪</div>
                <span>Deutsch</span>
              </button>
              
              <button className="language-option" onClick={() => startMindDump('fr')} disabled={loading}>
                <div className="flag">🇫🇷</div>
                <span>Français</span>
              </button>
              
              <button className="language-option" onClick={() => startMindDump('es')} disabled={loading}>
                <div className="flag">🇪🇸</div>
                <span>Español</span>
              </button>
            </div>
            
            {loading && (
              <div style={{textAlign: 'center', marginTop: '2rem', color: '#666'}}>
                Triggerwoorden laden...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mind Dump Screen */}
      {currentScreen === 'minddump' && (
        <div className="screen active">
          <div className="app-container">
            <div className="screen-header">
              <button className="btn-back" onClick={() => showScreen('home')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
              <h2>Brain Dump</h2>
              <button className="btn-stop" onClick={finishMindDump}>Stop</button>
            </div>
            
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <span className="progress-text">{progress}%</span>
            </div>
            
            <div className="trigger-container">
              <div className="category-hierarchy">
                {mainCategory && (
                  <div className="main-category-display">
                    {mainCategory}
                  </div>
                )}
                {subCategory && (
                  <div className="sub-category-display">
                    {subCategory}
                  </div>
                )}
              </div>
              <div 
                className="trigger-word" 
                data-long={currentWord.length > 12 ? "true" : "false"}
              >
                {currentWord}
              </div>
              <div className="trigger-description">Wat komt er in je op bij dit woord?</div>
            </div>
            
            <div className="input-container">
              <input 
                type="text" 
                className="idea-input" 
                placeholder="Type je idee en druk op Enter..." 
                value={ideaInput}
                onChange={(e) => setIdeaInput(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
              <div className="input-help">Druk Enter zonder tekst om naar het volgende woord te gaan</div>
            </div>
            
            <div className="current-ideas">
              <h3>Ideeën voor &quot;{currentWord}&quot;:</h3>
              <div className="ideas-list">
                {currentIdeas.map((idea, index) => (
                  <div key={index} className="idea-item">{idea}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Finish Screen */}
      {currentScreen === 'finish' && (
        <div className="screen active">
          <div className="app-container">
            <div className="screen-header">
              <h2>Brain Dump Voltooid! 🎉</h2>
            </div>
            
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-number">{allIdeas.length}</span>
                <span className="stat-label">Ideeën gevonden</span>
              </div>
              <div className="stat">
                <span className="stat-number">{currentWordIndex}</span>
                <span className="stat-label">Triggerwoorden gebruikt</span>
              </div>
              <div className="stat">
                <span className="stat-number">~{Math.ceil(currentWordIndex / 2)}</span>
                <span className="stat-label">Minuten</span>
              </div>
            </div>
            
            <div className="ideas-overview">
              <h3>Alle gevonden ideeën:</h3>
              <div className="ideas-export-list">
                {allIdeas.slice(0, 10).map((idea, index) => (
                  <div key={index} className="export-item">{idea}</div>
                ))}
              </div>
              {allIdeas.length > 10 && (
                <div className="show-more">... en nog {allIdeas.length - 10} ideeën</div>
              )}
            </div>
            
            <div className="finish-actions">
              <button className="btn-primary large" onClick={exportMindDump}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Exporteer Tekstlijst
              </button>
              
              <button className="btn-secondary large" onClick={() => showScreen('home')}>
                Nieuwe Brain Dump
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Config Screen */}
      {currentScreen === 'config' && (
        <div className="screen active">
          <div className="app-container">
            <div className="screen-header">
              <button className="btn-back" onClick={() => showScreen('home')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
              <h2>Configuratie</h2>
            </div>
            
            <div className="config-section">
              <h3>Taal</h3>
              <select 
                className="language-select" 
                value={currentLanguage} 
                onChange={async (e) => {
                  const newLanguage = e.target.value as Language
                  setCurrentLanguage(newLanguage)
                  setConfigLoading(true)
                  try {
                    const words = await getTriggerWordsList(newLanguage)
                    setConfigTriggerWords(words)
                    
                    // Load structured data for new language
                    const structuredWords = await getTriggerWords(newLanguage)
                    const structure = buildCategoryStructure(structuredWords)
                    setCategoryStructure(structure)
                    
                    // Initialize all items as checked for new language
                    const mainCats: Record<string, boolean> = {}
                    const subCats: Record<string, boolean> = {}
                    const wordChecks: Record<string, boolean> = {}
                    
                    structure.forEach(mainCat => {
                      mainCats[mainCat.mainCategory] = true
                      mainCat.subCategories.forEach(subCat => {
                        subCats[`${mainCat.mainCategory}-${subCat.name}`] = true
                        subCat.words.forEach(word => {
                          wordChecks[word] = true
                        })
                      })
                    })
                    
                    setCheckedMainCategories(mainCats)
                    setCheckedSubCategories(subCats)
                    setCheckedWords(wordChecks)
                  } catch (error) {
                    console.error('Error loading trigger words for new language:', error)
                  }
                  setConfigLoading(false)
                }}
              >
                <option value="nl">Nederlands</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </div>
            
            <div className="config-section">
              <h3>Triggerwoorden</h3>
              <div className="search-container">
                <input type="text" className="search-input" placeholder="Zoek triggerwoorden..." />
              </div>
              
              {configLoading ? (
                <div style={{textAlign: 'center', margin: '2rem 0', color: '#666'}}>
                  Triggerwoorden laden...
                </div>
              ) : (
                <>
                  <div className="category-hierarchy">
                    {categoryStructure.map((mainCategory, mainIndex) => (
                      <div key={mainIndex} className="main-category">
                        <div className="main-category-header">
                          <input 
                            type="checkbox" 
                            id={`main-${mainIndex}`}
                            checked={checkedMainCategories[mainCategory.mainCategory] || false}
                            onChange={(e) => handleMainCategoryCheck(mainCategory.mainCategory, e.target.checked)}
                          />
                          <label htmlFor={`main-${mainIndex}`} className="main-category-label">
                            <strong>{mainCategory.mainCategory}</strong>
                          </label>
                        </div>
                        
                        <div className="sub-categories">
                          {mainCategory.subCategories.map((subCategory, subIndex) => (
                            <div key={subIndex} className="sub-category">
                              <div className="sub-category-header">
                                <input 
                                  type="checkbox" 
                                  id={`sub-${mainIndex}-${subIndex}`}
                                  checked={checkedSubCategories[`${mainCategory.mainCategory}-${subCategory.name}`] || false}
                                  onChange={(e) => handleSubCategoryCheck(mainCategory.mainCategory, subCategory.name, e.target.checked)}
                                />
                                <label htmlFor={`sub-${mainIndex}-${subIndex}`} className="sub-category-label">
                                  {subCategory.name}
                                </label>
                              </div>
                              
                              <div className="words-list">
                                {subCategory.words.map((word, wordIndex) => (
                                  <div key={wordIndex} className="word-item">
                                    <input 
                                      type="checkbox" 
                                      id={`word-${mainIndex}-${subIndex}-${wordIndex}`}
                                      checked={checkedWords[word] || false}
                                      onChange={(e) => handleWordCheck(word, e.target.checked)}
                                    />
                                    <label htmlFor={`word-${mainIndex}-${subIndex}-${wordIndex}`}>
                                      {word}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="show-more-triggers">
                    {configTriggerWords.length} woorden beschikbaar
                  </div>
                </>
              )}
            </div>
            
            <div className="config-section">
              <h3>Mijn Woorden</h3>
              
              {userWordsLoading ? (
                <div style={{textAlign: 'center', margin: '2rem 0', color: '#666'}}>
                  Laden...
                </div>
              ) : (
                <>
                  {userWords.length > 0 && (
                    <div className="user-words-list">
                      <h4>Jouw toegevoegde woorden:</h4>
                      {userWords.map((word) => (
                        <div key={word.id} className="user-word-item">
                          <div className="user-word-info">
                            <span className="user-word-text">{word.word}</span>
                            <span className="user-word-category">
                              {word.main_category} › {word.sub_category}
                            </span>
                          </div>
                          <div className="user-word-actions">
                            <button 
                              className="btn-edit"
                              onClick={() => handleEditUserWord(word)}
                              title="Bewerken"
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn-delete"
                              onClick={() => handleDeleteUserWord(word.id)}
                              title="Verwijderen"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="add-user-word-section">
                    <h4>{editingWordId ? 'Woord bewerken' : 'Nieuw woord toevoegen'}</h4>
                    
                    <div className="add-word-form">
                      <div className="form-row">
                        <input 
                          type="text" 
                          className="add-word-input" 
                          placeholder="Triggerwoord..." 
                          value={newWordText}
                          onChange={(e) => setNewWordText(e.target.value)}
                        />
                      </div>
                      
                      <div className="form-row">
                        <div className="category-selects">
                          <select 
                            className="category-select"
                            value={newWordMainCategory}
                            onChange={(e) => {
                              setNewWordMainCategory(e.target.value)
                              // Reset subcategory when main category changes
                              const subCats = availableCategories.subCategories[e.target.value]
                              if (subCats && subCats.length > 0) {
                                setNewWordSubCategory(subCats[0].name)
                              }
                            }}
                          >
                            <option value="">Hoofdcategorie...</option>
                            {availableCategories.mainCategories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          
                          <select 
                            className="category-select"
                            value={newWordSubCategory}
                            onChange={(e) => setNewWordSubCategory(e.target.value)}
                            disabled={!newWordMainCategory}
                          >
                            <option value="">Subcategorie...</option>
                            {newWordMainCategory && availableCategories.subCategories[newWordMainCategory]?.map(subCat => (
                              <option key={subCat.id} value={subCat.name}>{subCat.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="form-actions">
                        {editingWordId ? (
                          <>
                            <button 
                              className="btn-primary"
                              onClick={handleUpdateUserWord}
                              disabled={!newWordText.trim() || !newWordMainCategory || !newWordSubCategory}
                            >
                              Bijwerken
                            </button>
                            <button 
                              className="btn-secondary"
                              onClick={handleCancelEdit}
                            >
                              Annuleren
                            </button>
                          </>
                        ) : (
                          <button 
                            className="btn-primary"
                            onClick={handleAddUserWord}
                            disabled={!newWordText.trim() || !newWordMainCategory || !newWordSubCategory}
                          >
                            Toevoegen
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History Screen */}
      {currentScreen === 'history' && (
        <div className="screen active">
          <div className="app-container">
            <div className="screen-header">
              <button className="btn-back" onClick={() => showScreen('home')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
              <h2>Geschiedenis</h2>
            </div>
            
            <div className="history-list">
              {historyLoading ? (
                <div style={{textAlign: 'center', margin: '2rem 0', color: '#666'}}>
                  Geschiedenis laden...
                </div>
              ) : brainDumpHistory.length === 0 ? (
                <div style={{textAlign: 'center', margin: '2rem 0', color: '#666'}}>
                  <p>Nog geen brain dumps gemaakt.</p>
                  <p>Start je eerste sessie om hier je geschiedenis te zien!</p>
                </div>
              ) : (
                brainDumpHistory.map((dump) => (
                  <div key={dump.id} className="history-item" onClick={() => {
                    // Load this dump's data into current view
                    setAllIdeas(dump.ideas || [])
                    setCurrentWordIndex(dump.total_words || 0)
                    showScreen('finish')
                  }}>
                    <div className="history-date">
                      {new Date(dump.created_at).toLocaleDateString('nl-NL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="history-stats">
                      <span className="stat">{dump.total_ideas || 0} ideeën</span>
                      <span className="stat">{dump.total_words || 0} triggerwoorden</span>
                      <span className="stat">{dump.duration_minutes || 0} min</span>
                    </div>
                    <div className="history-preview">
                      {dump.ideas && dump.ideas.length > 0 
                        ? dump.ideas.slice(0, 3).join(', ') + (dump.ideas.length > 3 ? '...' : '')
                        : 'Geen ideeën opgeslagen'
                      }
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AppPage() {
  return (
    <ProtectedRoute>
      <AppContent />
    </ProtectedRoute>
  )
}