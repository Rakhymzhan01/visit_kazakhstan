'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Calendar, Users, X, ChevronDown } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PlanTripPage = () => {
  const [activeTab, setActiveTab] = useState('Getting to Kazakhstan');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [isCitiesDropdownOpen, setIsCitiesDropdownOpen] = useState(false);
  const [isCalendarDropdownOpen, setIsCalendarDropdownOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState('Start Date');
  const [selectedEndDate, setSelectedEndDate] = useState('End Date');
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTourTypes, setSelectedTourTypes] = useState<string[]>([]);
  const [isTourTypesDropdownOpen, setIsTourTypesDropdownOpen] = useState(false);
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [isGuestsDropdownOpen, setIsGuestsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const tourTypesRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  const kazakhstanCities = [
    'Almaty', 'Astana', 'Shymkent', 'Aktobe', 'Taraz', 'Pavlodar', 'Ust-Kamenogorsk', 
    'Semey', 'Atyrau', 'Kostanay', 'Petropavlovsk', 'Oral', 'Temirtau', 'Aktau', 
    'Kokshetau', 'Rudny', 'Ekibastuz', 'Taldykorgan', 'Zhezkazgan', 'Turkestan',
    'Balkhash', 'Kentau', 'Ridder', 'Saryagash', 'Stepnogorsk', 'Karaganda',
    'Oskemen', 'Kyzylorda'
  ];

  const tourTypes = [
    'Nature & Adventure',
    'Cultural Heritage',
    'City Tours',
    'Desert Expeditions',
    'Mountain Trekking',
    'Historical Sites',
    'Wildlife Safari',
    'Photography Tours',
    'Spiritual Journeys',
    'Nomadic Experiences'
  ];

  const tabs = [
    'Getting to Kazakhstan',
    'Visa & Entry Info', 
    'Best Time to Visit',
    'Getting Around',
    'Travel Tips',
    'Pack This'
  ];

  const removeCity = (cityToRemove: string) => {
    setSelectedCities(cities => cities.filter(city => city !== cityToRemove));
  };

  const toggleCity = (city: string) => {
    setSelectedCities(cities => {
      if (cities.includes(city)) {
        return cities.filter(c => c !== city);
      } else {
        return [...cities, city];
      }
    });
  };

  const removeTourType = (tourTypeToRemove: string) => {
    setSelectedTourTypes(types => types.filter(type => type !== tourTypeToRemove));
  };

  const toggleTourType = (tourType: string) => {
    setSelectedTourTypes(types => {
      if (types.includes(tourType)) {
        return types.filter(t => t !== tourType);
      } else {
        return [...types, tourType];
      }
    });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCitiesDropdownOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarDropdownOpen(false);
      }
      if (tourTypesRef.current && !tourTypesRef.current.contains(event.target as Node)) {
        setIsTourTypesDropdownOpen(false);
      }
      if (guestsRef.current && !guestsRef.current.contains(event.target as Node)) {
        setIsGuestsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const generateCalendarDays = (date: Date) => {
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const selectDate = (day: number) => {
    const monthName = monthNames[currentMonth.getMonth()];
    const selectedDate = `${day} ${monthName}`;
    
    if (isSelectingStartDate) {
      setSelectedStartDate(selectedDate);
      setIsSelectingStartDate(false);
    } else {
      setSelectedEndDate(selectedDate);
      setIsCalendarDropdownOpen(false);
      setIsSelectingStartDate(true);
    }
  };

  const tabContent: Record<string, Array<{
    icon: string;
    title: string;
    subtitle?: string;
    description: string;
  }>> = {
    'Getting to Kazakhstan': [
      {
        icon: '✈️',
        title: 'Airports',
        description: 'Major international airports are in Almaty (ALA), Astana (NQZ), and Shymkent (CIT).'
      },
      {
        icon: '✈️',
        title: 'Low-cost options',
        description: 'Some budget airlines fly to Kazakhstan from Europe and Asia.'
      },
      {
        icon: '✈️',
        title: 'Direct flights',
        description: 'from cities like Istanbul, Dubai, Frankfurt, Seoul, Tashkent, Beijing, and more.'
      }
    ],
    'Visa & Entry Info': [
      {
        icon: '🌐',
        title: 'Visa-free for many countries',
        description: 'Major international airports are in Almaty (ALA), Astana (NQZ), and Shymkent (CIT).'
      },
      {
        icon: '💳',
        title: 'E-Visa available for other countries.',
        description: 'Some budget airlines fly to Kazakhstan from Europe and Asia.'
      },
      {
        icon: '🦠',
        title: 'No COVID restrictions as of now',
        description: 'from cities like Istanbul, Dubai, Frankfurt, Seoul, Tashkent, Beijing, and more.'
      }
    ],
    'Best Time to Visit': [
      {
        icon: '🌸',
        title: 'Spring',
        subtitle: '(April–June)',
        description: 'Wildflowers, tulips, green landscapes'
      },
      {
        icon: '☀️',
        title: 'Summer',
        subtitle: '(June–August)',
        description: 'Great for mountains and lakes (can be hot in cities and deserts).'
      },
      {
        icon: '🍂',
        title: 'Autumn',
        subtitle: '(September–October)',
        description: 'from cities like Istanbul, Dubai, Frankfurt, Seoul, Tashkent, Beijing, and more.'
      },
      {
        icon: '❄️',
        title: 'Winter',
        subtitle: '(December–March)',
        description: 'Skiing, snowy landscapes, clear air.'
      }
    ],
    'Getting Around': [
      {
        icon: '✈️',
        title: 'Domestic flights connect all major cities.',
        description: ''
      },
      {
        icon: '🚂',
        title: 'Trains are cheap and scenic — especially the Almaty–Astana route.',
        description: ''
      },
      {
        icon: '🚌',
        title: 'Buses and shared taxis for short regional trips.',
        description: ''
      },
      {
        icon: '🚗',
        title: 'Car rental is ideal for nature trips (Charyn, Kolsai, Mangystau).',
        description: ''
      }
    ],
    'Travel Tips': [
      {
        icon: '💰',
        title: 'Currency',
        description: 'Tenge (₸). Credit cards work in cities; carry cash in rural areas'
      },
      {
        icon: '🗣️',
        title: 'Language',
        description: 'Kazakh and Russian. English is spoken in tourist spots'
      },
      {
        icon: '👗',
        title: 'Dress',
        description: 'Modest in religious sites; otherwise casual.'
      },
      {
        icon: '💧',
        title: 'Water',
        description: 'Bottled recommended outside big cities.'
      },
      {
        icon: '🛡️',
        title: 'Safety',
        description: 'Very safe for tourists; friendly locals.'
      }
    ],
    'Pack This': [
      {
        icon: '🧥',
        title: 'Layers for changing weather',
        description: ''
      },
      {
        icon: '🔌',
        title: 'Power adapter (Type C / F plugs)',
        description: ''
      },
      {
        icon: '🧴',
        title: 'Sunscreen & hat',
        description: ''
      },
      {
        icon: '🗺️',
        title: 'Offline maps & translation app',
        description: ''
      },
      {
        icon: '👟',
        title: 'Hiking shoes',
        description: ''
      }
    ]
  };

  return (
    <>
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="min-h-screen bg-white">
        <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white">
        <div className="absolute inset-0">
          <Image 
            src="/plan your trip.jpg" 
            alt="Airplane wing over clouds"
            fill
            className="object-cover opacity-60"
          />
        </div>
        <div className="relative px-6 py-20 text-center">
          <div className="inline-block bg-green-600 text-white px-4 py-2 rounded text-sm font-medium mb-6">
            PLAN YOUR TRIP
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Everything You Need to Know Before You Go
          </h1>
          <p className="text-xl opacity-90 mb-12">
            Build a trip yourself, or have experts plan it for you.
          </p>
          
          {/* Search Form */}
          <div className="mx-auto bg-white rounded-full flex items-center justify-between px-12 py-3 relative" style={{ width: '1200px', height: '66px' }}>
            <div className="flex items-center relative" style={{ width: '240px', height: '50px' }} ref={dropdownRef}>
              <div 
                className="flex-1 flex items-center justify-between px-4 py-3 border border-gray-200 cursor-pointer hover:border-gray-300 bg-gray-50 rounded-full"
                onClick={() => setIsCitiesDropdownOpen(!isCitiesDropdownOpen)}
              >
                <div className="flex items-center space-x-2 overflow-hidden flex-1 min-w-0">
                  <span className="text-gray-700 text-base font-medium truncate block">
                    {selectedCities.length > 0 ? 
                      (selectedCities.length > 2 ? 
                        `${selectedCities.slice(0, 2).join(', ')} +${selectedCities.length - 2} more` : 
                        selectedCities.join(', ')
                      ) : 'Select cities'}
                  </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isCitiesDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {/* Cities Dropdown */}
              {isCitiesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 overflow-hidden" style={{ width: '265.25px' }}>
                  <div className="p-4 max-h-80 overflow-y-auto">
                    {kazakhstanCities.map((city) => (
                      <div
                        key={city}
                        className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        onClick={() => toggleCity(city)}
                      >
                        <span className="text-gray-800 text-lg font-medium">
                          {city}
                        </span>
                        {selectedCities.includes(city) && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCity(city);
                            }}
                            className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center relative" style={{ width: '240px', height: '50px' }} ref={calendarRef}>
              <div 
                className="flex-1 flex items-center justify-between px-4 py-3 border border-gray-200 cursor-pointer hover:border-gray-300 bg-gray-50 rounded-full"
                onClick={() => setIsCalendarDropdownOpen(!isCalendarDropdownOpen)}
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div className="flex items-center space-x-2">
                    <span className={`text-base font-medium ${selectedStartDate === 'Start Date' ? 'text-gray-400' : 'text-gray-700'}`}>
                      {selectedStartDate}
                    </span>
                    <span className="text-gray-400">-</span>
                    <span className={`text-base font-medium ${selectedEndDate === 'End Date' ? 'text-gray-400' : 'text-gray-700'}`}>
                      {selectedEndDate}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Calendar Dropdown */}
              {isCalendarDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 overflow-hidden" style={{ width: '320px' }}>
                  <div className="p-4">
                    {/* Selection indicator */}
                    <div className="mb-4 text-center">
                      <span className="text-sm font-medium text-gray-600">
                        {isSelectingStartDate ? 'Select start date' : 'Select end date'}
                      </span>
                    </div>
                    
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                      <button 
                        onClick={prevMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <ChevronDown className="w-5 h-5 rotate-90 text-gray-600" />
                      </button>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </h3>
                      <button 
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <ChevronDown className="w-5 h-5 -rotate-90 text-gray-600" />
                      </button>
                    </div>
                    
                    {/* Days of week */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {generateCalendarDays(currentMonth).map((day, index) => (
                        <div key={index} className="h-10">
                          {day && (
                            <button
                              onClick={() => selectDate(day)}
                              className={`w-full h-full flex items-center justify-center text-sm rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                                selectedStartDate === `${day} ${monthNames[currentMonth.getMonth()]}` || selectedEndDate === `${day} ${monthNames[currentMonth.getMonth()]}`
                                  ? 'bg-blue-500 text-white' 
                                  : 'text-gray-700'
                              }`}
                            >
                              {day}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center relative flex-shrink-0" style={{ width: '240px', height: '50px' }} ref={guestsRef}>
              <div 
                className="flex-1 flex items-center justify-between px-4 py-3 border border-gray-200 cursor-pointer hover:border-gray-300 bg-gray-50 rounded-full"
                onClick={() => setIsGuestsDropdownOpen(!isGuestsDropdownOpen)}
              >
                <div className="flex items-center space-x-2 overflow-hidden flex-1 min-w-0">
                  <Users className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  <span className="text-gray-700 text-base font-medium truncate block">
                    {adultsCount} adults{childrenCount > 0 ? `, ${childrenCount} children` : ''}
                  </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isGuestsDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {/* Guests Dropdown */}
              {isGuestsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 overflow-hidden" style={{ width: '300px' }}>
                  <div className="p-6">
                    {/* Adults */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col">
                        <span className="text-gray-800 text-lg font-medium">Adult</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                          disabled={adultsCount <= 1}
                        >
                          <span className="text-gray-600 text-xl font-light">−</span>
                        </button>
                        <span className="text-xl font-medium w-8 text-center">{adultsCount}</span>
                        <button
                          onClick={() => setAdultsCount(Math.min(10, adultsCount + 1))}
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <span className="text-gray-600 text-xl font-light">+</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Children */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-gray-800 text-lg font-medium">Child</span>
                        <span className="text-gray-500 text-sm">from 0-9</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                          disabled={childrenCount <= 0}
                        >
                          <span className="text-gray-600 text-xl font-light">−</span>
                        </button>
                        <span className="text-xl font-medium w-8 text-center">{childrenCount}</span>
                        <button
                          onClick={() => setChildrenCount(Math.min(10, childrenCount + 1))}
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <span className="text-gray-600 text-xl font-light">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center relative flex-shrink-0" style={{ width: '240px', height: '50px' }} ref={tourTypesRef}>
              <div 
                className="flex-1 flex items-center justify-between px-4 py-3 border border-gray-200 cursor-pointer hover:border-gray-300 bg-gray-50 rounded-full"
                onClick={() => setIsTourTypesDropdownOpen(!isTourTypesDropdownOpen)}
              >
                <div className="flex items-center space-x-2 overflow-hidden flex-1 min-w-0">
                  <span className="text-gray-700 text-base font-medium truncate block">
                    {selectedTourTypes.length > 0 ? 
                      (selectedTourTypes.length > 1 ? 
                        `${selectedTourTypes[0]} +${selectedTourTypes.length - 1} more` : 
                        selectedTourTypes[0]
                      ) : 'Tour type'}
                  </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isTourTypesDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {/* Tour Types Dropdown */}
              {isTourTypesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 overflow-hidden" style={{ width: '300px' }}>
                  <div className="p-4 max-h-80 overflow-y-auto">
                    {tourTypes.map((tourType) => (
                      <div
                        key={tourType}
                        className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        onClick={() => toggleTourType(tourType)}
                      >
                        <span className="text-gray-800 text-lg font-medium">
                          {tourType}
                        </span>
                        {selectedTourTypes.includes(tourType) && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTourType(tourType);
                            }}
                            className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-base font-medium">
              Sent
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex space-x-8 border-b border-gray-200 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tabContent[activeTab]?.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-100">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-sm text-gray-600 mb-2">{item.subtitle}</p>
                )}
                {item.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </>
  );
};

export default PlanTripPage;