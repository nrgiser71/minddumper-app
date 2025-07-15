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
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#testimonials" className="nav-link">Reviews</a>
            <a href="https://order.minddumper.com" className="nav-cta">Get Started - €49</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">MindDumper - <span className="highlight">A better brain dump tool</span></h1>
            <p className="hero-description">Built specifically for mental clarity with intelligent trigger words. Your brain isn&apos;t a storage device - clear your overloaded mind in 10 minutes using smart trigger words in 5 languages.</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">15K+</span>
                <span className="stat-label">minds cleared</span>
              </div>
              <div className="stat">
                <span className="stat-number">400K+</span>
                <span className="stat-label">tasks dumped</span>
              </div>
              <div className="stat">
                <span className="stat-number">No ads</span>
                <span className="stat-label">sustainable</span>
              </div>
            </div>
            <div className="hero-buttons">
              <a href="https://order.minddumper.com" className="btn-primary">Get MindDumper Now - €49</a>
              <Link href="/landing">
                <button className="btn-secondary">Learn More</button>
              </Link>
            </div>
            <p className="hero-guarantee">Professional brain dump tool • €49 one-time • Lifetime access</p>
          </div>
          <div className="hero-image">
            <Image src="https://via.placeholder.com/600x400/f0f0f0/666666?text=MindDumper+Interface" alt="MindDumper Brain Dump Interface" width={600} height={400} />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem">
        <div className="section-container">
          <h2 className="section-title">Your brain isn&apos;t a storage device</h2>
          <p className="section-subtitle">Stop juggling endless tasks in your head. Mental overwhelm kills productivity and causes stress. There&apos;s a better way.</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-container">
          <h2 className="section-title">Free vs Pro: Choose your level</h2>
          <p className="section-subtitle">Start with our free brain dump tool, upgrade to Pro for advanced features. Both designed with the same principle: simplicity and effectiveness.</p>
          
          <div className="features-tiers">
            <div className="tier-card free">
              <div className="tier-header">
                <h3>Free Brain Dump</h3>
                <div className="tier-price">€0</div>
                <p className="tier-description">Perfect for getting started</p>
              </div>
              <ul className="tier-features">
                <li>Basic brain dump interface</li>
                <li>Core trigger words (100+ words)</li>
                <li>Simple text export</li>
                <li>1 language (Dutch)</li>
                <li>No learning curve</li>
              </ul>
              <Link href="/app">
                <button className="btn-secondary">Start Free</button>
              </Link>
            </div>
            
            <div className="tier-card pro">
              <div className="tier-header">
                <div className="tier-badge">Most Popular</div>
                <h3>Pro Brain Dump</h3>
                <div className="tier-price">€49 <span className="tier-period">lifetime</span></div>
                <p className="tier-description">Professional mental clarity</p>
              </div>
              <ul className="tier-features">
                <li>Advanced trigger words (1000+ words)</li>
                <li>5 languages (EN, NL, DE, FR, ES)</li>
                <li>CSV export + integrations</li>
                <li>Custom trigger words</li>
                <li>Cloud sync across devices</li>
                <li>All future updates included</li>
                <li>Priority support</li>
              </ul>
              <Link href="#pricing">
                <button className="btn-primary">Upgrade to Pro</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="showcase">
        <div className="section-container">
          <div className="showcase-content">
            <div className="showcase-text">
              <h2>Built specifically for brain dumping</h2>
              <p>Unlike complex productivity apps, MindDumper does one thing incredibly well: helps you extract every task from your mind using intelligent trigger words. No learning curve, no overwhelm.</p>
              <ul className="showcase-features">
                <li>Trigger words that help your brain recall forgotten tasks</li>
                <li>Simple interface designed for speed and clarity</li>
                <li>Export to any productivity system you already use</li>
                <li>Works in 5 languages for global teams</li>
                <li>Built by a solo developer who uses it daily</li>
              </ul>
              <Link href="/app">
                <button className="btn-primary">Try It Now - Free</button>
              </Link>
            </div>
            <div className="showcase-image">
              <Image src="https://via.placeholder.com/500x350/f8f8f8/666666?text=Simple+Interface" alt="Simple Brain Dump Interface" width={500} height={350} />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials">
        <div className="section-container">
          <h2 className="section-title">What users say about mental clarity</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>&quot;Finally I can sleep without my mind racing with tasks. MindDumper&apos;s trigger words helped me extract everything I&apos;d forgotten. The simplicity is what makes it work.&quot;</p>
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
                <p>&quot;The trigger words are brilliant! I thought I had captured everything, but MindDumper helped me remember 20+ tasks I&apos;d completely forgotten about. No learning curve.&quot;</p>
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
                <p>&quot;Best €49 I&apos;ve ever spent! The lifetime deal is incredible value and I&apos;ve been using it for over a year with no additional costs. Export to Notion works perfectly.&quot;</p>
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
          <h2 className="section-title">Simple, transparent pricing</h2>
          <p className="section-subtitle">Start free, upgrade when you need more. Lock in €49 lifetime pricing - will be €49 for new users.</p>
          <div className="price-lock-banner">
            <p>🔒 Price Lock Guarantee: Early users keep €49 forever - Future pricing: €49</p>
          </div>
          
          <div className="pricing-comparison">
            <div className="pricing-card free-card">
              <h3>Free</h3>
              <div className="price">
                <span className="currency">€</span>
                <span className="amount">0</span>
                <span className="period">always free</span>
              </div>
              <ul className="pricing-features">
                <li>Basic brain dump interface</li>
                <li>Core trigger words (100+)</li>
                <li>Simple text export</li>
                <li>1 language (Dutch)</li>
                <li>No learning curve</li>
              </ul>
              <Link href="/app">
                <button className="btn-secondary">Start Free</button>
              </Link>
            </div>
            
            <div className="pricing-card pro-card featured">
              <div className="featured-badge">Most Popular</div>
              <h3>Pro - Lifetime</h3>
              <div className="price">
                <span className="old-price">€49</span>
                <span className="currency">€</span>
                <span className="amount">29</span>
                <span className="period">one-time, forever</span>
              </div>
              <ul className="pricing-features">
                <li>Advanced trigger words (1000+)</li>
                <li>5 languages (EN, NL, DE, FR, ES)</li>
                <li>CSV export + integrations</li>
                <li>Custom trigger words</li>
                <li>Cloud sync across devices</li>
                <li>All future updates included</li>
                <li>Priority support</li>
              </ul>
              <Link href="/auth/signup">
                <button className="btn-primary">Lock in €49 Lifetime</button>
              </Link>
              <p className="lifetime-note">💎 One-time payment • Never pay again • All updates included</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solo Developer Section */}
      <section className="developer">
        <div className="section-container">
          <div className="developer-content">
            <h2>Built by someone who uses it daily</h2>
            <p>MindDumper was created to solve my own mental overwhelm. No external funding, no ads, no subscriptions. Just a simple tool that works, maintained by someone who understands the problem.</p>
            <div className="developer-features">
              <div className="developer-feature">
                <h4>Sustainable Business</h4>
                <p>No ads, no external investors. One-time purchase supports continuous development.</p>
              </div>
              <div className="developer-feature">
                <h4>Personal Use</h4>
                <p>I use MindDumper every day to manage my own projects and tasks. It&apos;s built for real use.</p>
              </div>
              <div className="developer-feature">
                <h4>Continuous Improvement</h4>
                <p>All future updates and features included. Your one-time purchase supports ongoing development.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="section-container">
          <div className="cta-content">
            <h2>Ready to clear your mind?</h2>
            <p>Start with our free brain dump tool. Upgrade to Pro when you need advanced features. Lock in €49 lifetime pricing today.</p>
            <div className="cta-buttons">
              <Link href="/app">
                <button className="btn-primary large">Start Free Brain Dump</button>
              </Link>
              <p className="cta-note">Free to start • Pro: €49 lifetime • Price lock guarantee</p>
              <p className="cta-urgent">Built specifically for brain dumping - no learning curve!</p>
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
