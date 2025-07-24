'use client'

import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link href="/landing" className="back-link">← Back to MindDumper</Link>
        
        <h1>Contact & Support</h1>
        <p className="subtitle">We&apos;re here to help you get the most out of MindDumper</p>

        <section>
          <h2>🚀 Quick Support</h2>
          <p>Need help right away? Here are the fastest ways to get assistance:</p>
          
          <div className="support-grid">
            <div className="support-card primary">
              <h3>📧 Email Support</h3>
              <p><strong>support@minddumper.com</strong></p>
              <p>Response time: Within 24 hours</p>
              <p>Best for: Technical issues, account problems, general questions</p>
            </div>
            
            <div className="support-card">
              <h3>💰 Refunds</h3>
              <p><strong>support@minddumper.com</strong></p>
              <p>Subject: &quot;Refund Request&quot;</p>
              <p>We honor our 30-day money-back guarantee</p>
            </div>
          </div>
        </section>

        <section>
          <h2>🔧 Common Issues & Solutions</h2>
          
          <div className="faq-item">
            <h3>🔐 Can&apos;t log in to your account?</h3>
            <div className="solution">
              <p><strong>Try this first:</strong></p>
              <ul>
                <li>Check if you&apos;re using the correct email address</li>
                <li>Make sure you purchased MindDumper (check your email receipt)</li>
                <li>Clear your browser cache and cookies</li>
                <li>Try a different browser or incognito mode</li>
              </ul>
              <p><strong>Still stuck?</strong> Email us with your purchase email and we&apos;ll help immediately.</p>
            </div>
          </div>

          <div className="faq-item">
            <h3>📱 MindDumper not working on your device?</h3>
            <div className="solution">
              <p><strong>Supported devices:</strong></p>
              <ul>
                <li>Desktop: Chrome, Firefox, Safari, Edge (latest versions)</li>
                <li>Mobile: iOS Safari, Android Chrome</li>
                <li>Tablets: iPad Safari, Android Chrome</li>
              </ul>
              <p><strong>Issues?</strong> Tell us your device and browser, we&apos;ll help optimize your experience.</p>
            </div>
          </div>

          <div className="faq-item">
            <h3>📤 Export not working?</h3>
            <div className="solution">
              <p><strong>Quick fixes:</strong></p>
              <ul>
                <li>Make sure you have brain dump content to export</li>
                <li>Check your browser&apos;s download settings</li>
                <li>Try exporting in a different format (CSV vs. text)</li>
                <li>Disable browser pop-up blockers for MindDumper</li>
              </ul>
              <p><strong>Need integration help?</strong> We can guide you through connecting to Notion, Todoist, or Asana.</p>
            </div>
          </div>

          <div className="faq-item">
            <h3>🌍 Trigger words not in your language?</h3>
            <div className="solution">
              <p><strong>Currently supported:</strong> English, Dutch, German, French, Spanish</p>
              <p><strong>Want another language?</strong> Email us! We&apos;re always expanding our language support based on user requests.</p>
              <p><strong>Custom triggers:</strong> You can add your own industry-specific trigger words in any language.</p>
            </div>
          </div>
        </section>

        <section>
          <h2>📋 When You Contact Us</h2>
          <p>To help us assist you faster, please include:</p>
          
          <div className="info-checklist">
            <div className="checklist-item">
              <span className="check">✅</span>
              <span>Your email address used for purchase</span>
            </div>
            <div className="checklist-item">
              <span className="check">✅</span>
              <span>What you were trying to do when the issue occurred</span>
            </div>
            <div className="checklist-item">
              <span className="check">✅</span>
              <span>Your device type and browser (e.g., &quot;iPhone with Safari&quot;)</span>
            </div>
            <div className="checklist-item">
              <span className="check">✅</span>
              <span>Any error messages you saw</span>
            </div>
            <div className="checklist-item">
              <span className="check">✅</span>
              <span>Screenshots if helpful</span>
            </div>
          </div>
        </section>

        <section>
          <h2>💡 Feature Requests</h2>
          <p>Have an idea to make MindDumper even better? We love hearing from users!</p>
          
          <div className="feature-box">
            <h3>🎯 What We&apos;re Working On</h3>
            <ul>
              <li>More export integrations (ClickUp, Monday.com)</li>
              <li>Advanced filtering and search in brain dumps</li>
              <li>Team collaboration features</li>
              <li>Mobile app for iOS and Android</li>
            </ul>
            <p><strong>Your suggestion not listed?</strong> Email us at support@minddumper.com with &quot;Feature Request&quot; in the subject line.</p>
          </div>
        </section>

        <section>
          <h2>🏢 Business & Legal</h2>
          
          <div className="business-info">
            <div className="business-card">
              <h3>Company Information</h3>
              <p><strong>JBS BV</strong><br />
              Registered in the Netherlands<br />
              Operating MindDumper since 2024</p>
            </div>
            
            <div className="business-card">
              <h3>Specialized Contacts</h3>
              <p><strong>Privacy concerns:</strong> privacy@minddumper.com<br />
              <strong>Legal matters:</strong> legal@minddumper.com<br />
              <strong>Partnerships:</strong> business@minddumper.com</p>
            </div>
          </div>
        </section>

        <section>
          <h2>⏰ Response Times</h2>
          <div className="response-times">
            <div className="time-card">
              <h3>🔥 Urgent Issues</h3>
              <p>Can&apos;t access your account, payment problems</p>
              <p><strong>Response: Within 6 hours</strong></p>
            </div>
            
            <div className="time-card">
              <h3>🛠️ Technical Support</h3>
              <p>Feature questions, export issues, bugs</p>
              <p><strong>Response: Within 24 hours</strong></p>
            </div>
            
            <div className="time-card">
              <h3>💭 General Inquiries</h3>
              <p>Feature requests, feedback, suggestions</p>
              <p><strong>Response: Within 48 hours</strong></p>
            </div>
          </div>
        </section>

        <section>
          <h2>🎯 Our Support Promise</h2>
          <div className="promise-box">
            <p>We&apos;re not a faceless corporation. MindDumper was built by someone who uses it daily and genuinely cares about helping you succeed.</p>
            <p>Every email is read by a human who understands the product inside and out. We&apos;ll work with you until your issue is resolved or find an alternative solution.</p>
            <p><strong>Your success with MindDumper is our success.</strong></p>
          </div>
        </section>
      </div>
      
      <style jsx>{`
        .legal-page {
          min-height: 100vh;
          background-color: #fafafa;
          padding: 2rem 1rem;
        }
        
        .legal-container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          padding: 3rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .back-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
          margin-bottom: 2rem;
          display: inline-block;
        }
        
        .back-link:hover {
          text-decoration: underline;
        }
        
        h1 {
          color: #1f2937;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        
        .subtitle {
          color: #6b7280;
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }
        
        section {
          margin-bottom: 3rem;
        }
        
        h2 {
          color: #374151;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }
        
        h3 {
          color: #4b5563;
          font-size: 1.2rem;
          margin: 1rem 0 0.75rem 0;
        }
        
        p {
          color: #4b5563;
          line-height: 1.7;
          margin-bottom: 1rem;
        }
        
        ul {
          color: #4b5563;
          line-height: 1.7;
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        
        li {
          margin-bottom: 0.5rem;
        }
        
        .support-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin: 2rem 0;
        }
        
        @media (max-width: 768px) {
          .support-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .support-card {
          padding: 2rem;
          border-radius: 8px;
          border: 2px solid #e5e7eb;
          background: #f9fafb;
        }
        
        .support-card.primary {
          border-color: #2563eb;
          background: #dbeafe;
        }
        
        .support-card h3 {
          margin-top: 0;
          color: #1f2937;
        }
        
        .faq-item {
          margin-bottom: 2rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .faq-item h3 {
          background: #f9fafb;
          padding: 1.5rem;
          margin: 0;
          color: #1f2937;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .solution {
          padding: 1.5rem;
        }
        
        .solution p {
          margin-bottom: 1rem;
        }
        
        .info-checklist {
          background: #f0fdf4;
          padding: 2rem;
          border-radius: 8px;
          border-left: 4px solid #22c55e;
        }
        
        .checklist-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
          color: #166534;
        }
        
        .check {
          margin-right: 1rem;
          font-size: 1.1rem;
        }
        
        .feature-box {
          background: #fef3c7;
          padding: 2rem;
          border-radius: 8px;
          border-left: 4px solid #f59e0b;
        }
        
        .feature-box h3 {
          color: #92400e;
          margin-top: 0;
        }
        
        .feature-box p, .feature-box ul {
          color: #92400e;
        }
        
        .business-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        @media (max-width: 768px) {
          .business-info {
            grid-template-columns: 1fr;
          }
        }
        
        .business-card {
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        
        .business-card h3 {
          margin-top: 0;
          color: #1f2937;
        }
        
        .response-times {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .time-card {
          padding: 1.5rem;
          border-radius: 8px;
          border: 2px solid #e5e7eb;
          text-align: center;
        }
        
        .time-card h3 {
          margin-top: 0;
          color: #1f2937;
        }
        
        .promise-box {
          background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%);
          padding: 2rem;
          border-radius: 8px;
          border-left: 4px solid #2563eb;
        }
        
        .promise-box p {
          color: #1e40af;
          margin-bottom: 1rem;
        }
        
        .promise-box p:last-child {
          margin-bottom: 0;
        }
        
        strong {
          color: #1f2937;
        }
      `}</style>
    </div>
  )
}