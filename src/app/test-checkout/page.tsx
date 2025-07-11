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
  
  // Personal Information
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  
  // Business Information
  const [companyName, setCompanyName] = useState('')
  const [vatNumber, setVatNumber] = useState('')
  
  // Billing Address
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('NL')
  const [state, setState] = useState('')
  
  // Preferences
  const [newsletter, setNewsletter] = useState(false)

  const handleCheckout = async () => {
    // Validation
    if (!email) {
      showToast('Please enter your email address', 'error')
      return
    }

    if (!firstName || !lastName) {
      showToast('Please enter your full name', 'error')
      return
    }

    if (!addressLine1 || !city || !postalCode || !country) {
      showToast('Please fill in your complete address', 'error')
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
          // Personal Information
          firstName,
          lastName,
          phone,
          // Business Information
          companyName: customerType === 'business' ? companyName : undefined,
          vatNumber: customerType === 'business' ? vatNumber : undefined,
          // Billing Address
          address: {
            line1: addressLine1,
            line2: addressLine2,
            city,
            postal_code: postalCode,
            country,
            state: state || undefined
          },
          // Preferences
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number (optional)</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+31 6 12345678"
              />
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

            <div className="form-section">
              <h3>Billing Address</h3>
              
              <div className="form-group">
                <label htmlFor="addressLine1">Street Address *</label>
                <input
                  type="text"
                  id="addressLine1"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="addressLine2">Apartment, suite, etc. (optional)</label>
                <input
                  type="text"
                  id="addressLine2"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Apt 4B"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Amsterdam"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code *</label>
                  <input
                    type="text"
                    id="postalCode"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="1012 AB"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="country">Country *</label>
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  >
                    <option value="NL">Netherlands</option>
                    <option value="BE">Belgium</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="ES">Spain</option>
                    <option value="IT">Italy</option>
                    <option value="AT">Austria</option>
                    <option value="CH">Switzerland</option>
                    <option value="GB">United Kingdom</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="SE">Sweden</option>
                    <option value="NO">Norway</option>
                    <option value="DK">Denmark</option>
                    <option value="FI">Finland</option>
                    <option value="PL">Poland</option>
                    <option value="PT">Portugal</option>
                    <option value="IE">Ireland</option>
                    <option value="LU">Luxembourg</option>
                  </select>
                </div>
                {(country === 'US' || country === 'CA' || country === 'AU') && (
                  <div className="form-group">
                    <label htmlFor="state">State/Province *</label>
                    <input
                      type="text"
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="California"
                      required
                    />
                  </div>
                )}
              </div>
            </div>

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