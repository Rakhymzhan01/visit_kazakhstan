'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { destinationsApi } from '@/lib/api'

interface Destination {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  subcategory?: string;
  featured?: boolean;
}

const CulturePage = () => {
  const [activeTab, setActiveTab] = useState('Now')

  // Fetch culture destinations from database
  const { data: destinationsData, isLoading, error } = useQuery({
    queryKey: ['destinations', 'culture'],
    queryFn: () => destinationsApi.getPublicDestinations({
      category: 'culture',
      limit: 20
    }),
  });

  const allDestinations = destinationsData?.data?.data?.destinations || [];
  
  // Split destinations by subcategory
  const nowDestinations = allDestinations.filter((d: Destination) => d.subcategory === 'now');
  const thenDestinations = allDestinations.filter((d: Destination) => d.subcategory === 'then');

  const tabs = ['Then', 'Now']

  // Handle loading and error states
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cultural destinations...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || allDestinations.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No cultural destinations found.</p>
            <p className="text-sm text-gray-500">Check back later or contact support.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const cultureCategories = {
    'Now': nowDestinations,
    'Then': thenDestinations
  }

  const currentCategories = cultureCategories[activeTab as keyof typeof cultureCategories] || []
  const featuredCategory = currentCategories.find((cat: Destination) => cat.featured)
  const otherCategories = currentCategories.filter((cat: Destination) => !cat.featured)

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative flex justify-center py-8">
        <div className="flex gap-2 items-center">
          {/* Left Content */}
          <div className="w-[678px] h-[550px] bg-white rounded-lg px-20 py-16 flex flex-col justify-center">
            <div className="inline-block text-white px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit" style={{ backgroundColor: '#2563EB' }}>
              CULTURE
            </div>
            <h1 className="text-[36px] font-bold text-gray-900 mb-6 leading-tight">
              A Journey Through Time —
              <br />
              From Nomadic Roots to
              <br />
              <span className="text-gray-900">Modern Expression</span>
            </h1>
            <p className="text-[14px] text-gray-600 leading-relaxed max-w-md">
              Kazakhstan&apos;s culture is a rich tapestry woven from centuries of nomadic life, Silk 
              Road exchanges, spiritual tradition, and modern innovation. From ancient steppe 
              rituals to jazz cafes in the city, culture here is not just preserved — it&apos;s alive and 
              evolving.
            </p>
          </div>
          
          {/* Right Image */}
          <div className="w-[674px] h-[550px] rounded-lg overflow-hidden">
            <Image
              src="/turkestan.jpg"
              alt="Kazakhstan Culture"
              width={674}
              height={550}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Modern Urban Culture Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="mb-4">
              {activeTab === 'Now' ? (
                <>
                  <span className="text-[#202020]" style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700,
                    fontSize: '48px',
                    lineHeight: '100%',
                    letterSpacing: '-4%'
                  }}>Modern</span> <span 
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
                  >Urban Culture</span>
                </>
              ) : (
                <>
                  <span className="text-[#202020]" style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700,
                    fontSize: '48px',
                    lineHeight: '100%',
                    letterSpacing: '-4%'
                  }}>Nomadic Heritage &</span> <span 
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
                  >Ancient Traditions</span>
                </>
              )}
            </h2>
            
            {/* Tab Navigation */}
            <div className="flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-lg font-medium transition-all duration-300 relative ${
                    activeTab === tab
                      ? 'text-gray-900'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Category */}
          {featuredCategory && (
            <div className="flex gap-6 mb-12">
              {/* Large landscape photo */}
              <div className="relative overflow-hidden rounded-2xl" style={{ width: '792px', height: '400px' }}>
                <Image
                  src={featuredCategory.image}
                  alt={featuredCategory.name}
                  width={792}
                  height={400}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="text-white text-sm px-4 py-2 rounded-full font-medium" style={{ backgroundColor: '#2563EB' }}>
                    {featuredCategory.category}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white text-3xl font-bold leading-tight">
                    {featuredCategory.name}
                  </h3>
                </div>
              </div>

              {/* Text box on the right */}
              <div className="bg-white rounded-2xl flex flex-col" style={{ width: '384px', height: '400px', padding: '32px' }}>
                <h3 className="font-montserrat" style={{
                  fontWeight: 600,
                  fontSize: '24px',
                  lineHeight: '130%',
                  letterSpacing: '-2%',
                  color: '#202020',
                  marginBottom: '32px'
                }}>
                  {featuredCategory.name}
                </h3>
                <p className="font-manrope flex-1" style={{
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '24px',
                  letterSpacing: '-1%',
                  color: '#4F504F',
                  marginBottom: '48px'
                }}>
                  {featuredCategory.description}
                </p>
                <Link 
                  href="/plan-your-trip"
                  className="text-white font-manrope rounded-full self-start flex items-center justify-center hover:bg-[#007a9a] transition-colors"
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
                  Plan your trip
                </Link>
              </div>
            </div>
          )}

          {/* Culture Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherCategories.map((category: Destination) => (
              <Link key={category._id} href={`/culture/${category.slug}`}>
                <div className="relative overflow-hidden rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300" style={{ width: '384px', height: '400px' }}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={384}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  {/* Culture badge */}
                  <div className="absolute top-4 left-4">
                    <span className="text-white text-sm px-4 py-2 rounded-full font-medium" style={{ backgroundColor: '#2563EB' }}>
                      {category.category}
                    </span>
                  </div>
                  
                  {/* Title at bottom */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white text-2xl font-bold leading-tight">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      </div>
      <Footer />
    </>
  )
}

export default CulturePage