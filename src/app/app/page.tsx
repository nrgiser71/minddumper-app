'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getTriggerWords, getTriggerWordsList, saveBrainDump } from '@/lib/database'
import '../app.css'

type Language = 'nl' | 'en' | 'de' | 'fr' | 'es'
type Screen = 'home' | 'language' | 'minddump' | 'finish' | 'config' | 'history'

export default function AppPage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')
  const [currentLanguage, setCurrentLanguage] = useState<Language>('nl')
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentIdeas, setCurrentIdeas] = useState<string[]>([])
  const [allIdeas, setAllIdeas] = useState<string[]>([])
  const [ideaInput, setIdeaInput] = useState('')
  const [triggerWords, setTriggerWords] = useState<string[]>([])
  const [configTriggerWords, setConfigTriggerWords] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [configLoading, setConfigLoading] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)

  const showScreen = (screenId: Screen) => {
    setCurrentScreen(screenId)
    
    // Load trigger words when going to config screen
    if (screenId === 'config' && configTriggerWords.length === 0) {
      loadConfigTriggerWords()
    }
  }

  const loadConfigTriggerWords = async () => {
    setConfigLoading(true)
    try {
      const words = await getTriggerWordsList(currentLanguage)
      setConfigTriggerWords(words)
    } catch (error) {
      console.error('Error loading config trigger words:', error)
    }
    setConfigLoading(false)
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
      const words = await getTriggerWordsList(language)
      setTriggerWords(words)
    } catch (error) {
      console.error('Error loading trigger words:', error)
      // Fallback to empty array, database.ts will handle fallback
      setTriggerWords([])
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
              <div className="trigger-word">{currentWord}</div>
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
                  <div className="trigger-list">
                    {configTriggerWords.map((word, index) => (
                      <div key={index} className="trigger-item">
                        <input type="checkbox" id={`trigger${index}`} defaultChecked={true} />
                        <label htmlFor={`trigger${index}`}>{word}</label>
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
              <h3>Eigen woorden toevoegen</h3>
              <div className="add-word-container">
                <input type="text" className="add-word-input" placeholder="Nieuw triggerwoord..." />
                <button className="btn-add">Toevoegen</button>
              </div>
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
              <div className="history-item" onClick={() => showScreen('finish')}>
                <div className="history-date">24 december 2024</div>
                <div className="history-stats">
                  <span className="stat">47 ideeën</span>
                  <span className="stat">12 triggerwoorden</span>
                  <span className="stat">8 min</span>
                </div>
                <div className="history-preview">Lorem ipsum, consectetur adipiscing, sed do eiusmod...</div>
              </div>
              
              <div className="history-item" onClick={() => showScreen('finish')}>
                <div className="history-date">23 december 2024</div>
                <div className="history-stats">
                  <span className="stat">31 ideeën</span>
                  <span className="stat">8 triggerwoorden</span>
                  <span className="stat">6 min</span>
                </div>
                <div className="history-preview">Tempor incididunt, ut labore dolore, magna aliqua...</div>
              </div>
              
              <div className="history-item" onClick={() => showScreen('finish')}>
                <div className="history-date">20 december 2024</div>
                <div className="history-stats">
                  <span className="stat">28 ideeën</span>
                  <span className="stat">7 triggerwoorden</span>
                  <span className="stat">5 min</span>
                </div>
                <div className="history-preview">Ut enim ad minim, quis nostrud exercitation...</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}