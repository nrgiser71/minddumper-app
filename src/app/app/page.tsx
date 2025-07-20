'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from '@/components/protected-route'
import { saveBrainDump, getBrainDumpHistory, getTriggerWords, getTriggerWordsList } from '@/lib/database'
import { getTriggerWordsForBrainDump, getStructuredTriggerWords, getAvailableCategoriesV2 } from '@/lib/database-v2'
import { getUserCustomWords, addUserCustomWord, updateUserCustomWord, deleteUserCustomWord, type UserCustomWord } from '@/lib/user-words-v2'
import type { TriggerWord, BrainDump } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { ToastProvider, useToast } from '@/components/toast-context'
import { ToastContainer } from '@/components/toast-container'
import { ConfirmationModal } from '@/components/confirmation-modal'
import '../app.css'

type Language = 'nl' | 'en' | 'de' | 'fr' | 'es'
type Screen = 'home' | 'language' | 'minddump' | 'finish' | 'config' | 'history'

// Category name translations
const categoryTranslations = {
  'nl': {
    'Professioneel': 'Professioneel',
    'Persoonlijk': 'Persoonlijk'
  },
  'en': {
    'Professioneel': 'Professional',
    'Persoonlijk': 'Personal'
  },
  'de': {
    'Professioneel': 'Beruflich',
    'Persoonlijk': 'Persönlich'
  },
  'fr': {
    'Professioneel': 'Professionnel',
    'Persoonlijk': 'Personnel'
  },
  'es': {
    'Professioneel': 'Profesional',
    'Persoonlijk': 'Personal'
  }
}

interface CategoryStructure {
  mainCategory: string
  subCategories: {
    name: string
    words: string[]
  }[]
}

interface StructuredSubCategory {
  id: string
  name: string
  display_order: number
  words: Array<{
    id: string
    word: string
    enabled: boolean
  }>
}

// Helper function to translate category names
const translateCategory = (categoryName: string, language: Language): string => {
  return categoryTranslations[language]?.[categoryName as keyof typeof categoryTranslations['nl']] || categoryName
}

// localStorage utility functions
const STORAGE_KEY = 'minddumper-session'

interface SessionData {
  sessionId: string
  language: Language
  triggerWords: string[]
  allIdeas: string[]
  currentIdeas: string[]  // Ideas for current word
  currentWordIndex: number
  startTime: string
  lastSaved: string
}

const saveSessionToStorage = (sessionData: SessionData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData))
  } catch (error) {
    console.error('Failed to save session to localStorage:', error)
  }
}

const getSessionFromStorage = (): SessionData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return null
    const parsed = JSON.parse(data)
    // Validate session data
    if (!parsed.sessionId || !parsed.language) return null
    return parsed
  } catch (error) {
    console.error('Failed to get session from localStorage:', error)
    return null
  }
}

const clearSessionFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear session from localStorage:', error)
  }
}

const generateSessionId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

