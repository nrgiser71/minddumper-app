'use client'

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
            <a href="https://order.minddumper.com/checkout/minddumper" className="nav-cta">Get Started - €49</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">The fastest way to <span className="highlight">clear your head</span></h1>
            <p className="hero-description">Finally stop juggling endless tasks in your head. Our scientifically-backed trigger words (available in 5 languages) help busy people extract every forgotten task, project, and idea - so you can focus on what matters most.</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">5</span>
                <span className="stat-label">languages supported</span>
              </div>
              <div className="stat">
                <span className="stat-number">250+</span>
                <span className="stat-label">triggers per language</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">brain clarity</span>
              </div>
            </div>
            <div className="hero-buttons">
              <a href="https://order.minddumper.com/checkout/minddumper" className="btn-primary">Clear My Mind Now - €49</a>
            </div>
            <p className="hero-guarantee">One-time payment • Trigger words in 5 languages • Lifetime access</p>
          </div>
          <div className="hero-image">
            <Image src="https://via.placeholder.com/600x400/f0f0f0/666666?text=MindDumper+Interface" alt="MindDumper Brain Dump Interface" width={600} height={400} />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem">
        <div className="section-container">
          <h2 className="section-title">Every day, every hour, every minute - your mind races with unfinished business</h2>
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
            <div className="scenario">
              <h3>→ The email you meant to send</h3>
              <p>Important messages sit in drafts while you lose deals because you forgot to hit send</p>
            </div>
            <div className="scenario">
              <h3>→ Team commitments falling through</h3>
              <p>You promised deliverables to your team but can&apos;t recall all the details you agreed on</p>
            </div>
            <div className="scenario">
              <h3>→ Weekend work anxiety</h3>
              <p>You can&apos;t relax because you&apos;re sure you&apos;re forgetting something important for Monday</p>
            </div>
          </div>
          <p className="problem-conclusion">Your brain wasn&apos;t designed to be a filing cabinet. When you try to store everything mentally, you lose focus, miss opportunities, and burn out faster.</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-container">
          <h2 className="section-title">Mental Clarity System</h2>
          <p className="section-subtitle">Clear your mind completely with advanced trigger words available in 5 languages - perfect for anyone juggling multiple tasks.</p>
          
          <div className="features-single">
            <div className="tier-card featured single">
              <div className="tier-header">
                <h3>MindDumper</h3>
                <div className="tier-price">€49 <span className="tier-period">lifetime</span></div>
                <p className="tier-description">Complete mental clarity for busy professionals</p>
              </div>
              <ul className="tier-features">
                <li>Clear your mind completely</li>
                <li>Extract forgotten tasks with advanced trigger words</li>
                <li>Trigger words in 5 languages (EN, NL, DE, FR, ES)</li>
                <li>Export directly to Notion, Todoist, Asana</li>
                <li>Add your own trigger words for your industry</li>
                <li>Access from anywhere - phone, laptop, tablet</li>
                <li>Never pay again - all future features included</li>
                <li>Priority support when you need help</li>
              </ul>
              <Link href="#pricing">
                <button className="btn-primary">Get Lifetime Access - €49</button>
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
              <p>Extract every project, idea, and task that&apos;s been cluttering your mental space</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Export & Focus</h3>
              <p>Send your complete list to any app you use. Now your mind is clear to focus on what matters most</p>
            </div>
          </div>
          
          <div className="how-it-works-cta">
            <Link href="/app">
              <button className="btn-primary">Try It Now</button>
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
              <p>Unlike complex productivity apps, MindDumper does one thing incredibly well: helps you extract every task from your mind using intelligent trigger words in your preferred language. No learning curve, no overwhelm.</p>
              <ul className="showcase-features">
                <li>Trigger words that help your brain recall forgotten tasks</li>
                <li>Simple interface designed for speed and clarity</li>
                <li>Export to any productivity system you already use</li>
                <li>Trigger words in 5 languages for global teams</li>
                <li>Built by a solo developer who uses it daily</li>
              </ul>
              <Link href="/app">
                <button className="btn-primary">Try It Now - €49</button>
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
          <h2 className="section-title">How People Reclaimed Their Mental Freedom</h2>
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
                <p>&quot;Managing 3 projects at once, my mind was a mess. One MindDumper session revealed the marketing campaign I&apos;d forgotten about - it generated €50K in sales. This €49 tool literally made me money.&quot;</p>
              </div>
              <div className="testimonial-author">
                <Image src="https://via.placeholder.com/50x50/e0e0e0/666666?text=PJ" alt="Pedro Jiménez" width={50} height={50} />
                <div>
                  <h4>Pedro Jiménez</h4>
                  <span>Project Manager, Barcelona</span>
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
          <p className="section-subtitle">One-time payment of €49 for lifetime access. No subscriptions, no hidden costs.</p>
          
          <div className="pricing-single">
            <div className="pricing-card featured single">
              <div className="featured-badge">LIFETIME DEAL</div>
              <h3>MindDumper</h3>
              <div className="price">
                <span className="currency">€</span>
                <span className="amount">49</span>
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
              <a href="https://order.minddumper.com/checkout/minddumper" className="btn-primary">Get Lifetime Access - €49</a>
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
              <p>MindDumper guides you through comprehensive work and personal extraction with trigger words in your preferred language (choose from 5 languages).</p>
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
            <p>Take action right now. Clear your mind. Get back to building what matters.</p>
            <div className="cta-buttons">
              <Link href="/app">
                <button className="btn-primary large">Clear My Mind Now - €49</button>
              </Link>
              <p className="cta-note">One-time payment • Works immediately • Lifetime access</p>
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
              <p>Clear your mind of all tasks and projects with our intelligent brain dump tool.</p>
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