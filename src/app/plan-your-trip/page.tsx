'use client'

import React, { useState } from 'react';
import { Calendar, Users, X, ChevronDown } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PlanTripPage = () => {
  const [activeTab, setActiveTab] = useState('Getting to Kazakhstan');
  const [selectedCities, setSelectedCities] = useState(['Astana', 'Almaty']);

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
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white">
        <div className="absolute inset-0">
          <img 
            src="/api/placeholder/1200/500" 
            alt="Airplane wing over clouds"
            className="w-full h-full object-cover opacity-60"
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
          <div className="max-w-4xl mx-auto bg-white rounded-full p-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {selectedCities.map((city) => (
                <div key={city} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center text-sm">
                  {city}
                  <button onClick={() => removeCity(city)} className="ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <ChevronDown className="text-gray-400 w-4 h-4" />
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">15 May</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span className="text-sm">2 adults, 1 children</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm">Tour type</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-full text-sm font-medium">
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
  );
};

export default PlanTripPage;