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
            <Link href="/minddump-waitlist">
              <button className="nav-cta">🎯 Join Waitlist</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Your mind is <span className="highlight">overloaded</span> with tasks</h1>
            <p className="hero-description">Stop juggling endless to-dos in your head. MindDumper uses smart trigger words in 5 languages to help you remember every forgotten task, project, and idea. Clear your mind in 10 minutes and export everything to your favorite task app.</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">15K+</span>
                <span className="stat-label">Global users</span>
              </div>
              <div className="stat">
                <span className="stat-number">400K+</span>
                <span className="stat-label">Tasks dumped</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.8★</span>
                <span className="stat-label">Average rating</span>
              </div>
            </div>
            <div className="hero-buttons">
              <Link href="/auth/signup">
                <button className="btn-primary">Get Lifetime Access - €29 🔥</button>
              </Link>
              <Link href="/minddump-waitlist">
                <button className="btn-secondary">🎯 Join Waitlist</button>
              </Link>
            </div>
            <p className="hero-guarantee">One-time payment • All future updates included • 30-day money-back guarantee</p>
          </div>
          <div className="hero-image">
            <Image src="https://via.placeholder.com/600x400/f0f0f0/666666?text=MindDumper+App" alt="MindDumper App Screenshot" width={600} height={400} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-container">
          <h2 className="section-title">Professional Mind Clearing</h2>
          <p className="section-subtitle">Discover how MindDumper helps you extract every task from your mind and export them in an organized format that works with any productivity system.</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-bg">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 2L19.5 12.5L30 16L19.5 19.5L16 30L12.5 19.5L2 16L12.5 12.5L16 2Z" fill="#007AFF"/>
                  </svg>
                </div>
              </div>
              <h3>Multilingual Intelligence</h3>
              <p>Smart trigger words in 5 languages (English, Dutch, German, French, Spanish) help your brain recall every forgotten task and project across cultural contexts.</p>
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
              <h3>Universal Export</h3>
              <p>Export tasks as clean text lists or CSV files. Copy and paste directly into any productivity app - from Todoist to Notion to Apple Notes.</p>
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
              <h3>Mental Clarity</h3>
              <p>Experience the relief of a clear mind. All tasks are safely captured and ready to be organized in your preferred productivity system.</p>
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
              <h3>Enterprise Backup</h3>
              <p>Your brain dumps are automatically synchronized across all devices with enterprise-grade security. Never lose a task again.</p>
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
              <h3>Cross-Platform</h3>
              <p>Use MindDumper on iPhone, Android, Mac, Windows, and in your browser. Access your productivity tools anywhere, anytime.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-bg">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="8" r="3" fill="none" stroke="#007AFF" strokeWidth="2"/>
                    <circle cx="8" cy="20" r="3" fill="none" stroke="#007AFF" strokeWidth="2"/>
                    <circle cx="24" cy="20" r="3" fill="none" stroke="#007AFF" strokeWidth="2"/>
                    <circle cx="16" cy="25" r="2" fill="#007AFF"/>
                    <text x="6" y="14" fontSize="8" fill="#007AFF">EN</text>
                    <text x="22" y="14" fontSize="8" fill="#007AFF">NL</text>
                    <text x="2" y="26" fontSize="8" fill="#007AFF">DE</text>
                    <text x="18" y="30" fontSize="8" fill="#007AFF">FR</text>
                    <text x="26" y="26" fontSize="8" fill="#007AFF">ES</text>
                  </svg>
                </div>
              </div>
              <h3>Global Language Support</h3>
              <p>Work in your native language or switch seamlessly between English, Dutch, German, French, and Spanish during your brain dump sessions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="showcase">
        <div className="section-container">
          <div className="showcase-content">
            <div className="showcase-text">
              <h2>From mental chaos to organized productivity</h2>
              <p>MindDumper guides you through the complete process of clearing your mind. From smart trigger questions to a clean, exportable task list - all in just 10 minutes. Perfect for professionals managing complex projects.</p>
              <ul className="showcase-features">
                <li>Smart trigger words in 5 languages (EN, NL, DE, FR, ES)</li>
                <li>Voice-to-text for rapid input and accessibility</li>
                <li>AI-powered categorization of tasks and projects</li>
                <li>Universal export to any productivity system</li>
              </ul>
              <Link href="/auth/login">
                <button className="btn-primary">Start Your Brain Dump</button>
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
          <h2 className="section-title">What our global users say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>&quot;Finally I can sleep without my mind racing with tasks. MindDumper helps me extract everything and keep it organized. The multilingual support is perfect for our international team.&quot;</p>
              </div>
              <div className="testimonial-author">
                <Image src="https://via.placeholder.com/50x50/e0e0e0/666666?text=JS" alt="James Smith" width={50} height={50} />
                <div>
                  <h4>James Smith</h4>
                  <span>Product Manager, London</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>&quot;The trigger words are brilliant! I thought I had captured everything, but MindDumper helped me remember 20+ additional tasks I&apos;d completely forgotten about.&quot;</p>
              </div>
              <div className="testimonial-author">
                <Image src="https://via.placeholder.com/50x50/e0e0e0/666666?text=MD" alt="Maria Delacroix" width={50} height={50} />
                <div>
                  <h4>Maria Delacroix</h4>
                  <span>UX Designer, Paris</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>&quot;Best €29 I&apos;ve ever spent! Export to Notion works flawlessly and I&apos;ve been using it for over a year with no additional costs. The lifetime deal pays for itself in productivity.&quot;</p>
              </div>
              <div className="testimonial-author">
                <Image src="https://via.placeholder.com/50x50/e0e0e0/666666?text=PJ" alt="Pedro Jiménez" width={50} height={50} />
                <div>
                  <h4>Pedro Jiménez</h4>
                  <span>Startup Founder, Barcelona</span>
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
              <div className="featured-badge">🔥 PROFESSIONAL TOOL</div>
              <h3>MindDumper - Lifetime Access</h3>
              <div className="price">
                <span className="old-price">Worth €99+</span>
                <span className="currency">€</span>
                <span className="amount">29</span>
                <span className="period">one-time - lifetime</span>
              </div>
              <ul className="pricing-features">
                <li>Unlimited professional brain dumps</li>
                <li>Advanced trigger words in 5 languages</li>
                <li>Universal export to any productivity system</li>
                <li>All future updates and features included</li>
                <li>Enterprise-grade cloud synchronization</li>
                <li>Cross-platform availability (web, mobile, desktop)</li>
                <li>Priority email support</li>
                <li>30-day money-back guarantee</li>
              </ul>
              <Link href="/auth/signup">
                <button className="btn-primary">Get Lifetime Access - €29</button>
              </Link>
              <p className="lifetime-note">💎 One-time payment of €29 • Never pay again • All updates included • Yours forever</p>
              <p className="impulse-note">Professional productivity tool for the price of a business lunch - pays for itself in saved time!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="section-container">
          <div className="cta-content">
            <h2>Ready for mental clarity? 🤯</h2>
            <p>Stop juggling endless tasks in your head. For just €29 get MindDumper <strong>FOREVER</strong> - never pay again!</p>
            <div className="cta-buttons">
              <Link href="/auth/signup">
                <button className="btn-primary large">Get Lifetime Access - €29 🔥</button>
              </Link>
              <p className="cta-note">Just €29 one-time • Never pay again • 30-day money-back guarantee</p>
              <p className="cta-urgent">Professional productivity tool for the price of a business lunch!</p>
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
              <p>Clear your mind of all tasks and projects with our intelligent brain dump tool. Professional productivity for global teams.</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#">Features</a>
                <a href="#">Pricing</a>
                <a href="#">Updates</a>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Contact</a>
                <a href="#">Community</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Careers</a>
                <a href="#">Privacy</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 MindDumper. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
