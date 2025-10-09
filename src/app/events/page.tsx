'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { eventsApi } from '@/lib/api'

interface Event {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  image: string;
  category: string;
  date: string;
  time?: string;
  location?: string;
  featured: boolean;
  status: string;
  views: number;
}

const EventsPage = () => {
  const [selectedCity] = useState('SELECT CITY')
  const [sortBy] = useState('SORT BY DATE')

  // Fetch events from database
  const { 
    data: eventsData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await eventsApi.getPublicEvents({ limit: 50 });
      return response.data;
    },
  });

  console.log('📊 Events page state:', { eventsData, isLoading, error });

  const events = eventsData?.data?.events || [];
  const featuredEvent = events.find((event: Event) => event.featured);
  const otherEvents = events.filter((event: Event) => event._id !== featuredEvent?._id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-gray-900">Loading events...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-lg text-red-600 mb-2">Failed to load events</div>
            <button 
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-2 items-center justify-center">
            {/* Left Content */}
            <div className="w-full lg:w-[678px] h-auto lg:h-[550px] bg-white rounded-lg px-6 sm:px-12 lg:px-20 py-8 lg:py-16 flex flex-col justify-center">
              <div className="inline-block text-white px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit" style={{ backgroundColor: '#E8A3BE' }}>
                EVENTS
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-gray-900 mb-6 leading-tight">
                Discover Amazing Events in Kazakhstan
              </h1>
              <p className="text-sm lg:text-[14px] text-gray-600 leading-relaxed max-w-md">
                From cultural festivals to adventure sports, explore the diverse events that showcase Kazakhstan's rich heritage and modern spirit.
              </p>
            </div>
            
            {/* Right Image */}
            <div className="w-full lg:w-[674px] h-[300px] sm:h-[400px] lg:h-[550px] rounded-lg overflow-hidden">
              <Image 
                src="/bao_contras.jpg" 
                alt="Kazakhstan Events"
                width={674}
                height={550}
                className="w-full h-full object-cover"
                priority
              />
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
            <h2 className="text-center sm:text-left">
              <span className="text-[#202020]" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(24px, 6vw, 48px)',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}>Explore</span> <span 
                className="bg-gradient-to-r from-[#009CBC] to-[#FFE700] bg-clip-text text-transparent"
                style={{
                  background: 'linear-gradient(90deg, #009CBC 0%, #FFE700 154.07%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 400,
                  fontSize: 'clamp(24px, 6vw, 48px)',
                  lineHeight: '100%',
                  letterSpacing: '-4%'
                }}
              >Events</span>
            </h2>
            
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
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

          {events.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500">Check back later for upcoming events</p>
            </div>
          ) : (
            <>
              {/* Featured Event */}
              {featuredEvent && (
                <div className="mb-16">
                  <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                    {/* Large Image */}
                    <div className="relative overflow-hidden rounded-2xl w-full lg:w-[792px] h-[300px] sm:h-[400px]">
                      <Image
                        src={featuredEvent.image}
                        alt={featuredEvent.title}
                        width={792}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                          📅 {new Date(featuredEvent.date).toLocaleDateString()}
                        </span>
                        <span className="text-white text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#E8A3BE' }}>
                          {featuredEvent.category}
                        </span>
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="bg-white rounded-2xl flex flex-col justify-center w-full lg:w-[384px] h-auto lg:h-[400px] p-6 lg:p-8">
                      <h3 className="font-montserrat mb-4 lg:mb-6" style={{
                        fontWeight: 600,
                        fontSize: 'clamp(18px, 4vw, 24px)',
                        lineHeight: '130%',
                        letterSpacing: '-2%',
                        color: '#202020'
                      }}>
                        {featuredEvent.title}
                      </h3>
                      <p className="font-manrope mb-6 lg:mb-8" style={{
                        fontWeight: 400,
                        fontSize: 'clamp(13px, 2.5vw, 14px)',
                        lineHeight: '24px',
                        letterSpacing: '-1%',
                        color: '#4F504F'
                      }}>
                        {featuredEvent.excerpt || featuredEvent.description}
                      </p>
                      <Link href={`/events/${featuredEvent.slug}`}>
                        <button 
                          className="text-white font-manrope rounded-full self-start flex items-center justify-center"
                          style={{
                            width: 'clamp(140px, 30vw, 160px)',
                            height: '50px',
                            backgroundColor: '#009CBC',
                            padding: '13px 30px',
                            borderRadius: '99px',
                            fontWeight: 600,
                            fontSize: '14px',
                            lineHeight: '1',
                            letterSpacing: '-2%'
                          }}
                        >
                          Show more
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherEvents.map((event: Event) => (
                  <Link key={event._id} href={`/events/${event.slug}`}>
                    <div className="relative overflow-hidden rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300 w-full h-[300px] sm:h-[350px] lg:h-[400px]">
                    <Image
                      src={event.image}
                      alt={event.title}
                      width={384}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    
                    {/* Date and category badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                        📅 {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span className="text-white text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#E8A3BE' }}>
                        {event.category}
                      </span>
                    </div>
                    
                    {/* Title at bottom */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-white text-xl font-bold leading-tight">
                        {event.title}
                      </h3>
                    </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default EventsPage