'use client'

import Link from 'next/link'

export default function RefundPage() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link href="/landing" className="back-link">← Back to MindDumper</Link>
        
        <h1>Refund Policy</h1>
        <p className="last-updated">Last updated: July 24, 2025</p>

        <section>
          <h2>30-Day Money-Back Guarantee</h2>
          <p>We stand behind MindDumper with a <strong>30-day money-back guarantee</strong>. If you&apos;re not completely satisfied with your purchase, we&apos;ll refund your money, no questions asked.</p>
          
          <div className="highlight-box">
            <h3>🛡️ Full Refund Within 30 Days</h3>
            <p>You have 30 full days from your purchase date to request a complete refund of your €49 lifetime license fee.</p>
          </div>
        </section>

        <section>
          <h2>Reasons for Refund</h2>
          <p>You can request a refund for any reason, including:</p>
          <ul>
            <li><strong>Not satisfied</strong> - The tool doesn&apos;t meet your expectations</li>
            <li><strong>Technical issues</strong> - Problems we cannot resolve within the 30-day period</li>
            <li><strong>Doesn&apos;t work as described</strong> - Features don&apos;t function as advertised</li>
            <li><strong>Changed your mind</strong> - You simply decided you don&apos;t need the tool</li>
            <li><strong>Found an alternative</strong> - You discovered a better solution for your needs</li>
            <li><strong>Financial reasons</strong> - You need to reconsider the purchase</li>
          </ul>
          <p><em>No explanation required - your satisfaction is our priority.</em></p>
        </section>

        <section>
          <h2>How to Request a Refund</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Send an Email</h3>
                <p>Email us at <strong>support@minddumper.com</strong> with the subject line &quot;Refund Request&quot;</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Include Your Details</h3>
                <p>Provide your email address used for purchase and any order confirmation details you have</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>We Process Your Refund</h3>
                <p>We&apos;ll confirm your refund within 24 hours and process it back to your original payment method</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2>Refund Processing Time</h2>
          <ul>
            <li><strong>Confirmation:</strong> Within 24 hours of your request</li>
            <li><strong>Processing:</strong> 1-2 business days to initiate the refund</li>
            <li><strong>Your bank/card:</strong> 3-5 business days for the money to appear in your account</li>
          </ul>
          <p>Total time: Usually 5-7 business days from request to money in your account.</p>
        </section>

        <section>
          <h2>What Happens After Refund</h2>
          <p>Once your refund is processed:</p>
          <ul>
            <li>Your MindDumper account will be deactivated</li>
            <li>You&apos;ll lose access to all premium features</li>
            <li>Your brain dump data will be preserved for 30 days in case you change your mind</li>
            <li>You can export your data before the refund if you want to keep it</li>
          </ul>
        </section>

        <section>
          <h2>Partial Refunds</h2>
          <p>We don&apos;t offer partial refunds because MindDumper is sold as a complete lifetime package. However:</p>
          <ul>
            <li>You get a <strong>full refund</strong> within 30 days</li>
            <li>After 30 days, no refunds are available (this is clearly stated at purchase)</li>
            <li>The lifetime license includes all future updates at no extra cost</li>
          </ul>
        </section>

        <section>
          <h2>Disputes and Chargebacks</h2>
          <p>Before initiating a chargeback with your bank or credit card company, please contact us directly. We prefer to resolve issues through direct communication and will work with you to find a solution.</p>
          
          <p>If you do initiate a chargeback:</p>
          <ul>
            <li>Your account will be immediately suspended</li>
            <li>We&apos;ll provide all documentation to your financial institution</li>
            <li>This may affect your ability to purchase from us in the future</li>
          </ul>
        </section>

        <section>
          <h2>Exceptions</h2>
          <p>This refund policy applies to all standard purchases. The only exceptions are:</p>
          <ul>
            <li>Purchases made more than 30 days ago</li>
            <li>Accounts terminated for violating our Terms of Service</li>
            <li>Fraudulent or disputed transactions</li>
          </ul>
        </section>

        <section>
          <h2>Our Commitment</h2>
          <div className="commitment-box">
            <p>We built MindDumper to genuinely help people clear their minds and be more productive. If it doesn&apos;t work for you, we don&apos;t want your money.</p>
            <p>This refund policy isn&apos;t just a legal requirement - it&apos;s our promise that we stand behind our product and your satisfaction.</p>
          </div>
        </section>

        <section>
          <h2>Questions About Refunds</h2>
          <p>If you have any questions about our refund policy or need help with your purchase:</p>
          <div className="contact-info">
            <p><strong>Email:</strong> support@minddumper.com<br />
            <strong>Subject:</strong> Refund Question or Refund Request<br />
            <strong>Response time:</strong> Within 24 hours</p>
          </div>
          
          <p>We&apos;re here to help and want to make sure you have a positive experience with MindDumper, whether you keep it or request a refund.</p>
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
        
        .highlight-box {
          background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%);
          padding: 2rem;
          border-radius: 8px;
          border-left: 4px solid #2563eb;
          margin: 1.5rem 0;
        }
        
        .highlight-box h3 {
          color: #1e40af;
          margin-top: 0;
        }
        
        .process-steps {
          margin: 2rem 0;
        }
        
        .step {
          display: flex;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 8px;
        }
        
        .step-number {
          background: #2563eb;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 1rem;
          flex-shrink: 0;
        }
        
        .step-content h3 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }
        
        .step-content p {
          margin: 0;
        }
        
        .commitment-box {
          background: #f0fdf4;
          padding: 2rem;
          border-radius: 8px;
          border-left: 4px solid #22c55e;
          margin: 1.5rem 0;
        }
        
        .commitment-box p {
          color: #166534;
          margin-bottom: 1rem;
        }
        
        .commitment-box p:last-child {
          margin-bottom: 0;
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