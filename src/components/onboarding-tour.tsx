'use client'

import React, { useState, useEffect } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface TourStep {
  id: string
  title: string
  content: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

interface OnboardingTourProps {
  isActive: boolean
  onComplete: () => void
  onSkip: () => void
  tourType?: 'main' | 'braindump' | 'config'
}

const MAIN_TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to MindDumper!',
    content: "Let's give you a quick tour of the app so you can start clearing your mind effectively.",
    target: 'none',
    position: 'bottom'
  },
  {
    id: 'start-brain-dump',
    title: 'Start Your Brain Dump',
    content: 'Click this button to start your brain dump. If this is your first time, you can choose your preferred language - pick the language you think in!',
    target: '[data-tour="start-brain-dump"]',
    position: 'bottom'
  },
  {
    id: 'user-email',
    title: 'Your Account',
    content: 'Your account email is displayed here for reference, so you know which account you\'re using.',
    target: '.user-info',
    position: 'bottom'
  },
  {
    id: 'configuration',
    title: 'Customize Settings',
    content: 'Access settings here to customize your trigger words and personalize your brain dump experience.',
    target: '[data-tour="configuration"]',
    position: 'bottom'
  },
  {
    id: 'history',
    title: 'View Your History',
    content: 'View all your previous brain dumps here to track your mental clarity journey over time.',
    target: '[data-tour="history"]',
    position: 'bottom'
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    content: 'Perfect! You now know how to use MindDumper. Ready to start dumping those thoughts and clearing your mind?',
    target: 'none',
    position: 'bottom'
  }
]

const BRAINDUMP_TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your First Brain Dump!',
    content: "Let's quickly show you how to clear your mind using trigger words and free writing.",
    target: 'none',
    position: 'bottom'
  },
  {
    id: 'trigger-words',
    title: 'Trigger Words',
    content: 'Trigger words will appear automatically to spark thoughts and memories. If ideas come to mind, type them and press Enter. No ideas? Just press Enter for the next word.',
    target: '.trigger-words-container',
    position: 'bottom'
  },
  {
    id: 'text-input',
    title: 'Write Your Thoughts',
    content: 'Type whatever comes to mind and press Enter to continue. Don\'t worry about grammar or organization - just let your thoughts flow using only your keyboard.',
    target: '.minddump-input',
    position: 'top'
  },
  {
    id: 'stop',
    title: 'Stop Your Session',
    content: 'Click stop when you\'re done to finish your brain dump session and save your progress.',
    target: '.stop-button',
    position: 'top'
  },
  {
    id: 'complete',
    title: 'That\'s It!',
    content: 'You\'re ready to start clearing your mind. Remember: there\'s no right or wrong way to brain dump.',
    target: 'none',
    position: 'bottom'
  }
]

const CONFIG_TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Settings!',
    content: "Here you can customize your trigger words and make MindDumper work perfectly for you.",
    target: 'none',
    position: 'bottom'
  },
  {
    id: 'trigger-words',
    title: 'Your Trigger Words',
    content: 'These are all available trigger words. Toggle them on/off based on what helps spark your thoughts.',
    target: '.config-trigger-words',
    position: 'bottom'
  },
  {
    id: 'custom-words',
    title: 'Add Custom Words',
    content: 'Add your own trigger words that are specific to your life, work, or interests.',
    target: '.custom-words-section',
    position: 'bottom'
  },
  {
    id: 'language',
    title: 'Language Preference',
    content: 'Choose your preferred language for trigger words. The interface stays in English.',
    target: '.language-setting',
    position: 'bottom'
  },
  {
    id: 'complete',
    title: 'Configuration Complete!',
    content: 'Your settings are personalized. You can always come back and adjust them anytime.',
    target: 'none',
    position: 'bottom'
  }
]

export function OnboardingTour({ isActive, onComplete, onSkip, tourType = 'main' }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [spotlightElement, setSpotlightElement] = useState<Element | null>(null)

  // Get the correct tour steps based on type
  const getTourSteps = () => {
    switch (tourType) {
      case 'braindump':
        return BRAINDUMP_TOUR_STEPS
      case 'config':
        return CONFIG_TOUR_STEPS
      default:
        return MAIN_TOUR_STEPS
    }
  }

  const TOUR_STEPS = getTourSteps()

  useEffect(() => {
    if (!isActive) return

    const step = TOUR_STEPS[currentStep]
    
    // Skip element selection for welcome step
    if (step.target === 'none') {
      setSpotlightElement(null)
      return
    }
    
    const element = document.querySelector(step.target)
    
    if (!element) {
      console.warn(`Tour step ${currentStep}: Element not found for selector "${step.target}"`)
      return
    }

    // First scroll the element into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    
    // Then set spotlight element after scroll completes
    setTimeout(() => {
      setSpotlightElement(element)
    }, 500) // Wait for smooth scroll to complete
  }, [currentStep, isActive])

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Reset tour state before completing
      setCurrentStep(0)
      setSpotlightElement(null)
      onComplete()
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTour = () => {
    // Reset tour state before skipping
    setCurrentStep(0)
    setSpotlightElement(null)
    onSkip()
  }

  if (!isActive) return null

  const step = TOUR_STEPS[currentStep]
  const isLastStep = currentStep === TOUR_STEPS.length - 1

  return (
    <TooltipProvider>
      {/* Highlight target element - skip for welcome step */}
      {isActive && spotlightElement && step.target !== 'none' && (
        <div
          className="fixed border-4 border-white rounded-lg pointer-events-none z-[55]"
          style={{
            top: spotlightElement.getBoundingClientRect().top - 4,
            left: spotlightElement.getBoundingClientRect().left - 4,
            width: spotlightElement.getBoundingClientRect().width + 8,
            height: spotlightElement.getBoundingClientRect().height + 8,
          }}
        />
      )}

      {/* Tour tooltip */}
      {isActive && (
        <div
          className="fixed z-[60] pointer-events-auto"
          style={{
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100vw - 32px)',
            maxWidth: '400px'
          }}
        >
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 sm:p-6 w-full">
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs sm:text-sm text-gray-500">
                Step {currentStep + 1} of {TOUR_STEPS.length}
              </div>
              <button
                onClick={skipTour}
                className="text-xs sm:text-sm text-gray-400 hover:text-gray-600 underline"
              >
                Skip tour
              </button>
            </div>

            {/* Content */}
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              {step.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              {step.content}
            </p>

            {/* Navigation buttons */}
            <div className="flex justify-between gap-3">
              <button
                onClick={previousStep}
                disabled={currentStep === 0}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex-1 sm:flex-none"
              >
                {isLastStep ? 'Get Started!' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  )
}