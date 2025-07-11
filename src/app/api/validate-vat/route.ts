import { NextRequest, NextResponse } from 'next/server'

// EU VIES VAT validation service
async function validateEUVat(vatNumber: string): Promise<boolean> {
  try {
    // Clean VAT number (remove spaces, convert to uppercase)
    const cleanVat = vatNumber.replace(/[\s-]/g, '').toUpperCase()
    
    // Extract country code and number
    if (cleanVat.length < 4) return false
    
    const countryCode = cleanVat.substring(0, 2)
    const number = cleanVat.substring(2)
    
    // EU country codes that support VIES
    const euCountries = [
      'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'EL', 'ES',
      'FI', 'FR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT',
      'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'
    ]
    
    if (!euCountries.includes(countryCode)) {
      // Non-EU VAT numbers - basic format validation only
      return cleanVat.length >= 8 && cleanVat.length <= 15
    }

    // For EU countries, use VIES validation
    const viesUrl = 'http://ec.europa.eu/taxation_customs/vies/services/checkVatService'
    
    const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ec.europa.eu:taxud:vies:services:checkVat:types">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:checkVat>
         <urn:countryCode>${countryCode}</urn:countryCode>
         <urn:vatNumber>${number}</urn:vatNumber>
      </urn:checkVat>
   </soapenv:Body>
</soapenv:Envelope>`

    const response = await fetch(viesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': ''
      },
      body: soapEnvelope
    })

    const xmlText = await response.text()
    
    // Parse XML response - look for valid="true"
    return xmlText.includes('<valid>true</valid>')
    
  } catch (error) {
    console.error('VAT validation error:', error)
    // If VIES is down, do basic format validation
    const cleanVat = vatNumber.replace(/[\s-]/g, '').toUpperCase()
    return cleanVat.length >= 8 && cleanVat.length <= 15
  }
}

export async function POST(req: NextRequest) {
  try {
    const { vatNumber } = await req.json()

    if (!vatNumber || typeof vatNumber !== 'string') {
      return NextResponse.json({ valid: false, error: 'Invalid VAT number' })
    }

    const isValid = await validateEUVat(vatNumber)

    return NextResponse.json({ 
      valid: isValid,
      vatNumber: vatNumber.replace(/[\s-]/g, '').toUpperCase()
    })

  } catch (error) {
    console.error('VAT validation API error:', error)
    return NextResponse.json({ 
      valid: false, 
      error: 'Validation service temporarily unavailable' 
    }, { status: 500 })
  }
}