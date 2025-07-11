'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ToastProvider, useToast } from '@/components/toast-context'
import { ToastContainer } from '@/components/toast-container'
import '../checkout/checkout.css'

function TestCheckoutContent() {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [customerType, setCustomerType] = useState<'private' | 'business'>('private')
  const [companyName, setCompanyName] = useState('')
  const [vatNumber, setVatNumber] = useState('')
  const [newsletter, setNewsletter] = useState(false)

  const handleCheckout = async () => {
    if (!email) {
      showToast('Please enter your email address', 'error')
      return
    }

    if (customerType === 'business' && !companyName) {
      showToast('Please enter your company name', 'error')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/stripe/test-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          customerType,
          companyName: customerType === 'business' ? companyName : undefined,
          vatNumber: customerType === 'business' ? vatNumber : undefined,
          newsletter,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error) {
      console.error('Checkout error:', error)
      showToast('Failed to start checkout. Please try again.', 'error')
      setIsLoading(false)
    }
  }

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        <Link href="/" className="back-link">
          ← Back to home
        </Link>

        <div className="checkout-header">
          <h1>🧪 TEST Checkout - €0.50</h1>
          <p>Test the complete payment flow with a €0.50 charge</p>
          <div style={{background: '#fff3cd', border: '1px solid #ffeaa7', padding: '1rem', borderRadius: '8px', margin: '1rem 0'}}>
            <strong>⚠️ TEST MODE:</strong> This will charge €0.50 to test the full payment flow
          </div>
        </div>

        <div className="product-summary">
          <h3>MindDumper Test Access</h3>
          <ul>
            <li>✓ Complete payment flow test</li>
            <li>✓ Account creation test</li>
            <li>✓ Email delivery test</li>
            <li>✓ App access verification</li>
            <li>✓ All systems verification</li>
          </ul>
          <div className="price-display">
            <span className="price">€0.50</span>
            <span className="price-note">test payment</span>
          </div>
        </div>

        <div className="checkout-form">
          <div className="form-section">
            <h3>Account Information</h3>
            
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
              <p className="field-note">You&apos;ll use this to log in to MindDumper</p>
            </div>

            <div className="form-group">
              <label>Customer Type</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="customerType"
                    value="private"
                    checked={customerType === 'private'}
                    onChange={(e) => setCustomerType(e.target.value as 'private')}
                  />
                  <span>Private Individual</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="customerType"
                    value="business"
                    checked={customerType === 'business'}
                    onChange={(e) => setCustomerType(e.target.value as 'business')}
                  />
                  <span>Business</span>
                </label>
              </div>
            </div>

            {customerType === 'business' && (
              <>
                <div className="form-group">
                  <label htmlFor="companyName">Company Name *</label>
                  <input
                    type="text"
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your Company Ltd."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="vatNumber">VAT Number (optional)</label>
                  <input
                    type="text"
                    id="vatNumber"
                    value={vatNumber}
                    onChange={(e) => setVatNumber(e.target.value)}
                    placeholder="NL123456789B01"
                  />
                  <p className="field-note">EU businesses: Enter your VAT number for tax exemption</p>
                </div>
              </>
            )}

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                />
                <span>Send me tips and updates about MindDumper</span>
              </label>
            </div>
          </div>

          <div className="checkout-footer">
            <button
              className="checkout-button"
              onClick={handleCheckout}
              disabled={isLoading}
              style={{backgroundColor: '#ffa500'}}
            >
              {isLoading ? 'Processing...' : 'TEST Payment - €0.50'}
            </button>
            <p className="security-note">
              🧪 This is a test with €0.50 to verify the complete payment flow
            </p>
            <p className="terms-note">
              Test card: 4242 4242 4242 4242 (CVC: 123, Date: 12/25)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TestCheckoutPage() {
  return (
    <ToastProvider>
      <TestCheckoutContent />
      <ToastContainer />
    </ToastProvider>
  )
}