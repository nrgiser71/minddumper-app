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
            <Link href="/app">
              <button className="nav-cta">Get Started - €29</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Clear Your <span className="highlight">Overloaded Mind</span> in 10 Minutes</h1>
            <p className="hero-description">Finally stop juggling endless tasks in your head. Our scientifically-backed trigger word method helps busy entrepreneurs extract every forgotten task, project, and idea - so you can focus on building what matters.</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">15K+</span>
                <span className="stat-label">entrepreneurs</span>
              </div>
              <div className="stat">
                <span className="stat-number">400K+</span>
                <span className="stat-label">tasks extracted</span>
              </div>
              <div className="stat">
                <span className="stat-number">10 min</span>
                <span className="stat-label">average time</span>
              </div>
            </div>
            <div className="hero-buttons">
              <Link href="/app">
                <button className="btn-primary">Clear My Mind Now - €29</button>
              </Link>
            </div>
            <p className="hero-guarantee">No signup required • Works in 5 languages • Used by 15,000+ entrepreneurs</p>
          </div>
          <div className="hero-image">
            <Image src="https://via.placeholder.com/600x400/f0f0f0/666666?text=MindDumper+Interface" alt="MindDumper Brain Dump Interface" width={600} height={400} />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem">
        <div className="section-container">
          <h2 className="section-title">Every night, your mind races with unfinished business</h2>
          <div className="problem-scenarios">
            <div className="scenario">
              <h3>→ That client call you forgot to schedule</h3>
              <p>It&apos;s 11 PM and you suddenly remember the follow-up meeting you promised last week</p>
            </div>
            <div className="scenario">
              <h3>→ The brilliant idea that vanished</h3>
              <p>You had the perfect solution for your product, but now it&apos;s gone - lost in the mental chaos</p>
            </div>
            <div className="scenario">
              <h3>→ Projects stuck in your head</h3>
              <p>Half-finished tasks pile up because you can&apos;t remember what needs to happen next</p>
            </div>
          </div>
          <p className="problem-conclusion">Your brain wasn&apos;t designed to be a filing cabinet. When you try to store everything mentally, you lose focus, miss opportunities, and burn out faster.</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-container">
          <h2 className="section-title">Professional Mental Clarity System</h2>
          <p className="section-subtitle">Clear your mind in 10 minutes with advanced triggers. Work across 5 languages - perfect for international entrepreneurs.</p>
          
          <div className="features-single">
            <div className="tier-card featured single">
              <div className="tier-header">
                <h3>MindDumper Professional</h3>
                <div className="tier-price">€29 <span className="tier-period">lifetime</span></div>
                <p className="tier-description">Complete mental clarity for global entrepreneurs</p>
              </div>
              <ul className="tier-features">
                <li>Clear your mind in 10 minutes</li>
                <li>Extract forgotten tasks with advanced triggers</li>
                <li>Work in 5 languages - perfect for international business</li>
                <li>Export directly to Notion, Todoist, Asana</li>
                <li>Add your own trigger words for your industry</li>
                <li>Access from anywhere - phone, laptop, tablet</li>
                <li>Never pay again - all future features included</li>
                <li>Priority support when you need help</li>
              </ul>
              <Link href="#pricing">
                <button className="btn-primary">Get Lifetime Access - €29</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-container">
          <h2 className="section-title">From Mental Chaos to Crystal Clarity in 4 Steps</h2>
          <p className="section-subtitle">Our proven method guides you through extracting every task, so nothing gets forgotten</p>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Choose Your Focus</h3>
              <p>Select what&apos;s weighing on your mind: Work projects, personal tasks, or creative ideas</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Follow Smart Triggers</h3>
              <p>Our scientifically-backed prompts help your brain recall tasks you didn&apos;t even know you forgot</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Capture Everything</h3>
              <p>In 10 minutes, extract every project, idea, and task that&apos;s been cluttering your mental space</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Export & Focus</h3>
              <p>Send your complete list to any app you use. Now your mind is clear to focus on what matters most</p>
            </div>
          </div>
          
          <div className="how-it-works-cta">
            <Link href="/app">
              <button className="btn-primary">Try It Now - Takes 10 Minutes</button>
            </Link>
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
                <button className="btn-primary">Try It Now - €29</button>
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
          <h2 className="section-title">How Entrepreneurs Reclaimed Their Mental Freedom</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>&quot;Before MindDumper, I&apos;d lie awake at 2 AM stressing about forgotten client calls. After one 10-minute session, I extracted 47 tasks I didn&apos;t even know were weighing on me. Now I sleep like a baby and my business runs smoother.&quot;</p>
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
                <p>&quot;I&apos;ve tried every productivity app out there. Nothing worked because I kept forgetting to capture things. MindDumper&apos;s trigger words pulled out ideas from 6 months ago that became my biggest product features. This tool pays for itself.&quot;</p>
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
                <p>&quot;As a startup founder managing 3 projects, my mind was a mess. One MindDumper session revealed the marketing campaign I&apos;d forgotten about - it generated €50K in sales. This €29 tool literally made me money.&quot;</p>
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
          <p className="section-subtitle">One-time payment of €29 for lifetime access. No subscriptions, no hidden costs.</p>
          
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
                <button className="btn-primary">Lock in €29 Lifetime</button>
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

      {/* FAQ Section */}
      <section className="faq">
        <div className="section-container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How is this different from just making a to-do list?</h3>
              <p>Regular to-do lists only capture what you remember. Our trigger word method uses psychological prompts to help your brain recall tasks you didn&apos;t even know you forgot - like that client follow-up from 2 weeks ago or the product idea you had in the shower.</p>
            </div>
            
            <div className="faq-item">
              <h3>Is this scientifically proven?</h3>
              <p>Yes. Our method is based on memory retrieval psychology and cognitive offloading research. Studies show that external memory aids (like our trigger system) significantly reduce mental load and improve focus performance.</p>
            </div>
            
            <div className="faq-item">
              <h3>What if I have too many tasks?</h3>
              <p>That&apos;s exactly why you need this. The more overwhelmed you feel, the more tasks are probably stuck in your head creating anxiety. Our system helps extract everything systematically, so you can prioritize based on reality, not overwhelm.</p>
            </div>
            
            <div className="faq-item">
              <h3>How long does it actually take?</h3>
              <p>Most entrepreneurs complete a full brain dump in 8-12 minutes. MindDumper guides you through comprehensive work and personal extraction with advanced triggers across 5 languages.</p>
            </div>
            
            <div className="faq-item">
              <h3>Can I use this for both work and personal tasks?</h3>
              <p>Absolutely. Your brain doesn&apos;t separate work and personal stress. Our system covers everything from client projects to weekend plans, giving you complete mental clarity across all areas of life.</p>
            </div>
            
            <div className="faq-item">
              <h3>What if I&apos;m already using other productivity tools?</h3>
              <p>Perfect! MindDumper works with your existing tools. Export your extracted tasks to Todoist, Notion, Asana, or any app you prefer. Think of us as the missing piece that feeds your productivity system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="section-container">
          <div className="cta-content">
            <h2>Stop Carrying The Weight of Unfinished Business</h2>
            <p>Every day you wait, more tasks pile up in your head. More brilliant ideas get forgotten. More opportunities slip by because you&apos;re too overwhelmed to focus.</p>
            <p>Take 10 minutes right now. Clear your mind. Get back to building what matters.</p>
            <div className="cta-buttons">
              <Link href="/app">
                <button className="btn-primary large">Clear My Mind Now - €29</button>
              </Link>
              <p className="cta-note">No signup required • Works immediately • Join 15,000+ entrepreneurs</p>
              <p className="cta-urgent">Your mind is your most valuable asset. Stop using it as a storage device.</p>
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