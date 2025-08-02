'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { X, Users } from 'lucide-react'

interface PlanTripModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  destination: string
  tourType: string
  arrivalDate: string
  adults: number
  children: number
  name: string
  phone: string
  email: string
}

const PlanTripModal: React.FC<PlanTripModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [showContactForm, setShowContactForm] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    destination: '',
    tourType: '',
    arrivalDate: '',
    adults: 2,
    children: 1,
    name: '',
    phone: '',
    email: ''
  })

  const destinations = [
    { name: 'Astana', image: '/baiterek.jpg' },
    { name: 'Almaty', image: '/almaty.jpg' },
    { name: 'Aktau', image: '/aktau.jpg' },
    { name: 'Shymkent', image: '/shym.jpg' },
    { name: 'Taraz', image: '/city.png' },
    { name: 'Oskemen', image: '/city.png' },
    { name: 'Turkestan', image: '/turkestan.jpg' },
    { name: 'Karaganda', image: '/city.png' },
    { name: 'Pavlodar', image: '/city.png' },
    { name: 'Atyrau', image: '/city.png' },
    { name: 'Kokshetau', image: '/city.png' },
    { name: 'Aktobe', image: '/city.png' }
  ]

  const tourTypes = [
    { name: 'Photo tour', image: '/couple-photo.jpg' },
    { name: 'General', image: '/tours.jpg' },
    { name: 'Golf tour', image: '/desert.jpg' },
    { name: 'Cultural Tour', image: '/kozha_akhmet_yassaui.jpg' },
    { name: 'Nature Tour', image: '/charyn.jpg' },
    { name: 'City Tour', image: '/expo.jpg' }
  ]

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = () => {
    setShowContactForm(true)
  }

  const handleSend = () => {
    // Handle form submission here
    console.log('Form submitted:', formData)
    onClose()
  }

  const updateFormData = (key: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const incrementCounter = (field: 'adults' | 'children') => {
    setFormData(prev => ({ ...prev, [field]: prev[field] + 1 }))
  }

  const decrementCounter = (field: 'adults' | 'children') => {
    setFormData(prev => ({ ...prev, [field]: Math.max(0, prev[field] - 1) }))
  }

  const generateCalendar = () => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    
    const months = []
    for (let i = 0; i < 2; i++) {
      const month = new Date(currentYear, currentMonth + i, 1)
      months.push(month)
    }
    
    return months
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const isToday = (day: number, month: number, year: number) => {
    const today = new Date()
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Image src="/Logo 2.png" alt="Visit Kazakhstan" width={150} height={50} className="h-10 w-auto" />
          </div>
          <div className="text-sm text-gray-500">
            {currentStep} of 4
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {!showContactForm && (
          <div className="px-6 py-4">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-gradient-to-r from-teal-400 to-yellow-400 h-1 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="p-6">
          {/* Step 1: Choose Destination */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose a destination</h2>
              <p className="text-gray-600 mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                {destinations.map((destination) => (
                  <button
                    key={destination.name}
                    onClick={() => updateFormData('destination', destination.name)}
                    className={`relative rounded-2xl overflow-hidden h-32 group hover:scale-105 transition-transform ${
                      formData.destination === destination.name ? 'ring-2 ring-teal-500' : ''
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <div 
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${destination.image})` }}
                    />
                    <div className="absolute bottom-2 left-2 text-white text-sm font-medium z-20">
                      {destination.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose Tour Type */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose a tour type</h2>
              <p className="text-gray-600 mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {tourTypes.map((tour, index) => (
                  <button
                    key={index}
                    onClick={() => updateFormData('tourType', tour.name)}
                    className={`relative rounded-2xl overflow-hidden h-32 group hover:scale-105 transition-transform ${
                      formData.tourType === tour.name ? 'ring-2 ring-teal-500' : ''
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <div 
                      className="w-full h-full bg-cover bg-center bg-gray-200"
                      style={{ backgroundImage: `url(${tour.image})` }}
                    />
                    <div className="absolute bottom-2 left-2 text-white text-sm font-medium z-20">
                      {tour.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Choose Date */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">When are you planning to arrive in the country?</h2>
              <p className="text-gray-600 mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {generateCalendar().map((month, monthIndex) => (
                  <div key={monthIndex}>
                    <h3 className="text-lg font-bold text-gray-900 text-center mb-4">
                      {formatDate(month)}
                    </h3>
                    <div className="grid grid-cols-7 gap-2 text-center text-sm">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <div key={day} className="font-bold text-gray-800 py-2">
                          {day}
                        </div>
                      ))}
                      {getDaysInMonth(month).map((day, dayIndex) => (
                        <button
                          key={dayIndex}
                          onClick={() => day && updateFormData('arrivalDate', `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
                          className={`py-2 rounded-full font-medium transition-colors ${
                            day === null ? 'invisible' : 'text-gray-900 hover:bg-gray-200'
                          } ${
                            day && isToday(day, month.getMonth(), month.getFullYear()) 
                              ? 'bg-teal-500 text-white hover:bg-teal-600' 
                              : ''
                          } ${
                            formData.arrivalDate === `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                              ? 'bg-teal-500 text-white hover:bg-teal-600'
                              : ''
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Number of Tourists */}
          {currentStep === 4 && !showContactForm && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Please specify the number of tourists</h2>
              <p className="text-gray-600 mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                    <Users className="h-5 w-5" />
                    <span>{formData.adults} adults, {formData.children} children</span>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900">Adult</span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => decrementCounter('adults')}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="text-lg font-bold text-gray-900 w-8 text-center">{formData.adults}</span>
                      <button
                        onClick={() => incrementCounter('adults')}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-medium text-gray-900">Child</span>
                      <div className="text-sm text-gray-700">from 0-9</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => decrementCounter('children')}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="text-lg font-bold text-gray-900 w-8 text-center">{formData.children}</span>
                      <button
                        onClick={() => incrementCounter('children')}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Form Screen */}
          {showContactForm && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">To find out the cost, please leave your contact details</h2>
              <p className="text-gray-600 mb-8">Our manager will contact you shortly to provide further details.</p>
              
              <div className="max-w-md mx-auto space-y-4">
                <input
                  type="text"
                  placeholder="Jenny Wilson"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900 placeholder-gray-600"
                />
                
                <input
                  type="tel"
                  placeholder="(208) 555-0112"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-gray-900 placeholder-gray-600"
                />
                
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-gray-50 text-gray-600 placeholder-gray-600"
                />

                <p className="text-xs text-gray-500">
                  By clicking the &apos;Send&apos; button, you confirm your agreement with our Privacy Policy.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t">
          <button
            onClick={showContactForm ? () => setShowContactForm(false) : handleBack}
            disabled={currentStep === 1 && !showContactForm}
            className={`px-6 py-3 rounded-full font-medium transition-colors ${
              currentStep === 1 && !showContactForm
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Back
          </button>
          
          <button
            onClick={showContactForm ? handleSend : (currentStep === 4 ? handleFinish : handleNext)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            {showContactForm ? 'Send' : (currentStep === 4 ? 'Finish' : 'Next')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlanTripModal