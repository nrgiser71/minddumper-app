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
    
    if (!element) {
      console.warn(`Tour step ${currentStep}: Element not found for selector "${step.target}"`)
      return
    }

    setSpotlightElement(element)

    // Scroll element into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
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
      {/* Simple dark overlay */}
      {isActive && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 pointer-events-none" />
      )}

      {/* Highlight target element */}
      {isActive && spotlightElement && (
        <div
          className="fixed border-4 border-blue-500 rounded-lg pointer-events-none z-[55]"
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
          className="fixed z-[60] pointer-events-auto top-4 left-4 right-4"
        >
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 sm:p-6 max-w-md mx-auto">
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