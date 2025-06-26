import Link from 'next/link'
import Image from 'next/image'
import './landing.css'

export default function HomePage() {
  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>MindDumper</h2>
          </div>
          <div className="nav-menu">
            <a href="#features" className="nav-link">Features</a>
            <a href="#pricing" className="nav-link">Lifetime Deal</a>
            <a href="#testimonials" className="nav-link">Reviews</a>
            <Link href="/auth/signup">
              <button className="nav-cta">🔥 Koop Nu - €12</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Maak je hoofd <span className="highlight">leeg</span> van alle taken</h1>
            <p className="hero-description">MindDumper gebruikt triggerwoorden om je brein te helpen herinneren aan alle taken en projecten die nog gedaan moeten worden. Dump alles uit je hoofd en exporteer naar je favoriete takenapp.</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">12K+</span>
                <span className="stat-label">Tevreden eigenaren</span>
              </div>
              <div className="stat">
                <span className="stat-number">300K+</span>
                <span className="stat-label">Taken gedumpt</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.7★</span>
                <span className="stat-label">Gemiddelde beoordeling</span>
              </div>
            </div>
            <div className="hero-buttons">
              <Link href="/auth/signup">
                <button className="btn-primary">Koop Nu - €12 Lifetime! 🔥</button>
              </Link>
              <Link href="/auth/login">
                <button className="btn-secondary">Inloggen</button>
              </Link>
            </div>
            <p className="hero-guarantee">Nooit meer betalen • Alle updates gratis • 30 dagen geld terug</p>
          </div>
          <div className="hero-image">
            <Image src="https://via.placeholder.com/600x400/f0f0f0/666666?text=MindDumper+App" alt="MindDumper App Screenshot" width={600} height={400} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-container">
          <h2 className="section-title">Krachtige Brain Dump</h2>
          <p className="section-subtitle">Ontdek hoe MindDumper je helpt om alle taken uit je hoofd te krijgen en georganiseerd te exporteren.</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-bg">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 2L19.5 12.5L30 16L19.5 19.5L16 30L12.5 19.5L2 16L12.5 12.5L16 2Z" fill="#007AFF"/>
                  </svg>
                </div>
              </div>
              <h3>Meertalige Triggers</h3>
              <p>Triggervragen in 5 talen (Nederlands, Engels, Duits, Frans, Spaans) helpen je brein herinneren aan alle vergeten taken en projecten.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-bg">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="8" y="14" width="16" height="12" rx="2" fill="none" stroke="#007AFF" strokeWidth="2"/>
                    <path d="M12 14V10C12 7.79086 13.7909 6 16 6C18.2091 6 20 7.79086 20 10V14" fill="none" stroke="#007AFF" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
              <h3>Simpele Export</h3>
              <p>Exporteer je taken als eenvoudige tekstlijst. Kopieer en plak direct in elke app - van Todoist tot Apple Notes.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-bg">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="4" fill="#007AFF"/>
                    <circle cx="8" cy="8" r="2" fill="#007AFF"/>
                    <circle cx="24" cy="8" r="2" fill="#007AFF"/>
                    <circle cx="8" cy="24" r="2" fill="#007AFF"/>
                    <circle cx="24" cy="24" r="2" fill="#007AFF"/>
                    <line x1="16" y1="16" x2="8" y2="8" stroke="#007AFF" strokeWidth="2"/>
                    <line x1="16" y1="16" x2="24" y2="8" stroke="#007AFF" strokeWidth="2"/>
                    <line x1="16" y1="16" x2="8" y2="24" stroke="#007AFF" strokeWidth="2"/>
                    <line x1="16" y1="16" x2="24" y2="24" stroke="#007AFF" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
              <h3>Mentale Rust</h3>
              <p>Voel de opluchting van een leeg hoofd. Alle taken zijn veilig opgeslagen en klaar om georganiseerd te worden.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-bg">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M24 12H22C21.45 8.86 18.84 6.5 15.5 6.5S9.55 8.86 9 12H8C5.79 12 4 13.79 4 16S5.79 20 8 20H24C26.21 20 28 18.21 28 16S26.21 12 24 12Z" fill="none" stroke="#007AFF" strokeWidth="2"/>
                    <path d="M16 14V18M16 18L18 16M16 18L14 16" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <h3>Automatische Backup</h3>
              <p>Je brain dumps worden automatisch gesynchroniseerd tussen al je apparaten. Nooit meer taken kwijt.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-bg">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="6" y="4" width="12" height="20" rx="2" fill="none" stroke="#007AFF" strokeWidth="2"/>
                    <rect x="14" y="8" width="12" height="16" rx="2" fill="none" stroke="#007AFF" strokeWidth="2"/>
                    <line x1="10" y1="20" x2="14" y2="20" stroke="#007AFF" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
              <h3>Overal Beschikbaar</h3>
              <p>Gebruik MindDumper op iPhone, Android, Mac, Windows en in je browser. Altijd toegankelijk.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-bg">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="8" r="3" fill="none" stroke="#007AFF" strokeWidth="2"/>
                    <circle cx="8" cy="20" r="3" fill="none" stroke="#007AFF" strokeWidth="2"/>
                    <circle cx="24" cy="20" r="3" fill="none" stroke="#007AFF" strokeWidth="2"/>
                    <circle cx="16" cy="25" r="2" fill="#007AFF"/>
                    <text x="6" y="14" fontSize="8" fill="#007AFF">NL</text>
                    <text x="22" y="14" fontSize="8" fill="#007AFF">EN</text>
                    <text x="2" y="26" fontSize="8" fill="#007AFF">DE</text>
                    <text x="18" y="30" fontSize="8" fill="#007AFF">FR</text>
                    <text x="26" y="26" fontSize="8" fill="#007AFF">ES</text>
                  </svg>
                </div>
              </div>
              <h3>5 Talen Ondersteund</h3>
              <p>Werk in je eigen taal of wissel makkelijk tussen Nederlands, Engels, Duits, Frans en Spaans tijdens je brain dump sessies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="showcase">
        <div className="section-container">
          <div className="showcase-content">
            <div className="showcase-text">
              <h2>Van chaotisch hoofd naar georganiseerde taken</h2>
              <p>MindDumper begeleidt je door het proces van het leegmaken van je hoofd. Van triggervragen tot een nette tekstlijst die je direct kunt kopiëren en plakken - in slechts een paar minuten.</p>
              <ul className="showcase-features">
                <li>Slimme triggervragen in 5 talen (NL, EN, DE, FR, ES)</li>
                <li>Voice-to-text voor snelle invoer</li>
                <li>AI-categorisering van taken en projecten</li>
                <li>Kopieer en plak tekstlijst in elke app</li>
              </ul>
              <Link href="/auth/login">
                <button className="btn-primary">Start Je Brain Dump</button>
              </Link>
            </div>
            <div className="showcase-image">
              <Image src="https://via.placeholder.com/500x350/f8f8f8/666666?text=Product+Demo" alt="Product Demo" width={500} height={350} />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials">
        <div className="section-container">
          <h2 className="section-title">Wat lifetime eigenaren zeggen</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>&quot;Eindelijk kan ik slapen zonder dat mijn hoofd vol zit met taken. MindDumper helpt me alles eruit te krijgen en georganiseerd te houden.&quot;</p>
              </div>
              <div className="testimonial-author">
                <Image src="https://via.placeholder.com/50x50/e0e0e0/666666?text=JS" alt="Jan Smith" width={50} height={50} />
                <div>
                  <h4>Jan Smith</h4>
                  <span>Product Manager</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>&quot;De triggerwoorden zijn briljant! Ik dacht dat ik alles had opgeschreven, maar MindDumper hielp me nog 15 extra taken herinneren.&quot;</p>
              </div>
              <div className="testimonial-author">
                <Image src="https://via.placeholder.com/50x50/e0e0e0/666666?text=MD" alt="Maria Doe" width={50} height={50} />
                <div>
                  <h4>Maria Doe</h4>
                  <span>Designer</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>&quot;Beste €12 die ik ooit uitgegeven heb! Export naar Things werkt perfect en ik heb het nu al een jaar zonder extra kosten. Lifetime deal was briljant.&quot;</p>
              </div>
              <div className="testimonial-author">
                <Image src="https://via.placeholder.com/50x50/e0e0e0/666666?text=PJ" alt="Piet Janssen" width={50} height={50} />
                <div>
                  <h4>Piet Janssen</h4>
                  <span>Entrepreneur</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing">
        <div className="section-container">
          <h2 className="section-title">🔥 LIFETIME DEAL - Eenmalig €12</h2>
          <p className="section-subtitle">Koop MindDumper nu voor minder dan een lunch en gebruik het <strong>VOOR ALTIJD</strong>. Geen abonnementen, geen extra kosten. Ooit.</p>
          <div className="urgency-banner">
            <p>⚡ Introductieprijs van €12 - Normale prijs wordt €29 ⚡</p>
          </div>
          
          <div className="pricing-single">
            <div className="pricing-card featured single">
              <div className="featured-badge">🔥 LIFETIME DEAL</div>
              <h3>MindDumper - Voor Altijd</h3>
              <div className="price">
                <span className="old-price">€29</span>
                <span className="currency">€</span>
                <span className="amount">12</span>
                <span className="period">eenmalig - lifetime</span>
              </div>
              <ul className="pricing-features">
                <li>Onbeperkte brain dumps</li>
                <li>Geavanceerde triggerwoorden in 5 talen</li>
                <li>Simpele tekstlijst export</li>
                <li>Alle toekomstige updates gratis</li>
                <li>Cloud synchronisatie</li>
                <li>Beschikbaar op alle platforms</li>
                <li>Prioriteit email support</li>
                <li>30 dagen geld-terug-garantie</li>
              </ul>
              <Link href="/auth/signup">
                <button className="btn-primary">Koop Nu - Slechts €12 (Lifetime!)</button>
              </Link>
              <p className="lifetime-note">💎 Eénmalige betaling van €12 • Nooit meer betalen • Alle updates gratis • Voor altijd van jou</p>
              <p className="impulse-note">Minder dan een lunch voor een tool die je productiviteit voor altijd verhoogt!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="section-container">
          <div className="cta-content">
            <h2>Klaar voor een leeg hoofd? 🤯</h2>
            <p>Stop met het onthouden van alle taken in je hoofd. Voor slechts €12 krijg je MindDumper <strong>VOOR ALTIJD</strong> - nooit meer betalen!</p>
            <div className="cta-buttons">
              <Link href="/auth/signup">
                <button className="btn-primary large">Koop Nu - €12 Lifetime Deal! 🔥</button>
              </Link>
              <p className="cta-note">Slechts €12 eenmalig • Nooit meer betalen • 30 dagen geld-terug-garantie</p>
              <p className="cta-urgent">Minder dan een koffie met gebak voor een lifetime productiviteitstool!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="section-container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>MindDumper</h3>
              <p>Maak je hoofd leeg van alle taken en projecten met onze slimme brain dump tool.</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#">Features</a>
                <a href="#">Prijzen</a>
                <a href="#">Updates</a>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Contact</a>
                <a href="#">Community</a>
              </div>
              <div className="footer-column">
                <h4>Bedrijf</h4>
                <a href="#">Over ons</a>
                <a href="#">Careers</a>
                <a href="#">Privacy</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 MindDumper. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
