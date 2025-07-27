'use client'

import Link from 'next/link'
import Image from 'next/image'
import './linear.css'
import { useEffect } from 'react'

export default function LinearTestPage() {
  useEffect(() => {
    // Force dark theme for this page immediately
    document.documentElement.style.colorScheme = 'dark'
    document.body.style.backgroundColor = '#0d0e10'
    document.body.style.color = '#f6f8fa'
    document.body.classList.add('linear-dark')
    
    return () => {
      // Cleanup on unmount
      document.documentElement.style.colorScheme = ''
      document.body.style.backgroundColor = ''
      document.body.style.color = ''
      document.body.classList.remove('linear-dark')
    }
  }, [])

  return (
    <div className="linear-page">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            Linear
          </Link>
          
          <div className="nav-menu">
            <Link href="#" className="nav-link">Product</Link>
            <Link href="#" className="nav-link">Resources</Link>
            <Link href="#" className="nav-link">Pricing</Link>
            <Link href="#" className="nav-link">Customers</Link>
            <Link href="#" className="nav-link">Blog</Link>
            <Link href="#" className="nav-link">Contact</Link>
            <Link href="#" className="nav-link">Docs</Link>
          </div>
          
          <div className="nav-actions">
            <Link href="#" className="nav-link">Open app</Link>
            <Link href="#" className="btn-secondary">Log in</Link>
            <Link href="#" className="btn-primary">Sign up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="parallax-bg"></div>
        
        <div className="hero-container">
          <div className="hero-badge">
            <span>🤖</span>
            <span>Introducing Linear for Agents</span>
          </div>
          
          <h1 className="hero-title">
            Linear is a purpose-built tool for planning and building products
          </h1>
          
          <p className="hero-subtitle">
            Meet the system for modern software development. 
            Streamline issues, projects, and product roadmaps.
          </p>
          
          <div className="hero-cta">
            <Link href="#" className="btn-primary btn-large">
              Start building
            </Link>
          </div>
          
          {/* Hero Image Showcase - REPLACE WITH PROFESSIONAL LINEAR SCREENSHOT */}
          <div className="image-showcase">
            <div className="floating-cards">
              <Image 
                src="/linear-test/hero-image.jpg" 
                alt="Linear Product Interface" 
                className="showcase-image card-3d"
                width={800}
                height={600}
                priority
                // TODO: Replace with professional Linear interface screenshot
                // Recommended: 1600x1000px, angled perspective, with interface details
              />
            </div>
          </div>
        </div>
      </section>

      {/* Made for Modern Teams */}
      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Made for modern product teams</h2>
            <p className="section-subtitle">
              Purpose-built for today&apos;s ambitious product teams. Linear helps thousands of 
              teams pursue mastery of their craft with relentless focus, fast execution, 
              and quality of craft.
            </p>
          </div>
          
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Relentless focus</h3>
              <p className="feature-description">
                Cut through the noise with purpose-built tools that keep your team 
                aligned on what matters most.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Fast execution</h3>
              <p className="feature-description">
                Ship faster with workflows designed for speed. From planning to 
                deployment, every interaction is optimized.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3 className="feature-title">Quality of craft</h3>
              <p className="feature-description">
                Beautiful, thoughtful design in every detail. Linear sets a new 
                standard for product development tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Planning */}
      <section className="section">
        <div className="section-container">
          <div className="content-grid">
            <div className="content-text">
              <h3>Set the product direction</h3>
              <p>
                Align your team around the product timeline and manage initiatives 
                that deliver on your strategy. Plan with the collaborative tools your 
                team actually wants to use.
              </p>
              
              <div className="feature-list">
                <div className="feature-item">
                  <h4>Project Overview</h4>
                  <p>Get a high-level view of all projects and their progress</p>
                </div>
                
                <div className="feature-item">
                  <h4>Collaborative documents</h4>
                  <p>Create and share project specs, requirements, and documentation</p>
                </div>
                
                <div className="feature-item">
                  <h4>Cross-team projects</h4>
                  <p>Coordinate work across multiple teams and stakeholders</p>
                </div>
              </div>
            </div>
            
            {/* PROJECT SCREENSHOT - Replace with Linear Projects interface */}
            <div className="floating-cards">
              <Image 
                src="/linear-test/projects.jpg" 
                alt="Project Planning Interface" 
                className="showcase-image angled"
                width={700}
                height={500}
                // TODO: Replace with Linear Projects screenshot showing roadmaps
              />
            </div>
          </div>
        </div>
      </section>

      {/* Issue Tracking */}
      <section className="section">
        <div className="section-container">
          <div className="content-grid">
            {/* ISSUES SCREENSHOT - Replace with Linear Issues interface */}
            <div className="floating-cards">
              <Image 
                src="/linear-test/issues.jpg" 
                alt="Issue Tracking Interface" 
                className="showcase-image angled"
                width={700}
                height={500}
                // TODO: Replace with Linear Issues list screenshot
              />
            </div>
            
            <div className="content-text">
              <h3>Issue tracking you&apos;ll enjoy using</h3>
              <p>
                Finally, issue tracking that doesn&apos;t suck. Powerful yet simple tools 
                that help you organize, prioritize, and ship work efficiently.
              </p>
              
              <div className="feature-list">
                <div className="feature-item">
                  <h4>Cycles</h4>
                  <p>Time-boxed sprints that keep your team focused and productive</p>
                </div>
                
                <div className="feature-item">
                  <h4>Triage management</h4>
                  <p>Organize and prioritize incoming issues efficiently</p>
                </div>
                
                <div className="feature-item">
                  <h4>Custom workflows</h4>
                  <p>Adapt Linear to match your team&apos;s unique processes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="gradient-text">AI that works where you work</span>
            </h2>
            <p className="section-subtitle">
              Introducing Linear for Agents. AI-powered workflows that understand 
              your codebase, integrate with your tools, and help you ship faster.
            </p>
          </div>
          
          {/* AI FEATURES SCREENSHOT - Replace with Linear AI interface */}
          <div className="image-showcase">
            <div className="floating-cards">
              <Image 
                src="/linear-test/ai-features.jpg" 
                alt="AI Features Interface" 
                className="showcase-image angled"
                width={800}
                height={500}
                // TODO: Replace with Linear AI/Agents screenshot
              />
            </div>
          </div>
        </div>
      </section>

      {/* Workflows */}
      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Workflows and integrations</h2>
            <p className="section-subtitle">
              Linear works with the tools you already use. Connect your favorite 
              apps and create powerful workflows that span your entire stack.
            </p>
          </div>
          
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h3 className="feature-title">Git integrations</h3>
              <p className="feature-description">
                Automatically link commits and PRs to issues. See exactly what 
                code changes relate to each issue.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3 className="feature-title">Deployment tracking</h3>
              <p className="feature-description">
                Track deployments and automatically close issues when code ships 
                to production.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Analytics & insights</h3>
              <p className="feature-description">
                Get data-driven insights into your team&apos;s velocity, cycle time, 
                and delivery performance.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3 className="feature-title">Team collaboration</h3>
              <p className="feature-description">
                Built-in commenting, mentions, and notifications keep everyone 
                in sync across projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-section">
              <h4>Features</h4>
              <Link href="#">Issues</Link>
              <Link href="#">Projects</Link>
              <Link href="#">Cycles</Link>
              <Link href="#">Roadmap</Link>
              <Link href="#">Insights</Link>
            </div>
            
            <div className="footer-section">
              <h4>Product</h4>
              <Link href="#">Pricing</Link>
              <Link href="#">Changelog</Link>
              <Link href="#">Method</Link>
              <Link href="#">Linear for Agents</Link>
            </div>
            
            <div className="footer-section">
              <h4>Company</h4>
              <Link href="#">About</Link>
              <Link href="#">Blog</Link>
              <Link href="#">Careers</Link>
              <Link href="#">Brand</Link>
            </div>
            
            <div className="footer-section">
              <h4>Resources</h4>
              <Link href="#">Community</Link>
              <Link href="#">Contact</Link>
              <Link href="#">Docs</Link>
              <Link href="#">Help</Link>
            </div>
            
            <div className="footer-section">
              <h4>Connect</h4>
              <Link href="#">Twitter</Link>
              <Link href="#">GitHub</Link>
              <Link href="#">Discord</Link>
              <Link href="#">YouTube</Link>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 Linear - Test Recreation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}