const cleanupOldSessions = () => {
  try {
    const savedSession = localStorage.getItem(STORAGE_KEY)
    if (savedSession) {
      const data = JSON.parse(savedSession)
      const lastSaved = new Date(data.lastSaved)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      
      // Remove sessions older than 7 days
      if (lastSaved < sevenDaysAgo) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    
    // Also cleanup any legacy keys that might exist
    const keysToCheck = ['minddumper-backup', 'minddumper-temp', 'braindump-session']
    keysToCheck.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Failed to cleanup old sessions:', error)
  }
}

function AppContent() {
  const { signOut } = useAuth()
  const { showToast } = useToast()
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
  const [savingPreferences, setSavingPreferences] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>('')
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [pendingSaves, setPendingSaves] = useState<{
    language: string
    ideas: string[]
    total_words: number
    duration_minutes: number
    is_draft: boolean
    session_id: string
  }[]>([])
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    confirmButtonStyle?: 'primary' | 'danger'
    onConfirm: () => void
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} })

  // Check for existing session on component mount
  useEffect(() => {
    // First cleanup old sessions
    cleanupOldSessions()
    
    const savedSession = getSessionFromStorage()
    if (savedSession) {
      // Show recovery dialog using modern modal
      const restoreSession = () => {
        // Restore session data
        setSessionId(savedSession.sessionId)
        setCurrentLanguage(savedSession.language)
        setTriggerWords(savedSession.triggerWords)
        setAllIdeas(savedSession.allIdeas)
        setCurrentIdeas(savedSession.currentIdeas || [])  // Restore current word ideas
        setCurrentWordIndex(savedSession.currentWordIndex)
        setStartTime(new Date(savedSession.startTime))
        setCurrentScreen('minddump')
        setAutoSaveStatus('Session restored')
        
        // Start auto-save for recovered session
        setTimeout(() => {
          startAutoSave(savedSession.sessionId, savedSession.language)
        }, 100)
      }
      
      showConfirmation({
        title: 'Restore Session',
        message: `An unfinished mind dump session was found from ${new Date(savedSession.lastSaved).toLocaleString('en-US')}. Do you want to resume?`,
        confirmText: 'Resume',
        cancelText: 'New Session',
        onConfirm: restoreSession
      })
    }
  }, [])

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
        subCategories: mainCat.subCategories.map((subCat: StructuredSubCategory) => ({
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
        let mainCatAllEnabled = true
        
        mainCat.subCategories.forEach((subCat: StructuredSubCategory) => {
          let subCatAllEnabled = true
          
          subCat.words.forEach((word: {id: string, word: string, enabled: boolean}) => {
            wordChecks[word.word] = word.enabled
            
            // Debug: Log enabled words (should be 0 according to user)
            if (word.enabled) {
              console.log(`🟢 [UI] Word "${word.word}" (${word.id}) is marked as ENABLED in UI`)
            }
            
            if (!word.enabled) {
              subCatAllEnabled = false
              mainCatAllEnabled = false
            }
          })
          
          subCats[`${mainCat.name}-${subCat.name}`] = subCatAllEnabled
        })
        
        mainCats[mainCat.name] = mainCatAllEnabled
      })
      
      setCheckedMainCategories(mainCats)
      setCheckedSubCategories(subCats)
      setCheckedWords(wordChecks)
      
      // Also get simple word list for backward compatibility
      const words = await getTriggerWordsForBrainDump(currentLanguage)
      setConfigTriggerWords(words)
      
      // Store full structured data for saving preferences
      const allWords = categories.flatMap(mainCat => 
        mainCat.subCategories.flatMap(subCat => 
          subCat.words.map(word => ({
            id: word.id,
            word: word.word,
            main_category: mainCat.name,
            sub_category: subCat.name,
            category: `${mainCat.name} - ${subCat.name}`,
            main_category_order: mainCat.display_order,
            sub_category_order: subCat.display_order,
            sort_order: 0,
            is_active: true,
            created_at: new Date().toISOString(),
            language: currentLanguage
          }))
        )
      )
      setTriggerWordsData(allWords)
    } catch {
      // Error loading config trigger words
    }
    setConfigLoading(false)
  }

  const loadBrainDumpHistory = async () => {
    setHistoryLoading(true)
    try {
      const history = await getBrainDumpHistory()
      setBrainDumpHistory(history)
    } catch {
      // Error loading brain dump history
      setBrainDumpHistory([])
    }
    setHistoryLoading(false)
  }

  const loadUserWords = async (language?: Language) => {
    setUserWordsLoading(true)
    const targetLanguage = language || currentLanguage
    try {
      const [words, categories] = await Promise.all([
        getUserCustomWords(targetLanguage),
        getAvailableCategoriesV2(targetLanguage)
      ])
      setUserWords(words)
      setAvailableCategories(categories)
      
      // Set default categories (always reset when language changes)
      if (categories.mainCategories.length > 0) {
        setNewWordMainCategory(categories.mainCategories[0])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((categories.subCategories as any)[categories.mainCategories[0]]?.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setNewWordSubCategory((categories.subCategories as any)[categories.mainCategories[0]][0].name)
        }
      }
    } catch {
      // Error loading user words
    }
    setUserWordsLoading(false)
  }

  const handleAddUserWord = async () => {
    if (!newWordText.trim() || !newWordMainCategory || !newWordSubCategory) {
      showToast('Fill in all fields', 'error')
      return
    }

    // Find subcategory ID
    const subCatOptions = availableCategories.subCategories[newWordMainCategory] || []
    const subCat = subCatOptions.find(s => s.name === newWordSubCategory)
    if (!subCat) {
      showToast('Invalid subcategory', 'error')
      return
    }

    const result = await addUserCustomWord(newWordText, subCat.id, currentLanguage)
    if (result.success) {
      setNewWordText('')
      showToast('Word added!', 'success')
      loadUserWords() // Refresh list
    } else {
      showToast(result.error || 'An error occurred', 'error')
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
      showToast('Invalid subcategory', 'error')
      return
    }

    const result = await updateUserCustomWord(editingWordId, newWordText, subCat.id, currentLanguage)
    if (result.success) {
      setEditingWordId(null)
      setNewWordText('')
      showToast('Word updated!', 'success')
      loadUserWords() // Refresh list
    } else {
      showToast(result.error || 'An error occurred', 'error')
    }
  }

  const handleDeleteUserWord = async (id: string) => {
    showConfirmation({
      title: 'Delete Word',
      message: 'Are you sure you want to delete this word? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmButtonStyle: 'danger',
      onConfirm: async () => {
        const result = await deleteUserCustomWord(id)
        if (result.success) {
          showToast('Word deleted!', 'success')
          loadUserWords() // Refresh list
        } else {
          showToast(result.error || 'An error occurred', 'error')
        }
      }
    })
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

  const handleWordCheck = (word: string, checked: boolean) => {
    setCheckedWords(prev => ({ ...prev, [word]: checked }))
    
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

  const startAutoSave = (sessionId: string, language: Language) => {
    // Clear any existing interval
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current)
    }
    
    // Start new interval for database saves (30 seconds)
    autoSaveIntervalRef.current = setInterval(async () => {
      if (allIdeas.length > 0) {
        const duration = startTime ? Math.round((Date.now() - startTime.getTime()) / 60000) : 0
        const saveData = {
          language: language,
          ideas: allIdeas,
          total_words: currentWordIndex,
          duration_minutes: duration,
          is_draft: true,
          session_id: sessionId
        }
        
        if (isOnline) {
          try {
            await saveBrainDump(saveData)
            setAutoSaveStatus('Auto-saved')
            setTimeout(() => setAutoSaveStatus(''), 2000)
          } catch (error) {
            console.error('Auto-save failed:', error)
            setAutoSaveStatus('Auto-save failed - queued for later')
            setPendingSaves(prev => [...prev, saveData])
            setTimeout(() => setAutoSaveStatus(''), 3000)
          }
        } else {
          // Queue save for when online
          setPendingSaves(prev => [...prev, saveData])
          setAutoSaveStatus('Offline - save queued')
          setTimeout(() => setAutoSaveStatus(''), 3000)
        }
      }
    }, 30000) // 30 seconds
  }
  
  const stopAutoSave = () => {
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current)
      autoSaveIntervalRef.current = null
    }
  }
  
  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      stopAutoSave()
    }
  }, [])
  
  // Online/offline monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setAutoSaveStatus('Connection restored')
      setTimeout(() => setAutoSaveStatus(''), 2000)
      
      // Process any pending saves
      if (pendingSaves.length > 0) {
        setTimeout(() => processPendingSaves(), 100)
      }
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      setAutoSaveStatus('Offline - saved locally only')
    }
    
    // Set initial state
    setIsOnline(navigator.onLine)
    
    // Add event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [pendingSaves])
  
  // Warning before unload if session is active
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentScreen === 'minddump' && (allIdeas.length > 0 || pendingSaves.length > 0)) {
        const message = 'You have an active mind dump session. Your progress is saved, but are you sure you want to exit?'
        e.preventDefault()
        e.returnValue = message
        return message
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [currentScreen, allIdeas.length, pendingSaves.length])
  
  // Helper function to show confirmation modal
  const showConfirmation = ({
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmButtonStyle = 'primary' as const,
    onConfirm
  }: {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    confirmButtonStyle?: 'primary' | 'danger'
    onConfirm: () => void
  }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      confirmButtonStyle,
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
        onConfirm()
      }
    })
  }
  
  const hideConfirmation = () => {
    // Check if this was a session recovery modal - if so, clear the session
    if (confirmModal.title === 'Restore Session') {
      clearSessionFromStorage()
    }
    setConfirmModal(prev => ({ ...prev, isOpen: false }))
  }
  
  const processPendingSaves = async () => {
    const saves = [...pendingSaves]
    setPendingSaves([])
    
    for (const saveData of saves) {
      try {
        await saveBrainDump(saveData)
        setAutoSaveStatus('Offline saves synchronized')
        setTimeout(() => setAutoSaveStatus(''), 2000)
      } catch (error) {
        console.error('Failed to process pending save:', error)
        // Re-add failed saves back to queue
        setPendingSaves(prev => [...prev, saveData])
      }
    }
  }

  const saveWordPreferences = async () => {
    setSavingPreferences(true)
    
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) {
        showToast('Not logged in', 'error')
        return
      }

      // Prepare bulk preferences data
      // IMPORTANT: Always create a preference record for every word, 
      // even if it's enabled, to ensure consistency across languages
      const preferences = triggerWordsData.map(word => ({
        systemWordId: word.id,
        isEnabled: checkedWords[word.word] ?? true
      }))
      
      const response = await fetch('/api/admin/bulk-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.user.id,
          preferences
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        showToast('Preferences saved!', 'success')
      } else {
        // Handle detailed error information
        
        let errorMessage = 'Error saving preferences'
        
        if (result.details) {
          errorMessage += ': ' + result.details
        } else if (result.error) {
          errorMessage += ': ' + result.error
        }
        
        // Failed data for debugging if available
        if (result.failedData && result.failedData.length > 0) {
          errorMessage += ` (${result.failedData.length} items failed)`
        }
        
        showToast(errorMessage, 'error')
        return
      }
    } catch (error) {
      showToast('Error saving preferences: ' + error, 'error')
    }
    setSavingPreferences(false)
  }

  const startMindDump = async (language: Language) => {
    setLoading(true)
    setCurrentLanguage(language)
    setCurrentWordIndex(0)
    setCurrentIdeas([])
    setAllIdeas([])
    const sessionStartTime = new Date()
    setStartTime(sessionStartTime)
    
    // Generate new session ID
    const newSessionId = generateSessionId()
    setSessionId(newSessionId)
    
    // Load trigger words from database
    try {
      const words = await getTriggerWordsForBrainDump(language)
      setTriggerWords(words)
      
      // Also load full data for category display
      const fullWords = await getTriggerWords(language)
      setTriggerWordsData(fullWords)
      
      // Save initial session to localStorage
      const sessionData: SessionData = {
        sessionId: newSessionId,
        language,
        triggerWords: words,
        allIdeas: [],
        currentIdeas: [],
        currentWordIndex: 0,
        startTime: sessionStartTime.toISOString(),
        lastSaved: new Date().toISOString()
      }
      saveSessionToStorage(sessionData)
      
      // Start auto-save
      startAutoSave(newSessionId, language)
      
    } catch {
      // Fallback to empty array, database.ts will handle fallback
      setTriggerWords([])
      setTriggerWordsData([])
    }
    
    setLoading(false)
    setCurrentScreen('minddump')
  }

  const handleIdeaSubmit = (idea: string) => {
    if (idea.trim()) {
      const newAllIdeas = [...allIdeas, idea]
      setCurrentIdeas(prev => [...prev, idea])
      setAllIdeas(newAllIdeas)
      setIdeaInput('')
      
      // Update localStorage immediately
      if (sessionId && startTime) {
        const sessionData: SessionData = {
          sessionId,
          language: currentLanguage,
          triggerWords,
          allIdeas: newAllIdeas,
          currentIdeas: [...currentIdeas, idea],  // Add new idea to current ideas
          currentWordIndex,
          startTime: startTime.toISOString(),
          lastSaved: new Date().toISOString()
        }
        saveSessionToStorage(sessionData)
      }
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
      
      // Update localStorage with new word index
      if (sessionId && startTime) {
        const sessionData: SessionData = {
          sessionId,
          language: currentLanguage,
          triggerWords,
          allIdeas,
          currentIdeas: [],  // Reset current ideas for new word
          currentWordIndex: nextIndex,
          startTime: startTime.toISOString(),
          lastSaved: new Date().toISOString()
        }
        saveSessionToStorage(sessionData)
      }
    }
  }

  const finishMindDump = async () => {
    // Stop auto-save
    stopAutoSave()
    
    // Calculate duration
    const duration = startTime ? Math.round((Date.now() - startTime.getTime()) / 60000) : 0
    
    // Save final version to database (not a draft)
    try {
      await saveBrainDump({
        language: currentLanguage,
        ideas: allIdeas,
        total_words: currentWordIndex,
        duration_minutes: duration,
        is_draft: false,
        session_id: sessionId
      })
    } catch {
      // Continue anyway - user can still export
    }
    
    // Clear localStorage since session is complete
    clearSessionFromStorage()
    setSessionId(null)
    setAutoSaveStatus('')
    
    setCurrentScreen('finish')
  }
  
  const saveAndExit = async () => {
    if (allIdeas.length === 0) {
      // No ideas to save, just go back
      setCurrentScreen('home')
      return
    }
    
    // First show a modal asking if they want to save
    showConfirmation({
      title: 'Exit Mind Dump',
      message: `You have collected ${allIdeas.length} ideas. Do you want to save them?`,
      confirmText: 'Save & Exit',
      cancelText: 'Continue',
      onConfirm: async () => {
        await finishMindDump()
      }
    })
  }

  const exportMindDump = () => {
    // Make sure we only export the plain ideas without any formatting
    const cleanIdeas = allIdeas.map(idea => {
      // If the idea contains semicolons, it might be formatted data - extract just the idea part
      if (idea.includes(';')) {
        const parts = idea.split(';')
        // Assuming the idea is in the second column (after number)
        return parts[1] ? parts[1].replace(/^"|"$/g, '') : idea
      }
      return idea
    })
    const textList = cleanIdeas.join('\n')
    const blob = new Blob([textList], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mind-dump-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    showToast('Your mind dump has been exported as a text file!', 'success')
  }

  const exportMindDumpCSV = () => {
    // Make sure we only export the plain ideas without any formatting
    const cleanIdeas = allIdeas.map(idea => {
      // If the idea contains semicolons, it might be formatted data - extract just the idea part
      if (idea.includes(';')) {
        const parts = idea.split(';')
        // Assuming the idea is in the second column (after number)
        return parts[1] ? parts[1].replace(/^"|"$/g, '') : idea
      }
      return idea
    })
    
    // Create proper CSV without delimiter (single column)
    const csvRows = [
      'Idea',  // Header without delimiter
      ...cleanIdeas.map(idea => `"${idea.replace(/"/g, '""')}"`)  // Each idea without delimiter
    ]
    const csvContent = csvRows.join('\n')
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mind-dump-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    showToast('Your mind dump has been exported as a CSV file!', 'success')
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
              <p className="app-subtitle">Clear your mind of all tasks</p>
            </div>
            
            <div className="home-content">
              <div className="primary-action-card">
                <button className="btn-primary large hero-button" onClick={() => showScreen('language')}>
                  <div className="button-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9C5 11.39 6.16 13.49 7.89 14.81L8 15V18C8 19.1 8.9 20 10 20H14C15.1 20 16 19.1 16 18V15L16.11 14.81C17.84 13.49 19 11.39 19 9C19 5.13 15.87 2 12 2ZM12 4C14.76 4 17 6.24 17 9C17 10.78 16.15 12.37 14.78 13.33L14 13.86V18H10V13.86L9.22 13.33C7.85 12.37 7 10.78 7 9C7 6.24 9.24 4 12 4Z" fill="currentColor"/>
                      <rect x="10" y="20" width="4" height="2" rx="1" fill="currentColor"/>
                    </svg>
                  </div>
                  <span className="button-text">Start Brain Dump</span>
                </button>
              </div>
              
              <div className="action-cards">
                <div className="action-card">
                  <button className="btn-secondary large modern-config" onClick={() => showScreen('config')}>
                    <div className="button-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6H21V8H3V6ZM3 11H21V13H3V11ZM3 16H21V18H3V16Z" fill="currentColor"/>
                        <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                        <circle cx="17" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                        <circle cx="12" cy="17" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      </svg>
                    </div>
                    <span className="button-text">Configuration</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="secondary-actions">
              <div className="secondary-action-group">
                <button className="btn-text modern-text-btn" onClick={() => showScreen('history')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  View History
                </button>
                <button className="btn-text modern-text-btn" onClick={() => signOut()}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Log Out
                </button>
              </div>
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
              <h2>Choose Your Language</h2>
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
                Loading trigger words...
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
              <button className="btn-back" onClick={saveAndExit}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
              <h2>Brain Dump</h2>
              {(autoSaveStatus || !isOnline || pendingSaves.length > 0) && (
                <div className="status-indicators" style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', margin: '0 10px'}}>
                  {!isOnline && (
                    <div className="offline-indicator" style={{color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '4px'}}>
                      <span style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff6b6b'}}></span>
                      Offline
                    </div>
                  )}
                  {pendingSaves.length > 0 && (
                    <div className="pending-saves" style={{color: '#ffa500', display: 'flex', alignItems: 'center', gap: '4px'}}>
                      <span style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffa500'}}></span>
                      {pendingSaves.length} save(s) queued
                    </div>
                  )}
                  {autoSaveStatus && (
                    <div className="auto-save-status" style={{
                      color: autoSaveStatus.includes('mislukt') ? '#ff6b6b' : 
                             autoSaveStatus.includes('restored') || autoSaveStatus.includes('saved') ? '#4caf50' : '#666'
                    }}>
                      {autoSaveStatus}
                    </div>
                  )}
                </div>
              )}
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
                    {translateCategory(mainCategory, currentLanguage)}
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
              <div className="trigger-description">What comes to mind with this word?</div>
            </div>
            
            <div className="input-container">
              <input 
                type="text" 
                className="idea-input" 
                placeholder="Type your idea and press Enter..." 
                value={ideaInput}
                onChange={(e) => setIdeaInput(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
              <div className="input-help">Press Enter without text to go to the next word</div>
            </div>
            
            <div className="current-ideas">
              <h3>Ideas for &quot;{currentWord}&quot;:</h3>
              <div className="ideas-list">
                {currentIdeas.map((idea, index) => (
                  <div key={index} className="idea-item">{idea}</div>
                ))}
              </div>
              
              {/* Show all ideas so far if session was recovered and has previous ideas */}
              {sessionId && allIdeas.length > currentIdeas.length && (
                <div className="previous-ideas" style={{marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px'}}>
                  <h4 style={{margin: '0 0 10px 0', fontSize: '14px', color: '#666'}}>All ideas so far ({allIdeas.length}):</h4>
                  <div className="ideas-list" style={{maxHeight: '120px', overflowY: 'auto'}}>
                    {allIdeas.map((idea, index) => (
                      <div key={index} className="idea-item" style={{fontSize: '13px', padding: '4px 8px'}}>
                        {index + 1}. {idea}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Finish Screen */}
      {currentScreen === 'finish' && (
        <div className="screen active">
          <div className="app-container">
            <div className="screen-header">
              <h2>Brain Dump Completed! 🎉</h2>
            </div>
            
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-number">{allIdeas.length}</span>
                <span className="stat-label">Ideas found</span>
              </div>
              <div className="stat">
                <span className="stat-number">{currentWordIndex}</span>
                <span className="stat-label">Trigger words used</span>
              </div>
            </div>
            
            <div className="ideas-overview">
              <h3>All ideas found:</h3>
              <div className="ideas-export-list">
                {allIdeas.slice(0, 10).map((idea, index) => (
                  <div key={index} className="export-item">{idea}</div>
                ))}
              </div>
              {allIdeas.length > 10 && (
                <div className="show-more">... and {allIdeas.length - 10} more ideas</div>
              )}
            </div>
            
            <div className="finish-actions">
              <button className="btn-primary large" onClick={exportMindDump}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Export Text List
              </button>
              
              <button className="btn-primary large" onClick={exportMindDumpCSV}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Export CSV
              </button>
              
              <button className="btn-secondary large" onClick={() => showScreen('home')}>
                New Brain Dump
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
              <h2>Configuration</h2>
            </div>
            
            <div className="config-section">
              <h3>Language</h3>
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
                    
                    // Load structured data for new language WITH user preferences
                    const { categories } = await getStructuredTriggerWords(newLanguage)
                    
                    // Build legacy structure for existing UI
                    const structure: CategoryStructure[] = categories.map(mainCat => ({
                      mainCategory: mainCat.name,
                      subCategories: mainCat.subCategories.map((subCat: StructuredSubCategory) => ({
                        name: subCat.name,
                        words: subCat.words.map(w => w.word)
                      }))
                    }))
                    setCategoryStructure(structure)
                    
                    // Initialize checkboxes based on user preferences (like loadConfigTriggerWords does)
                    const mainCats: Record<string, boolean> = {}
                    const subCats: Record<string, boolean> = {}
                    const wordChecks: Record<string, boolean> = {}
                    
                    categories.forEach(mainCat => {
                      let mainCatAllEnabled = true
                      
                      mainCat.subCategories.forEach((subCat: StructuredSubCategory) => {
                        let subCatAllEnabled = true
                        
                        subCat.words.forEach((word: {id: string, word: string, enabled: boolean}) => {
                          wordChecks[word.word] = word.enabled
                          if (!word.enabled) {
                            subCatAllEnabled = false
                            mainCatAllEnabled = false
                          }
                        })
                        
                        subCats[`${mainCat.name}-${subCat.name}`] = subCatAllEnabled
                      })
                      
                      mainCats[mainCat.name] = mainCatAllEnabled
                    })
                    
                    setCheckedMainCategories(mainCats)
                    setCheckedSubCategories(subCats)
                    setCheckedWords(wordChecks)
                    
                    // Store full structured data for saving preferences
                    const allWords = categories.flatMap(mainCat => 
                      mainCat.subCategories.flatMap(subCat => 
                        subCat.words.map(word => ({
                          id: word.id,
                          word: word.word,
                          main_category: mainCat.name,
                          sub_category: subCat.name,
                          category: `${mainCat.name} - ${subCat.name}`,
                          main_category_order: mainCat.display_order,
                          sub_category_order: subCat.display_order,
                          sort_order: 0,
                          is_active: true,
                          created_at: new Date().toISOString(),
                          language: newLanguage
                        }))
                      )
                    )
                    setTriggerWordsData(allWords)
                    
                    // Reset form fields for new language
                    setNewWordText('')
                    setNewWordMainCategory('')
                    setNewWordSubCategory('')
                    setEditingWordId(null)
                    
                    // Reload user words and categories for the new language
                    await loadUserWords(newLanguage)
                  } catch {
                    // Error loading trigger words for new language
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
              <h3>Trigger Words</h3>
              <div className="search-container">
                <input type="text" className="search-input" placeholder="Search trigger words..." />
              </div>
              
              {configLoading ? (
                <div style={{textAlign: 'center', margin: '2rem 0', color: '#666'}}>
                  Loading trigger words...
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
                            <strong>{translateCategory(mainCategory.mainCategory, currentLanguage)}</strong>
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
                  
                  
                  <div className="save-preferences-section" style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button 
                      className="btn-primary"
                      onClick={saveWordPreferences}
                      disabled={savingPreferences}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: savingPreferences ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: savingPreferences ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {savingPreferences ? 'Saving Preferences...' : 'Save Preferences'}
                    </button>
                  </div>
                </>
              )}
            </div>
            
            <div className="config-section">
              <h3>My Words</h3>
              
              {userWordsLoading ? (
                <div style={{textAlign: 'center', margin: '2rem 0', color: '#666'}}>
                  Loading...
                </div>
              ) : (
                <>
                  {userWords.length > 0 && (
                    <div className="user-words-list">
                      <h4>Your added words:</h4>
                      {userWords.map((word) => (
                        <div key={word.id} className="user-word-item">
                          <div className="user-word-info">
                            <span className="user-word-text">{word.word}</span>
                            <span className="user-word-category">
                              {translateCategory(word.sub_category?.main_category.name || '', currentLanguage)} › {word.sub_category?.name}
                            </span>
                          </div>
                          <div className="user-word-actions">
                            <button 
                              className="btn-edit"
                              onClick={() => handleEditUserWord(word)}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn-delete"
                              onClick={() => handleDeleteUserWord(word.id)}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="add-user-word-section">
                    <h4>{editingWordId ? 'Edit Word' : 'Add New Word'}</h4>
                    
                    <div className="add-word-form">
                      <div className="form-row">
                        <input 
                          type="text" 
                          className="add-word-input" 
                          placeholder="Trigger word..." 
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
                            <option value="">Main category...</option>
                            {availableCategories.mainCategories.map(cat => (
                              <option key={cat} value={cat}>{translateCategory(cat, currentLanguage)}</option>
                            ))}
                          </select>
                          
                          <select 
                            className="category-select"
                            value={newWordSubCategory}
                            onChange={(e) => setNewWordSubCategory(e.target.value)}
                            disabled={!newWordMainCategory}
                          >
                            <option value="">Subcategory...</option>
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
                              Update
                            </button>
                            <button 
                              className="btn-secondary"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button 
                            className="btn-primary"
                            onClick={handleAddUserWord}
                            disabled={!newWordText.trim() || !newWordMainCategory || !newWordSubCategory}
                          >
                            Add
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
              <h2>History</h2>
            </div>
            
            <div className="history-list">
              {historyLoading ? (
                <div style={{textAlign: 'center', margin: '2rem 0', color: '#666'}}>
                  Loading history...
                </div>
              ) : brainDumpHistory.length === 0 ? (
                <div style={{textAlign: 'center', margin: '2rem 0', color: '#666'}}>
                  <p>No brain dumps created yet.</p>
                  <p>Start your first session to see your history here!</p>
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
                      <span className="stat">{dump.total_ideas || 0} ideas</span>
                      <span className="stat">{dump.total_words || 0} trigger words</span>
                      <span className="stat">{dump.duration_minutes || 0} min</span>
                    </div>
                    <div className="history-preview">
                      {dump.ideas && dump.ideas.length > 0 
                        ? dump.ideas.slice(0, 3).join(', ') + (dump.ideas.length > 3 ? '...' : '')
                        : 'No ideas saved'
                      }
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        confirmButtonStyle={confirmModal.confirmButtonStyle}
        onConfirm={confirmModal.onConfirm}
        onCancel={hideConfirmation}
      />
    </div>
  )
}

export default function AppPage() {
  return (
    <ProtectedRoute>
      <ToastProvider>
        <AppContent />
        <ToastContainer />
      </ToastProvider>
    </ProtectedRoute>
  )
}