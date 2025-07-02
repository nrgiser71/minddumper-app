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
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState({ src: '', title: '' })

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
        showToast('🎉 Perfect! Je staat nu op de MindDumper wachtlijst. We houden je op de hoogte!', 'success')
        setFirstname('')
        setLastname('')
        setEmail('')
        loadWaitlistStats() // Refresh stats
      } else {
        if (data.already_exists) {
          showToast('🎉 Perfect! Je staat al op de MindDumper wachtlijst. We houden je op de hoogte!', 'success')
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

  // Lightbox functions
  const openLightbox = (screenshot: { src: string; title: string; description: string }) => {
    setLightboxImage({ src: screenshot.src, title: screenshot.title })
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = 'auto'
  }

  const screenshots = [
    {
      title: "Hoofdpagina",
      description: "Start direct met je brain dump - één druk op de knop en je bent vertrokken",
      src: "/screenshots/Hoofdpagina.svg"
    },
    {
      title: "MindDump in Actie", 
      description: "Triggerwoorden helpen je om alles uit je hoofd te krijgen - van taken tot ideeën",
      src: "/screenshots/MindDump.svg"
    },
    {
      title: "Configuratie",
      description: "Personaliseer je ervaring: voeg eigen woorden toe en kies uit 300+ triggerwoorden", 
      src: "/screenshots/Configuratie.svg"
    },
    {
      title: "Taalkeuzescherm",
      description: "Kies je voorkeurstaal voor een natuurlijke brain dump ervaring",
      src: "/screenshots/Talen.svg"
    },
    {
      title: "Geschiedenis",
      description: "Bekijk en exporteer al je eerdere brain dumps - jouw gedachten veilig bewaard",
      src: "/screenshots/Geschiedenis.svg"
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
        MindDumper is nog niet openbaar beschikbaar - Schrijf je in voor early access!
      </div>

      <div className="container">
        {/* Header */}
        <header className="header">
          <img src="/Logo.png" alt="MindDumper" className="logo" />
          <h1 className="hero-title">Binnenkort Beschikbaar</h1>
          <p className="hero-subtitle">De revolutionaire brain dump tool</p>
          <p className="hero-description">
            Organiseer je gedachten, projecten en ideeën zoals nooit tevoren. Schrijf je in voor de wachtlijst en krijg als eerste toegang.
          </p>
        </header>

        {/* Signup Section */}
        <section className="signup-section">
          <h2 className="signup-title">🎯 Zet je op de wachtlijst</h2>
          <p className="signup-subtitle">Krijg als eerste toegang wanneer MindDumper live gaat en ontvang updates over de voortgang</p>
          
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
            We respecteren je privacy. Geen spam, alleen updates over MindDumper.
          </p>
        </section>

        {/* Screenshots Section */}
        <section className="screenshots-section">
          <h2 className="screenshots-title">Zie MindDumper in actie</h2>
          <p className="screenshots-subtitle">Ontdek hoe MindDumper je helpt om je gedachten visueel te organiseren</p>
          
          <div className="screenshots-container">
            <div 
              className="screenshot-grid"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {screenshots.map((screenshot, index) => (
                <div 
                  key={index} 
                  className="screenshot-item"
                  onClick={() => openLightbox(screenshot)}
                >
                  <div className="macos-window">
                    <div className="macos-titlebar">
                      <div className="macos-buttons">
                        <span className="macos-button close"></span>
                        <span className="macos-button minimize"></span>
                        <span className="macos-button maximize"></span>
                      </div>
                      <span className="macos-title">MindDumper - {screenshot.title}</span>
                    </div>
                    <img 
                      src={screenshot.src} 
                      alt={screenshot.title} 
                      className="screenshot-image" 
                      loading="lazy" 
                    />
                  </div>
                  <div className="screenshot-info">
                    <h3>{screenshot.title}</h3>
                    <p>{screenshot.description}</p>
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
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 MindDumper. Binnenkort beschikbaar.</p>
      </footer>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              ×
            </button>
            <div className="lightbox-image-container">
              <img 
                src={lightboxImage.src} 
                alt={lightboxImage.title} 
                className="lightbox-image"
              />
            </div>
            <div className="lightbox-title">{lightboxImage.title}</div>
          </div>
        </div>
      )}
    </div>
  )
}