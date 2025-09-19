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
      image: '/expo.jpg',
      date: '20 may 2025',
      category: 'Events',
      featured: true
    },
    {
      id: 2,
      title: 'Lorem ipsum dolor sit amet consectetur',
      image: '/desert.jpg',
      date: '20 may 2025',
      category: 'Events'
    },
    {
      id: 3,
      title: 'Lorem ipsum dolor sit amet consectetur',
      image: '/famile.jpg',
      date: '20 may 2025',
      category: 'Music'
    },
    {
      id: 4,
      title: 'Lorem ipsum dolor sit amet consectetur',
      image: '/couple-photo.jpg',
      date: '20 may 2025',
      category: 'Events'
    },
    {
      id: 5,
      title: 'Lorem ipsum dolor sit amet consectetur',
      image: '/baiterek.jpg',
      date: '20 may 2025',
      category: 'Conference'
    },
    {
      id: 6,
      title: 'Lorem ipsum dolor sit amet consectetur',
      image: '/almaty.jpg',
      date: '20 may 2025',
      category: 'Events'
    },
    {
      id: 7,
      title: 'Lorem ipsum dolor sit amet consectetur',
      image: '/charyn.jpg',
      date: '20 may 2025',
      category: 'Events'
    },
    {
      id: 8,
      title: 'Lorem ipsum dolor sit amet consectetur',
      image: '/mangystau.jpg',
      date: '20 may 2025',
      category: 'Events'
    },
    {
      id: 9,
      title: 'Lorem ipsum dolor sit amet consectetur',
      image: '/kozha_akhmet_yassaui.jpg',
      date: '20 may 2025',
      category: 'Culture'
    }
  ]

  const featuredEvent = events.find(event => event.featured)
  const otherEvents = events.filter(event => !event.featured)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative flex justify-center py-8 bg-gray-50">
        <div className="flex gap-2 items-center">
          {/* Left Content */}
          <div className="w-[678px] h-[550px] bg-white rounded-lg px-20 py-16 flex flex-col justify-center">
            <div className="inline-block text-white px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit" style={{ backgroundColor: '#E8A3BE' }}>
              EVENTS
            </div>
            <h1 className="text-[36px] font-bold text-gray-900 mb-6 leading-tight">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h1>
            <p className="text-[14px] text-gray-600 leading-relaxed max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et 
              velit interdum, ac aliquet odio mattis.
            </p>
          </div>
          
          {/* Right Image */}
          <div className="w-[674px] h-[550px] rounded-lg overflow-hidden">
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
            <h2>
              <span className="text-[#202020]" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: '48px',
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
                  fontSize: '48px',
                  lineHeight: '100%',
                  letterSpacing: '-4%'
                }}
              >Events</span>
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
              <div className="flex gap-6 items-stretch">
                {/* Large Image */}
                <div className="relative overflow-hidden rounded-2xl" style={{ width: '792px', height: '400px' }}>
                  <Image
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    width={792}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                      📅 {featuredEvent.date}
                    </span>
                    <span className="text-white text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#E8A3BE' }}>
                      {featuredEvent.category}
                    </span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="bg-white rounded-2xl flex flex-col justify-center" style={{ width: '384px', height: '400px', padding: '32px' }}>
                  <h3 className="font-montserrat mb-6" style={{
                    fontWeight: 600,
                    fontSize: '24px',
                    lineHeight: '130%',
                    letterSpacing: '-2%',
                    color: '#202020'
                  }}>
                    {featuredEvent.title}
                  </h3>
                  <p className="font-manrope mb-8" style={{
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '24px',
                    letterSpacing: '-1%',
                    color: '#4F504F'
                  }}>
                    {featuredEvent.description}
                  </p>
                  <button 
                    className="text-white font-manrope rounded-full self-start flex items-center justify-center"
                    style={{
                      width: '160px',
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
                </div>
              </div>
            </div>
          )}

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherEvents.map((event) => (
              <div key={event.id} className="relative overflow-hidden rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300" style={{ width: '384px', height: '400px' }}>
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
                    📅 {event.date}
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
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default EventsPage