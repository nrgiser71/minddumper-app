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
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to MindDumper!',
    content: "Let's give you a quick tour of the app so you can start clearing your mind effectively.",
    target: '[data-tour="start-brain-dump"]',
    position: 'bottom'
  },
  {
    id: 'language',
    title: 'Language Selection',
    content: 'Here you can select your preferred language for brain dumps. Choose the language you think in!',
    target: '[data-tour="language-buttons"]',
    position: 'bottom'
  },
  {
    id: 'start-brain-dump',
    title: 'Start Your Brain Dump',
    content: 'This is the main button - click here to start clearing your mind with guided trigger words.',
    target: '[data-tour="start-brain-dump"]',
    position: 'top'
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
    title: 'View Your Progress',
    content: 'View all your previous brain dumps here to track your mental clarity journey over time.',
    target: '[data-tour="history"]',
    position: 'bottom'
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    content: 'Perfect! You now know how to use MindDumper. Ready to start dumping those thoughts and clearing your mind?',
    target: '.main-container',
    position: 'bottom'
  }
]

export function OnboardingTour({ isActive, onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [spotlightElement, setSpotlightElement] = useState<Element | null>(null)

  useEffect(() => {
    if (!isActive) return

    const step = TOUR_STEPS[currentStep]
    const element = document.querySelector(step.target)
    setSpotlightElement(element)

    // Scroll element into view
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentStep, isActive])

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTour = () => {
    onSkip()
  }

  if (!isActive) return null

  const step = TOUR_STEPS[currentStep]
  const isLastStep = currentStep === TOUR_STEPS.length - 1

  return (
    <TooltipProvider>
      {/* Dark overlay - only show when tour is active */}
      {isActive && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 pointer-events-none">
          {/* Spotlight effect */}
          {spotlightElement && (
            <div
              className="absolute bg-white rounded-lg shadow-2xl pointer-events-none"
              style={{
                top: spotlightElement.getBoundingClientRect().top - 8,
                left: spotlightElement.getBoundingClientRect().left - 8,
                width: spotlightElement.getBoundingClientRect().width + 16,
                height: spotlightElement.getBoundingClientRect().height + 16,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.8)',
                zIndex: 51
              }}
            />
          )}
        </div>
      )}

      {/* Tour tooltip - only show when tour is active */}
      {isActive && spotlightElement && (
        <div
          className="fixed z-[60] pointer-events-auto"
          style={{
            top: step.position === 'bottom' 
              ? Math.min(spotlightElement.getBoundingClientRect().bottom + 16, window.innerHeight - 300)
              : step.position === 'top'
              ? Math.max(spotlightElement.getBoundingClientRect().top - 200, 20)
              : spotlightElement.getBoundingClientRect().top,
            left: Math.min(
              Math.max(
                step.position === 'right'
                  ? spotlightElement.getBoundingClientRect().right + 16
                  : step.position === 'left'
                  ? spotlightElement.getBoundingClientRect().left - 320
                  : spotlightElement.getBoundingClientRect().left + (spotlightElement.getBoundingClientRect().width / 2) - 192,
                16
              ),
              window.innerWidth - 400
            ),
            transform: step.position === 'top' ? 'translateY(-100%)' : 'none'
          }}
        >
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 sm:p-6 w-80 sm:w-96 max-w-[calc(100vw-32px)]">
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