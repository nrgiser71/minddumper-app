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
            <a href="https://order.minddumper.com/checkout/minddumper" className="nav-cta">Get Started - €49</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">The fastest way to <span className="highlight">clear your head</span></h1>
            <p className="hero-description">Finally stop juggling endless tasks in your head. Built on proven memory science — not productivity hype. Help busy people extract every forgotten task, project, and idea - so you can focus on what matters most.</p>
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
            <Image src="/screenshots/Hoofdpagina.svg" alt="MindDumper Brain Dump Interface" width={600} height={400} />
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
            <div className="scenario">
              <h3>→ The important deadline you almost missed</h3>
              <p>You realize with panic that the proposal/report/presentation is due tomorrow, not next week like you thought</p>
            </div>
            <div className="scenario">
              <h3>→ The family commitment you double-booked</h3>
              <p>You promised to attend your kid&apos;s school event but scheduled an important client meeting at the same time</p>
            </div>
            <div className="scenario">
              <h3>→ The expense report from 3 months ago</h3>
              <p>Business receipts pile up in your wallet while you keep forgetting to submit them, losing money every month</p>
            </div>
            <div className="scenario">
              <h3>→ The subscription you meant to cancel</h3>
              <p>You&apos;re paying for 5 different tools/services you don&apos;t use because canceling them never makes it to your action list</p>
            </div>
            <div className="scenario">
              <h3>→ The strategic decision stuck in limbo</h3>
              <p>Your business needs a direction change, but the analysis and decision-making keeps getting pushed aside by daily fires</p>
            </div>
            <div className="scenario">
              <h3>→ The health appointment you keep postponing</h3>
              <p>That important check-up or dental cleaning stays mentally noted but never actually scheduled, affecting your wellbeing</p>
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
                <li>Get unstuck in your own language — with trigger words in EN, NL, DE, FR & ES.</li>
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
          <h2 className="section-title">From Mental Chaos to Crystal Clarity in 3 Steps</h2>
          <p className="section-subtitle">Our proven method guides you through extracting every task, so nothing gets forgotten</p>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Follow Smart Triggers</h3>
              <p>Our scientifically-backed prompts help your brain recall tasks you didn&apos;t even know you forgot</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Capture Everything</h3>
              <p>Extract every project, idea, and task that&apos;s been cluttering your mental space</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
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
              <p>Unlike complex productivity apps, MindDumper helps you get every task out of your head — without friction, learning curves or distractions.</p>
              <ul className="showcase-features">
                <li>Trigger words that help your brain recall forgotten tasks</li>
                <li>Simple interface designed for speed and clarity</li>
                <li>Export to any productivity system you already use</li>
                <li>Trigger words in 5 languages for global teams</li>
                <li>Built by a solo developer who uses it regularly</li>
              </ul>
              <Link href="/app">
                <button className="btn-primary">Try It Now - €49</button>
              </Link>
            </div>
            <div className="showcase-image">
              <Image src="/screenshots/MindDump.svg" alt="Simple Brain Dump Interface" width={500} height={350} />
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
              <h3>Do I need to be tech-savvy to use this?</h3>
              <p>No technical skills required. MindDumper works in your browser - just open it and start. The interface is designed for simplicity, not complexity.</p>
            </div>
            
            <div className="faq-item">
              <h3>Can I use this for both work and personal tasks?</h3>
              <p>Absolutely. Your brain doesn&apos;t separate work and personal stress. Our system covers everything from client projects to weekend plans, giving you complete mental clarity across all areas of life.</p>
            </div>
            
            <div className="faq-item">
              <h3>What if I&apos;m already using other productivity tools?</h3>
              <p>Perfect! MindDumper works with your existing tools. Export your extracted tasks to Todoist, Notion, Asana, or any app you prefer. Think of us as the missing piece that feeds your productivity system.</p>
            </div>
            
            <div className="faq-item">
              <h3>Will this work if I&apos;m not good at remembering things?</h3>
              <p>That&apos;s exactly who this is for! If you were good at remembering, you wouldn&apos;t need trigger words. Our system is specifically designed to help people with busy minds recall forgotten tasks.</p>
            </div>
            
            <div className="faq-item">
              <h3>What if I can&apos;t think of anything during the brain dump?</h3>
              <p>This happens to everyone initially. That&apos;s why we use trigger words - they act as memory prompts. Most people are surprised by how much they remember once the triggers start working.</p>
            </div>
            
            <div className="faq-item">
              <h3>Can I customize the trigger words for my industry/role?</h3>
              <p>Absolutely. While we provide 1000+ proven trigger words across 5 languages, you can add your own industry-specific triggers to make the system even more effective.</p>
            </div>
            
            <div className="faq-item">
              <h3>What happens if I get interrupted during a brain dump?</h3>
              <p>No problem. Your progress is automatically saved. You can pause anytime and pick up exactly where you left off - even days later.</p>
            </div>
            
            <div className="faq-item">
              <h3>Does this replace my current task management system?</h3>
              <p>No, it feeds into it. MindDumper is designed to extract tasks from your head, then export them to whatever system you already use - Todoist, Notion, Apple Notes, etc.</p>
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
                <h4>Legal</h4>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
                <Link href="/refund">Refund Policy</Link>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <Link href="/contact">Contact</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} JBS BV. All rights reserved.</p>
            <p className="trademark">MindDumper is a trademark of JBS BV</p>
          </div>
        </div>
      </footer>
    </>
  )
}