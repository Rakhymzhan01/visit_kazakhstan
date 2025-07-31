'use client'

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';


interface Tour {
  id: number;
  title: string;
  image: string;
  rating: number;
  description?: string;
  date?: string;
  location?: string;
}

const ToursPage = () => {
  const [activeTab, setActiveTab] = useState('Nature Escapes');

  const tabs = [
    'Nature Escapes',
    'Silk Road Heritage Tours', 
    'Nomadic Life & Ethno Tours',
    'Modern Culture & City Life',
    'Weekend Getaways'
  ];

  const toursByTab: Record<string, Tour[]> = {
    'Weekend Getaways': [
      {
        id: 1,
        title: 'Big Almaty Lake / Medeu / Shymbulak Ski Resort',
        image: '/shym.jpg',
        rating: 5
      },
      {
        id: 2,
        title: 'Borovoe (Burabay) Nature Tour',
        image: '/kozha_akhmet_yassaui.jpg',
        rating: 4
      },
      {
        id: 3,
        title: 'Aktau to Caspian Coast Road Trips',
        image: '/aktau.jpg',
        rating: 5
      }
    ],
    'Modern Culture & City Life': [
      {
        id: 4,
        title: 'Almaty Creative Tour',
        description: 'Street art, fashion studios, coffee culture, and live music — explore Almaty\'s youthful soul.',
        image: '/shym.jpg',
        rating: 5
      },
      {
        id: 5,
        title: 'Astana Architecture Walks',
        description: 'Discover futuristic designs and cultural hubs like Nur Alem and the National Museum.',
        image: '/kozha_akhmet_yassaui.jpg',
        rating: 4
      }
    ],
    'Nomadic Life & Ethno Tours': [
      {
        id: 6,
        title: 'Live in a Yurt & Ride a Horse',
        description: 'Stay with local families, learn to cook beshbarmak, try eagle hunting, and sleep in a yurt. Best in Almaty Region and Central Kazakhstan.',
        image: '/shym.jpg',
        rating: 5
      },
      {
        id: 7,
        title: 'Kazakh Games & Music Tour',
        description: 'Watch kokpar, try archery, and hear traditional music with dombra masters.',
        image: '/kozha_akhmet_yassaui.jpg',
        rating: 4
      }
    ],
    'Silk Road Heritage Tours': [
      {
        id: 8,
        title: 'Shymkent Cultural Circle',
        description: 'A historical journey across mausoleums, caravanserais, and ruins — with stories of poets, traders, and pilgrims.',
        image: '/shym.jpg',
        rating: 5,
        date: '20 may 2025',
        location: 'Shymkent'
      },
      {
        id: 9,
        title: 'Turkestan – Taraz – Otrar Route',
        description: 'A historical journey across mausoleums, caravanserais, and ruins — with stories of poets, traders, and pilgrims.',
        image: '/kozha_akhmet_yassaui.jpg',
        rating: 4,
        date: '20 may 2025'
      }
    ],
    'Nature Escapes': [
      {
        id: 10,
        title: 'Charyn Canyon & Kolsai Lakes Tour',
        description: 'A classic multi-day trip from Almaty into the Tien Shan mountains — explore canyons, alpine lakes, and mountain villages.',
        image: '/bao_contras.jpg',
        rating: 5,
        date: '20 may 2025',
        location: 'Almaty'
      },
      {
        id: 11,
        title: 'Mangystau Desert Expedition',
        description: 'Visit Bozzhyra, Sherkala, and Torysh with local guides. Sleep in a yurt under the stars, explore sacred places, and enjoy Mars-like scenery.',
        image: '/mangystau.jpg',
        rating: 5,
        date: '20 may 2025'
      },
      {
        id: 12,
        title: 'Turkestan – Taraz – Otrar Route',
        description: 'A historical journey across mausoleums, caravanserais, and ruins — with stories of poets, traders, and pilgrims.',
        image: '/kozha_akhmet_yassaui.jpg',
        rating: 5,
        date: '20 may 2025'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative">
        <div className="flex">
          {/* Left Content */}
          <div className="w-1/2 px-20 py-16 flex flex-col justify-center">
            <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit">
              TOURS
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your Way to Explore Kazakhstan
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-md">
              Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you&apos;re chasing landscapes, culture, adventure, or spiritual meaning, there&apos;s a route for every traveler.
            </p>
          </div>
          
          {/* Right Image */}
          <div className="w-1/2">
            <img 
              src="/tours.jpg" 
              alt="Traveler with backpack taking photo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Tours Section */}
      <section className="py-16 px-20">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Top Tour <span className="text-teal-500">Themes</span>
          </h2>
          
          {/* Tab Navigation */}
          <div className="flex space-x-8 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tour Cards */}
        <div className="grid grid-cols-3 gap-8">
          {(toursByTab[activeTab] || []).slice(0, 3).map((tour) => (
            <div key={tour.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={tour.image} 
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
                {tour.date && (
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-gray-800 text-white px-3 py-1 rounded-md text-xs font-medium">
                      {tour.date}
                    </span>
                    {tour.location && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-md text-xs font-medium">
                        {tour.location}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                  {tour.title}
                </h3>
                {tour.description && (
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {tour.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                    Read more →
                  </button>
                  
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < tour.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ToursPage;