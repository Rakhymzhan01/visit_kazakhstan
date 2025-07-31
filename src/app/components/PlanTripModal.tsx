'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

interface PlanTripModalProps {
  isOpen: boolean
  onClose: () => void
}

const PlanTripModal: React.FC<PlanTripModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  if (!isOpen) return null

  const questions = [
    {
      question: "What type of experience interests you most?",
      options: [
        "Cultural & Historical Sites",
        "Nature & Adventure",
        "City Life & Modern Attractions",
        "Traditional Experiences"
      ]
    },
    {
      question: "How long is your ideal trip?",
      options: [
        "Weekend (2-3 days)",
        "Short trip (4-7 days)", 
        "Extended stay (1-2 weeks)",
        "Long journey (2+ weeks)"
      ]
    },
    {
      question: "What's your travel style?",
      options: [
        "Budget-friendly",
        "Comfortable mid-range",
        "Luxury experience",
        "Mix of budget and splurge"
      ]
    }
  ]

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentStep]: answer })
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setAnswers({})
  }

  const isQuizComplete = Object.keys(answers).length === questions.length

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Modal Content */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan Your Trip</h2>
          <p className="text-gray-600 mb-6">
            Tell us about your preferences to get personalized recommendations
          </p>

          {!isQuizComplete ? (
            <>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Question {currentStep + 1} of {questions.length}</span>
                  <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#009CBC] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Question */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {questions[currentStep].question}
                </h3>
                <div className="space-y-3">
                  {questions[currentStep].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-[#009CBC] hover:bg-blue-50 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Quiz Complete */
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Perfect!</h3>
                <p className="text-gray-600">
                  Based on your preferences, we'll create a personalized itinerary for your Kazakhstan adventure.
                </p>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-[#009CBC] hover:bg-[#007a9a] text-white py-3 px-4 rounded-lg font-medium transition-colors">
                  Get My Itinerary
                </button>
                <button 
                  onClick={handleReset}
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlanTripModal