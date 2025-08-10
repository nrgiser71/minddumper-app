'use client'

import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link href="/landing" className="back-link">← Back to MindDumper</Link>
        
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: August 10, 2025</p>

        <section>
          <h2>1. Who We Are</h2>
          <p>MindDumper is operated by JBS BV, a company registered in Belgium. We provide a brain dumping tool that helps users extract and organize their thoughts and tasks.</p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <h3>Personal Information</h3>
          <ul>
            <li>Email address (for account creation and communication)</li>
            <li>Payment information (processed securely through our payment provider)</li>
            <li>Account preferences and settings</li>
          </ul>
          
          <h3>Brain Dump Content</h3>
          <ul>
            <li>Tasks, ideas, and notes you enter into MindDumper</li>
            <li>Custom trigger words you create</li>
            <li>Export history and preferences</li>
          </ul>

          <h3>Technical Information</h3>
          <ul>
            <li>IP address and browser information</li>
            <li>Usage analytics to improve our service</li>
            <li>Error logs for debugging purposes</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>Provide and maintain the MindDumper service</li>
            <li>Process payments and manage your account</li>
            <li>Send important service updates and notifications</li>
            <li>Improve our product based on usage patterns</li>
            <li>Provide customer support when requested</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Storage and Security</h2>
          <p>Your data is stored securely using industry-standard encryption:</p>
          <ul>
            <li>All data is encrypted in transit and at rest</li>
            <li>We use Supabase (hosted in EU) for secure data storage</li>
            <li>Payment processing is handled by certified payment processors</li>
            <li>Regular security audits and updates</li>
          </ul>
        </section>

        <section>
          <h2>5. Data Sharing</h2>
          <p>We never sell your personal information. We only share data when:</p>
          <ul>
            <li>You explicitly export your data to third-party services</li>
            <li>Required by law or legal process</li>
            <li>Necessary to protect our rights or safety</li>
            <li>With service providers who help operate our platform (under strict confidentiality agreements)</li>
          </ul>
        </section>

        <section>
          <h2>6. Your Rights (GDPR)</h2>
          <p>As a Belgium-based EU company, we respect your privacy rights:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Rectification:</strong> Correct inaccurate personal data</li>
            <li><strong>Erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
            <li><strong>Objection:</strong> Object to processing of your personal data</li>
          </ul>
          <p>To exercise these rights, contact us at support@minddumper.com</p>
        </section>

        <section>
          <h2>7. Data Retention</h2>
          <ul>
            <li>Account data: Retained while your account is active</li>
            <li>Brain dump content: Retained until you delete it or close your account</li>
            <li>Payment records: Retained for 7 years for tax and legal compliance</li>
            <li>Analytics data: Aggregated and anonymized after 2 years</li>
          </ul>
        </section>

        <section>
          <h2>8. Cookies and Tracking</h2>
          <p>We use minimal cookies to:</p>
          <ul>
            <li>Keep you logged in to your account</li>
            <li>Remember your preferences and settings</li>
            <li>Analyze website performance (anonymized)</li>
          </ul>
          <p>We do not use advertising cookies or third-party tracking.</p>
        </section>

        <section>
          <h2>9. International Transfers</h2>
          <p>Your data is stored within the EU. If data needs to be transferred outside the EU, we ensure adequate protection through:</p>
          <ul>
            <li>Standard Contractual Clauses</li>
            <li>Adequacy decisions by the European Commission</li>
            <li>Other appropriate safeguards under GDPR</li>
          </ul>
        </section>

        <section>
          <h2>10. Updates to This Policy</h2>
          <p>We may update this privacy policy from time to time. We will notify you of any material changes via email or through the service. Your continued use of MindDumper after changes become effective constitutes acceptance of the new policy.</p>
        </section>

        <section>
          <h2>11. Contact Us</h2>
          <p>If you have questions about this privacy policy or your personal data:</p>
          <div className="contact-info">
            <p><strong>JBS BV</strong><br />
            For general support: support@minddumper.com</p>
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
          max-width: 800px;
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
        
        .last-updated {
          color: #6b7280;
          margin-bottom: 2rem;
          font-style: italic;
        }
        
        section {
          margin-bottom: 2.5rem;
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
          margin: 1.5rem 0 0.75rem 0;
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
        
        .contact-info {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 6px;
          border-left: 4px solid #2563eb;
        }
        
        strong {
          color: #1f2937;
        }
      `}</style>
    </div>
  )
}