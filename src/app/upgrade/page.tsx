'use client'

import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

function UpgradePageContent() {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [trialExpired, setTrialExpired] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check for discount code in URL
  const discountCode = searchParams.get('discount');
  const hasDiscount = discountCode === 'LASTCHANCE10';
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/auth/login');
          return;
        }
        
        // Check trial/payment status
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('email, full_name, payment_status, trial_expires_at')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          setLoading(false);
          return;
        }
        
        if (profile) {
          setUserEmail(profile.email);
          setUserName(profile.full_name || 'daar');
          
          // If already paid, redirect to app
          if (profile.payment_status === 'paid') {
            router.push('/app');
            return;
          }
          
          // Check trial status
          if (profile.payment_status === 'trial' && profile.trial_expires_at) {
            const trialExpiry = new Date(profile.trial_expires_at);
            const now = new Date();
            const msPerDay = 24 * 60 * 60 * 1000;
            const daysRemaining = Math.ceil((trialExpiry.getTime() - now.getTime()) / msPerDay);
            
            if (daysRemaining > 0) {
              setDaysLeft(daysRemaining);
              setTrialExpired(false);
            } else {
              setTrialExpired(true);
            }
          }
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [router]);
  
  const handleUpgrade = () => {
    // Build PlugAndPay checkout URL with email pre-filled
    let checkoutUrl = `https://pay.baasoverjetijd.be/checkout/minddumper`;
    
    if (userEmail) {
      checkoutUrl += `?email=${encodeURIComponent(userEmail)}`;
    }
    
    // Add discount parameter if available
    if (hasDiscount) {
      checkoutUrl += userEmail ? '&discount=LASTCHANCE10' : '?discount=LASTCHANCE10';
    }
    
    console.log('🛒 Redirecting to checkout:', checkoutUrl);
    window.location.href = checkoutUrl;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center">
          {/* Header based on trial status */}
          {trialExpired ? (
            <>
              <div className="mb-6">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-4xl">⏰</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Je trial is verlopen
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                Hallo {userName}! Je 14-dagen trial is afgelopen.<br />
                Upgrade nu om door te gaan met MindDumper.
              </p>
            </>
          ) : daysLeft !== null ? (
            <>
              <div className="mb-6">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-4xl">⚠️</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nog {daysLeft} {daysLeft === 1 ? 'dag' : 'dagen'} trial
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                Hallo {userName}! Je trial loopt over {daysLeft} {daysLeft === 1 ? 'dag' : 'dagen'} af.<br />
                Upgrade nu om je brain dumps te behouden.
              </p>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-4xl">🧠</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Upgrade naar MindDumper Pro
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                Krijg levenslange toegang tot alle features
              </p>
            </>
          )}
          
          {/* Discount banner */}
          {hasDiscount && (
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl p-6 mb-8 transform -rotate-1">
              <h2 className="text-2xl font-bold mb-2">🎉 Speciale Korting!</h2>
              <p className="text-lg mb-2">10% korting met code <span className="font-mono bg-white bg-opacity-20 px-2 py-1 rounded">LASTCHANCE10</span></p>
              <p className="text-sm opacity-90">Normale prijs: €49 → <span className="line-through">€49</span> <span className="font-bold">€44,10</span></p>
            </div>
          )}
          
          {/* Features overview */}
          <div className="bg-blue-50 rounded-xl p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Wat je krijgt met MindDumper Pro:
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Levenslange toegang</h3>
                  <p className="text-sm text-gray-600">Eenmalige betaling, voor altijd toegang</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Onbeperkt brain dumps</h3>
                  <p className="text-sm text-gray-600">Dump zoveel gedachten als je wilt</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Volledige geschiedenis</h3>
                  <p className="text-sm text-gray-600">Al je brain dumps blijven bewaard</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Smart triggers</h3>
                  <p className="text-sm text-gray-600">Automatische organisatie van je gedachten</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Priority support</h3>
                  <p className="text-sm text-gray-600">Directe hulp wanneer je die nodig hebt</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Toekomstige updates</h3>
                  <p className="text-sm text-gray-600">Gratis toegang tot alle nieuwe features</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Button */}
          <button
            onClick={handleUpgrade}
            className="bg-blue-600 text-white text-xl py-4 px-8 md:px-12 rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-lg"
          >
            {hasDiscount ? 'Upgrade Nu voor €44,10 →' : 'Upgrade Nu voor €49 →'}
          </button>
          
          <p className="mt-4 text-sm text-gray-500">
            Eenmalige betaling • Geen abonnement • Direct toegang
          </p>
          
          {/* Social proof / testimonial */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <blockquote className="text-gray-700 italic mb-4">
              &quot;MindDumper heeft mijn mentale rust enorm verbeterd. De €49 is het beste wat ik ooit heb uitgegeven aan mijn welzijn. Ik gebruik het dagelijks om mijn hoofd leeg te maken.&quot;
            </blockquote>
            <cite className="text-sm text-gray-600 font-medium">- Tevreden MindDumper gebruiker</cite>
          </div>
          
          {/* What happens after trial */}
          {(trialExpired || daysLeft !== null) && (
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-800 mb-3">
                {trialExpired ? '⚠️ Je trial is verlopen' : `⏰ Over ${daysLeft} ${daysLeft === 1 ? 'dag' : 'dagen'} verlopen`}
              </h3>
              <div className="text-left text-sm text-yellow-700 space-y-2">
                {trialExpired ? (
                  <p>Je hebt geen toegang meer tot MindDumper. Je account en brain dump geschiedenis blijven wel bewaard voor als je later upgrade.</p>
                ) : (
                  <>
                    <p><strong>Wat gebeurt er als je niet upgrade:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Je verliest toegang tot de MindDumper app</li>
                      <li>Je brain dump geschiedenis wordt gepauzeerd</li>
                      <li>Je account blijft bestaan (upgrade wanneer je wilt)</li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}
          
          {/* Alternative options */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Andere opties:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="/app" 
                className="text-sm text-blue-600 hover:underline"
              >
                {trialExpired ? '← Terug naar app (geen toegang)' : '← Terug naar app'}
              </a>
              <span className="hidden sm:inline text-gray-300">|</span>
              <a 
                href="/auth/logout" 
                className="text-sm text-gray-500 hover:underline"
              >
                Uitloggen
              </a>
              <span className="hidden sm:inline text-gray-300">|</span>
              <a 
                href="/contact" 
                className="text-sm text-gray-500 hover:underline"
              >
                Hulp nodig?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <UpgradePageContent />
    </Suspense>
  );
}