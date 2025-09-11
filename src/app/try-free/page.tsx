'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TryFreePage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('🚀 Submitting trial signup...');
      
      const response = await fetch('/api/auth/start-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim(), 
          fullName: fullName.trim() 
        })
      });
      
      const data = await response.json();
      console.log('📥 Trial signup response:', data);
      
      if (!response.ok) {
        setError(data.error || 'Er ging iets mis');
        return;
      }
      
      // Success!
      setSuccess(true);
      
      // Auto-login with magic link if available
      if (data.loginUrl) {
        console.log('🔗 Redirecting to magic link...');
        setTimeout(() => {
          window.location.href = data.loginUrl;
        }, 2000); // Show success message first
      } else {
        // Fallback: redirect to login with message
        console.log('↩️ Fallback: redirecting to login...');
        setTimeout(() => {
          router.push('/auth/login?trial=started');
        }, 3000);
      }
      
    } catch (err) {
      console.error('❌ Trial signup error:', err);
      setError('Verbindingsfout, probeer het opnieuw');
    } finally {
      setLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              🎉 Trial Gestart!
            </h1>
            <p className="text-gray-600 text-lg">
              Je 14-dagen gratis trial is succesvol aangemaakt.
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">Wat gebeurt er nu?</h3>
            <div className="text-left text-sm text-green-700 space-y-2">
              <div className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">1.</span>
                <span>Je wordt automatisch ingelogd</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">2.</span>
                <span>Check je email voor een welkomstbericht</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">3.</span>
                <span>Start je eerste brain dump!</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            Je wordt doorgestuurd...
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">🧠</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Start je 14-dagen gratis trial
          </h1>
          <p className="text-gray-600">
            Geen creditcard nodig • Volledige toegang • Stopt automatisch
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Je naam
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Jan Jansen"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email adres
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="jan@example.com"
              disabled={loading}
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Bezig...
              </>
            ) : (
              'Start Gratis Trial →'
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">Wat krijg je met je trial:</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>14 dagen volledige toegang</strong> - Alle premium features beschikbaar</span>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Onbeperkt brain dumps</strong> - Dump zoveel gedachten als je wilt</span>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Smart organisatie</strong> - Automatische triggers voor je gedachten</span>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Geen automatische verlenging</strong> - Trial stopt vanzelf na 14 dagen</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Door te starten ga je akkoord met onze{' '}
            <a href="/terms" className="text-blue-600 hover:underline">voorwaarden</a>
            {' '}en{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">privacybeleid</a>
          </p>
        </div>
        
        <div className="mt-6 text-center border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600">
            Heb je al een account?{' '}
            <a href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Log hier in →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}