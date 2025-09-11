'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Clock, ArrowRight } from 'lucide-react';

export function TrialBanner() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkTrial = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('payment_status, trial_expires_at, is_trial_user')
          .eq('id', user.id)
          .single();
        
        if (error || !profile) {
          console.error('Error fetching trial status:', error);
          setIsLoading(false);
          return;
        }
        
        // Only show for active trial users
        if (profile.payment_status === 'trial' && profile.trial_expires_at) {
          const expiresAt = new Date(profile.trial_expires_at);
          const now = new Date();
          const msPerDay = 24 * 60 * 60 * 1000;
          const days = Math.ceil((expiresAt.getTime() - now.getTime()) / msPerDay);
          
          // Show banner in last 5 days of trial
          if (days <= 5 && days > 0) {
            setDaysLeft(days);
            setShow(true);
          }
        }
      } catch (error) {
        console.error('Error checking trial status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkTrial();
  }, []);
  
  const handleDismiss = () => {
    setDismissed(true);
    // Optionally store in localStorage to remember dismissal
    localStorage.setItem('trial-banner-dismissed', 'true');
  };
  
  const handleUpgrade = () => {
    window.location.href = '/upgrade';
  };
  
  // Don't render anything while loading or if conditions not met
  if (isLoading || !show || dismissed || daysLeft === null) {
    return null;
  }
  
  // Different styling based on urgency
  const getUrgencyStyle = () => {
    if (daysLeft === 1) {
      return {
        bg: 'bg-gradient-to-r from-red-500 to-pink-600',
        text: 'text-white',
        icon: '🚨',
        message: `Laatste dag van je trial!`
      };
    } else if (daysLeft === 2) {
      return {
        bg: 'bg-gradient-to-r from-orange-500 to-red-500',
        text: 'text-white',
        icon: '⏰',
        message: `Nog ${daysLeft} dagen van je trial`
      };
    } else {
      return {
        bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
        text: 'text-white',
        icon: '💡',
        message: `Nog ${daysLeft} dagen van je trial`
      };
    }
  };
  
  const style = getUrgencyStyle();
  
  return (
    <div className={`${style.bg} ${style.text} shadow-lg border-b sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-lg">{style.icon}</span>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                {style.message}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleUpgrade}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center space-x-2"
            >
              <span>Upgrade Nu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition duration-200"
              title="Verberg banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Extra info for last day */}
        {daysLeft === 1 && (
          <div className="mt-2 text-sm opacity-90">
            Na vandaag verlies je toegang tot MindDumper. Upgrade nu om je brain dumps te behouden!
          </div>
        )}
      </div>
    </div>
  );
}

// Alternative compact version for smaller screens
export function TrialBannerCompact() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  useEffect(() => {
    const checkTrial = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('payment_status, trial_expires_at')
          .eq('id', user.id)
          .single();
        
        if (profile?.payment_status === 'trial' && profile.trial_expires_at) {
          const expiresAt = new Date(profile.trial_expires_at);
          const now = new Date();
          const msPerDay = 24 * 60 * 60 * 1000;
          const days = Math.ceil((expiresAt.getTime() - now.getTime()) / msPerDay);
          
          if (days <= 3 && days > 0) {
            setDaysLeft(days);
            setShow(true);
          }
        }
      } catch (error) {
        console.error('Error checking trial status:', error);
      }
    };
    
    checkTrial();
  }, []);
  
  if (!show || dismissed || daysLeft === null) {
    return null;
  }
  
  return (
    <div className="bg-orange-100 border-l-4 border-orange-500 p-3 mx-4 my-2 rounded">
      <div className="flex justify-between items-center">
        <p className="text-orange-700 text-sm">
          <strong>⏰ Nog {daysLeft} {daysLeft === 1 ? 'dag' : 'dagen'} trial</strong>
        </p>
        <div className="flex items-center space-x-2">
          <a
            href="/upgrade"
            className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600 transition"
          >
            Upgrade →
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="text-orange-600 hover:text-orange-800 p-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}