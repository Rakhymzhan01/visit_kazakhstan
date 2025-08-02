'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star, Calendar, MapPin, Users } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const ToursPage = () => {
  const [activeCategory, setActiveCategory] = useState('All Tours')
  const [priceFilter, setPriceFilter] = useState('all')
  const [durationFilter, setDurationFilter] = useState('all')

  const categories = [
    'All Tours',
    'Nature Escapes',
    'Silk Road Heritage Tours',
    'Nomadic Life & Ethno Tours',
    'Modern Culture & City Life',
    'Weekend Getaways'
  ]

  const tours = [
    {
      id: 1,
      title: 'Charyn Canyon & Kolsai Lakes Tour',
      description: 'A classic multi-day trip from Almaty into the Tian Shan mountains — explore canyons, alpine lakes, and mountain villages.',
      image: '/images/tours/charyn-kolsai.jpg',
      category: 'Nature Escapes',
      duration: '3 days',
      price: 450,
      rating: 5,
      location: 'Almaty',
      groupSize: '2-12',
      date: '20 may 2025',
      slug: 'charyn-canyon-kolsai-lakes',
      featured: true
    },
    {
      id: 2,
      title: 'Mangystau Desert Expedition',
      description: 'Visit Bozzhyra, Sherkala, and Torysh with local guides. Sleep in a yurt under the stars, explore sacred places, and enjoy Mars-like scenery.',
      image: '/images/tours/mangystau-expedition.jpg',
      category: 'Nature Escapes',
      duration: '5 days',
      price: 780,
      rating: 5,
      location: 'Mangystau',
      groupSize: '4-8',
      date: '20 may 2025',
      slug: 'mangystau-desert-expedition'
    },
    {
      id: 3,
      title: 'Turkestan – Taraz – Otrar Route',
      description: 'A historical journey across mausoleums, caravanserais, and ruins — with stories of poets, traders, and pilgrims.',
      image: '/images/tours/turkestan-route.jpg',
      category: 'Silk Road Heritage Tours',
      duration: '4 days',
      price: 520,
      rating: 5,
      location: 'South Kazakhstan',
      groupSize: '6-15',
      date: '20 may 2025',
      slug: 'turkestan-taraz-otrar'
    },
    {
      id: 4,
      title: 'Big Almaty Lake / Medeu / Shymbulak Ski Resort',
      description: 'Discover the stunning alpine beauty around Almaty with crystal-clear lakes and mountain adventures.',
      image: '/images/tours/big-almaty-lake.jpg',
      category: 'Weekend Getaways',
      duration: '1 day',
      price: 120,
      rating: 5,
      location: 'Almaty',
      groupSize: '1-20',
      slug: 'big-almaty-lake-tour'
    },
    {
      id: 5,
      title: 'Borovoe (Burabay) Nature Tour',
      description: 'Experience the pristine nature of Kazakhstan\'s "blue pearl" with its unique rock formations and crystal lakes.',
      image: '/images/tours/borovoe.jpg',
      category: 'Weekend Getaways',
      duration: '2 days',
      price: 280,
      rating: 5,
      location: 'Akmola',
      groupSize: '2-16',
      slug: 'borovoe-nature-tour'
    },
    {
      id: 6,
      title: 'Almaty Creative Tour',
      description: 'Street art, fashion studios, coffee culture, and live music — explore Almaty\'s youthful soul.',
      image: '/images/tours/almaty-creative.jpg',
      category: 'Modern Culture & City Life',
      duration: '1 day',
      price: 95,
      rating: 5,
      location: 'Almaty',
      groupSize: '1-12',
      slug: 'almaty-creative-tour'
    },
    {
      id: 7,
      title: 'Astana Architecture Walks',
      description: 'Discover futuristic designs and cultural hubs like Nur Alem and the National Museum.',
      image: '/images/tours/astana-architecture.jpg',
      category: 'Modern Culture & City Life',
      duration: '1 day',
      price: 85,
      rating: 5,
      location: 'Astana',
      groupSize: '1-15',
      slug: 'astana-architecture-walks'
    },
    {
      id: 8,
      title: 'Live in a Yurt & Ride a Horse',
      description: 'Stay with local families, learn to cook beshbarmak, try eagle hunting, and sleep in a yurt. Best in Almaty Region and Central Kazakhstan.',
      image: '/images/tours/yurt-horse.jpg',
      category: 'Nomadic Life & Ethno Tours',
      duration: '3 days',
      price: 380,
      rating: 5,
      location: 'Almaty Region',
      groupSize: '2-8',
      slug: 'yurt-horse-experience'
    },
    {
      id: 9,
      title: 'Kazakh Games & Music Tour',
      description: 'Watch kokpar, try archery, and hear traditional music with dombra masters.',
      image: '/images/tours/kazakh-games.jpg',
      category: 'Nomadic Life & Ethno Tours',
      duration: '2 days',
      price: 220,
      rating: 5,
      location: 'Various',
      groupSize: '4-12',
      slug: 'kazakh-games-music'
    }
  ]

  const filteredTours = tours.filter(tour => {
    const categoryMatch = activeCategory === 'All Tours' || tour.category === activeCategory
    const priceMatch = priceFilter === 'all' || 
      (priceFilter === 'budget' && tour.price < 200) ||
      (priceFilter === 'mid' && tour.price >= 200 && tour.price < 500) ||
      (priceFilter === 'luxury' && tour.price >= 500)
    const durationMatch = durationFilter === 'all' ||
      (durationFilter === 'day' && tour.duration.includes('1 day')) ||
      (durationFilter === 'weekend' && (tour.duration.includes('2 days') || tour.duration.includes('3 days'))) ||
      (durationFilter === 'week' && (tour.duration.includes('4 days') || tour.duration.includes('5 days') || tour.duration.includes('6 days') || tour.duration.includes('7 days')))
    
    return categoryMatch && priceMatch && durationMatch
  })

  const featuredTour = filteredTours.find(tour => tour.featured) || filteredTours[0]
  const otherTours = filteredTours.filter(tour => tour.id !== featuredTour?.id)

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        <div className="flex gap-4 p-4">
          {/* Left Content */}
          <div className="w-[674px] h-[550px] bg-white rounded-lg shadow-lg px-20 py-16 flex flex-col justify-center">
            <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit">
              TOURS
            </div>
            <h1 className="text-[36px] font-bold text-gray-900 mb-6 leading-tight">
              Find Your Way to Explore
              <br />
              <span className="text-teal-600">Kazakhstan</span>
            </h1>
            <p className="text-[14px] text-gray-600 leading-relaxed max-w-md">
              Kazakhstan is vast and diverse — and so are the ways to experience it. Whether 
              you&apos;re chasing landscapes, culture, adventure, or spiritual meaning, there&apos;s a route 
              for every traveler.
            </p>
          </div>
          
          {/* Right Image */}
          <div className="w-[674px] h-[550px] rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/images/hero/tours-hero.jpg"
              alt="Kazakhstan Tours"
              width={674}
              height={550}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filters */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tour Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Price and Duration Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Price Range</h4>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Prices</option>
                <option value="budget">Budget ($0 - $200)</option>
                <option value="mid">Mid-range ($200 - $500)</option>
                <option value="luxury">Luxury ($500+)</option>
              </select>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Duration</h4>
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Durations</option>
                <option value="day">Day Tours (1 day)</option>
                <option value="weekend">Weekend Tours (2-3 days)</option>
                <option value="week">Extended Tours (4+ days)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tour */}
      {featuredTour && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src={featuredTour.image}
                    alt={featuredTour.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Featured
                    </span>
                    {featuredTour.date && (
                      <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                        📅 {featuredTour.date}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-teal-600 text-sm font-medium">{featuredTour.category}</span>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1">
                      {[...Array(featuredTour.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {featuredTour.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredTour.description}
                  </p>
                  
                  {/* Tour Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {featuredTour.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {featuredTour.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      {featuredTour.groupSize} people
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold text-teal-600">${featuredTour.price}</span> per person
                    </div>
                  </div>

                  <Link
                    href={`/tours/${featuredTour.slug}`}
                    className="inline-flex items-center bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 w-fit"
                  >
                    Book This Tour
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tours Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              All Tours ({filteredTours.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherTours.map((tour) => (
              <div key={tour.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {tour.date && (
                      <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                        📅 {tour.date}
                      </span>
                    )}
                    <span className="bg-teal-500 text-white text-xs px-3 py-1 rounded-full">
                      {tour.category.split(' ')[0]}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-semibold px-3 py-1 rounded-full">
                      ${tour.price}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(tour.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-gray-600 text-sm">{tour.duration}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {tour.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {tour.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {tour.location}
                    </div>
                    <Link
                      href={`/tours/${tour.slug}`}
                      className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 group"
                    >
                      Book Tour
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTours.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tours found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more tours.</p>
              <button
                onClick={() => {
                  setActiveCategory('All Tours')
                  setPriceFilter('all')
                  setDurationFilter('all')
                }}
                className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
      </div>
      <Footer />
    </>
  )
}

export default ToursPage