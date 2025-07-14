'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Calendar } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const EventsPage = () => {
  const [selectedCity] = useState('SELECT CITY')
  const [sortBy] = useState('SORT BY DATE')

  const events = [
    {
      id: 1,
      title: 'Lorem ipsum dolor sit amet consectetur',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      image: '/images/events/conference-event.jpg',
      date: '20 may 2025',
      category: 'Conference',
      featured: true
    },
    {
      id: 2,
      title: 'Lorem ipsum dolor sit amet consectetur',
      image: '/images/events/sports-event.jpg',
      date: '20 may 2025',
      category: 'Events'
    },
    {
      id: 3,
      title: 'Lorem ipsum dolor sit amet consectetur',
      image: '/images/events/music-event.jpg',
      date: '20 may 2025',
      category: 'Music'
    },
    {
      id: 4,
      title: 'Lorem ipsum dolor sit amet consectetur',
      image: '/images/events/entertainment-event.jpg',
      date: '20 may 2025',
      category: 'Events'
    },
    {
      id: 5,
      title: 'Lorem ipsum dolor sit amet consectetur',
      image: '/images/events/social-event.jpg',
      date: '20 may 2025',
      category: 'Events'
    },
    {
      id: 6,
      title: 'Lorem ipsum dolor sit amet consectetur',
      image: '/images/events/outdoor-event.jpg',
      date: '20 may 2025',
      category: 'Events'
    },
    {
      id: 7,
      title: 'Lorem ipsum dolor sit amet consectetur',
      image: '/images/events/city-event.jpg',
      date: '20 may 2025',
      category: 'Events'
    }
  ]

  const featuredEvent = events.find(event => event.featured)
  const otherEvents = events.filter(event => !event.featured)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center bg-pink-400 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                EVENTS
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-[#202020] mb-6 leading-tight">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </h1>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/events/hero-almaty.jpg"
                  alt="Almaty cityscape with mountains"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="py-4 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-[#009CBC]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/events" className="hover:text-[#009CBC]">Events</Link>
            <span className="mx-2">/</span>
            <span className="text-[#202020]">Explore Events</span>
          </nav>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header with Filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <h2 className="text-4xl md:text-5xl font-bold text-[#202020]">
              Explore <span className="text-[#009CBC]">Events</span>
            </h2>
            
            <div className="flex gap-4">
              {/* City Filter */}
              <div className="relative">
                <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-600 hover:border-[#009CBC] transition-colors">
                  {selectedCity}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              
              {/* Sort Filter */}
              <div className="relative">
                <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-600 hover:border-[#009CBC] transition-colors">
                  {sortBy}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Featured Event */}
          {featuredEvent && (
            <div className="mb-16">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="relative h-64 lg:h-auto">
                    <Image
                      src={featuredEvent.image}
                      alt={featuredEvent.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                        📅 {featuredEvent.date}
                      </span>
                      <span className="bg-pink-400 text-white text-xs px-3 py-1 rounded-full">
                        {featuredEvent.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold text-[#202020] mb-4">
                      {featuredEvent.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {featuredEvent.description}
                    </p>
                    <button className="inline-flex items-center bg-[#009CBC] hover:bg-[#007A9A] text-white px-6 py-3 rounded-full font-semibold transition-colors w-fit">
                      Show more
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                      📅 {event.date}
                    </span>
                    <span className={`text-white text-xs px-3 py-1 rounded-full ${
                      event.category === 'Music' ? 'bg-purple-400' :
                      event.category === 'Conference' ? 'bg-blue-400' :
                      'bg-pink-400'
                    }`}>
                      {event.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h4 className="text-lg font-bold mb-2">{event.title}</h4>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#202020] mb-3 line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </div>
                    <Link
                      href={`/events/${event.id}`}
                      className="text-[#009CBC] hover:text-[#007A9A] font-medium text-sm transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default EventsPage