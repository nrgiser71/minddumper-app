'use client'

import { useState, useEffect } from 'react'
import './waitlist.css'

interface ToastType {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

export default function MindDumpWaitlist() {
  const [email, setEmail] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [waitlistStats, setWaitlistStats] = useState('Bezig met laden...')
  const [toasts, setToasts] = useState<ToastType[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)

  // Toast management
  const showToast = (message: string, type: ToastType['type'] = 'info') => {
    const id = Date.now()
    const newToast = { id, message, type }
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after 6 seconds for success, 4 seconds for others
    const timeout = type === 'success' ? 6000 : 4000
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, timeout)
  }

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Load waitlist stats
  const loadWaitlistStats = async () => {
    try {
      const response = await fetch('/api/minddump-waitlist/stats')
      const data = await response.json()
      
      if (data.total === 0) {
        setWaitlistStats('Wees de eerste op de wachtlijst! 🚀')
      } else {
        setWaitlistStats(`${data.message} staan al op de wachtlijst 🎉`)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
      setWaitlistStats('Join the waitlist! 🚀')
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!firstname.trim()) {
      showToast('Voornaam is verplicht', 'error')
      return
    }
    
    if (!email.trim() || !email.includes('@')) {
      showToast('Voer een geldig email adres in', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/minddump-waitlist/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          firstname: firstname.trim(), 
          lastname: lastname.trim() 
        })
      })

      const data = await response.json()

      if (response.ok) {
        showToast(`🎉 Perfect! Je staat nu op positie ${data.position} op de wachtlijst. We houden je op de hoogte!`, 'success')
        setFirstname('')
        setLastname('')
        setEmail('')
        loadWaitlistStats() // Refresh stats
      } else {
        if (data.already_exists) {
          showToast('Je staat al op de wachtlijst! We laten je weten zodra MindDump beschikbaar is.', 'error')
        } else {
          showToast(data.error || 'Er is een fout opgetreden bij het aanmelden', 'error')
        }
      }
    } catch (error) {
      console.error('Signup error:', error)
      showToast('Netwerk fout. Controleer je internetverbinding.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToSignup = () => {
    document.querySelector('.signup-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    })
  }

  // Load stats on component mount
  useEffect(() => {
    loadWaitlistStats()
  }, [])

  // Screenshot carousel for mobile
  const updateCarousel = (slideIndex: number) => {
    setCurrentSlide(slideIndex)
  }

  const screenshots = [
    {
      title: "Mind Map Creator",
      description: "Creëer prachtige mind maps met drag & drop interface",
      src: "/screenshots/mind-map-creator.svg"
    },
    {
      title: "AI Suggestions", 
      description: "Intelligente suggesties helpen je gedachten structureren",
      src: "/screenshots/ai-suggestions.svg"
    },
    {
      title: "Collaboration",
      description: "Real-time samenwerking aan mind maps", 
      src: "/screenshots/collaboration.svg"
    },
    {
      title: "Mobile App",
      description: "Onderweg mind maps bekijken en bewerken",
      src: "/screenshots/mobile-app.svg"
    }
  ]

  return (
    <div className="waitlist-container">
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-message">{toast.message}</span>
            <button 
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Waitlist Banner */}
      <div className="waitlist-banner">
        <span className="banner-emoji">⏳</span>
        MindDump is nog niet openbaar beschikbaar - Schrijf je in voor early access!
      </div>

      <div className="container">
        {/* Header */}
        <header className="header">
          <img src="/minddump-logo.svg" alt="MindDump" className="logo" />
          <h1 className="hero-title">Binnenkort Beschikbaar</h1>
          <p className="hero-subtitle">De revolutionaire mind mapping app</p>
          <p className="hero-description">
            Organiseer je gedachten, projecten en ideeën zoals nooit tevoren. Schrijf je in voor de wachtlijst en krijg als eerste toegang.
          </p>
        </header>

        {/* Signup Section */}
        <section className="signup-section">
          <h2 className="signup-title">🎯 Zet je op de wachtlijst</h2>
          <p className="signup-subtitle">Krijg als eerste toegang wanneer MindDump live gaat en ontvang updates over de voortgang</p>
          
          <div className="waitlist-stats">
            <span>{waitlistStats}</span>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="name-fields">
              <input 
                type="text" 
                className="form-input" 
                placeholder="Voornaam" 
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Achternaam (optioneel)" 
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
            <input 
              type="email" 
              className="form-input email-input" 
              placeholder="je@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className="signup-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Bezig...' : '📋 Zet me op de wachtlijst'}
            </button>
          </form>

          <p className="privacy-text">
            We respecteren je privacy. Geen spam, alleen updates over MindDump.
          </p>
        </section>

        {/* Screenshots Section */}
        <section className="screenshots-section">
          <h2 className="screenshots-title">Zie MindDump in actie</h2>
          <p className="screenshots-subtitle">Ontdek hoe MindDump je helpt om je gedachten visueel te organiseren</p>
          
          <div className="screenshots-container">
            <div 
              className="screenshot-grid"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {screenshots.map((screenshot, index) => (
                <div key={index} className="screenshot-item">
                  <div className="macos-window">
                    <div className="macos-titlebar">
                      <div className="macos-buttons">
                        <span className="macos-button close"></span>
                        <span className="macos-button minimize"></span>
                        <span className="macos-button maximize"></span>
                      </div>
                      <span className="macos-title">MindDump - {screenshot.title}</span>
                    </div>
                    <img 
                      src={screenshot.src} 
                      alt={screenshot.title} 
                      className="screenshot-image" 
                      loading="lazy" 
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Mobile carousel indicators */}
            <div className="carousel-indicators">
              {screenshots.map((_, index) => (
                <span 
                  key={index}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => updateCarousel(index)}
                />
              ))}
            </div>
          </div>
          
          <div className="demo-cta">
            <button className="demo-button" onClick={scrollToSignup}>
              📋 Schrijf je in voor early access →
            </button>
            <p className="landing-link">
              <a href="/landing">🔍 Bekijk de volledige productpagina</a>
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="features-title">Wat maakt MindDump uniek?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🧠</span>
              <h3 className="feature-title">AI-Powered Mind Mapping</h3>
              <p className="feature-description">
                Intelligente suggesties en automatische structurering van je gedachten en ideeën.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">🎨</span>
              <h3 className="feature-title">Visuele Organisatie</h3>
              <p className="feature-description">
                Prachtige, intuïtieve interface om complexe projecten overzichtelijk te houden.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">🔄</span>
              <h3 className="feature-title">Real-time Synchronisatie</h3>
              <p className="feature-description">
                Werk samen aan mind maps die automatisch synchroniseren tussen al je devices.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">📱</span>
              <h3 className="feature-title">Cross-Platform</h3>
              <p className="feature-description">
                Beschikbaar op web, desktop, en mobile. Je mind maps overal bij de hand.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">📊</span>
              <h3 className="feature-title">Smart Analytics</h3>
              <p className="feature-description">
                Inzicht in je denkpatronen en productiviteit door geavanceerde analytics.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">🎯</span>
              <h3 className="feature-title">Focus Mode</h3>
              <p className="feature-description">
                Elimineer afleiding en focus op één onderdeel van je mind map tegelijk.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 MindDump. Binnenkort beschikbaar.</p>
      </footer>
    </div>
  )
}