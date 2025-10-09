'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

// API client for destinations
const destinationsApi = {
  getDestinations: async (category?: string, subcategory?: string) => {
    const searchParams = new URLSearchParams({
      status: 'ACTIVE',
      category: category || '',
      limit: '50'
    });
    if (subcategory) {
      searchParams.append('subcategory', subcategory);
    }
    const response = await fetch(`http://localhost:5001/api/destinations/public?${searchParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch destinations');
    return response.json();
  }
};

const CulturePage = () => {
  const [activeTab, setActiveTab] = useState('Now')

  const tabs = ['Then', 'Now']

  // Fetch culture destinations from API based on subcategory
  const { data: destinationsData, isLoading, error } = useQuery({
    queryKey: ['destinations', 'culture', activeTab.toLowerCase()],
    queryFn: () => destinationsApi.getDestinations('culture', activeTab.toLowerCase()),
  });

  const currentCategories = destinationsData?.data?.destinations || []
  const featuredCategory = currentCategories.find((cat: { featured?: boolean }) => cat.featured)
  const otherCategories = currentCategories.filter((cat: { featured?: boolean }) => !cat.featured)

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-2 items-center justify-center">
            {/* Left Content */}
            <div className="w-full lg:w-[678px] h-auto lg:h-[550px] bg-white rounded-lg px-6 sm:px-12 lg:px-20 py-8 lg:py-16 flex flex-col justify-center">
              <div className="inline-block text-white px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit" style={{ backgroundColor: '#2563EB' }}>
                CULTURE
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-gray-900 mb-6 leading-tight">
                A Journey Through Time — From Nomadic Roots to Modern Expression
              </h1>
              <p className="text-sm lg:text-[14px] text-gray-600 leading-relaxed max-w-md">
                Kazakhstan&apos;s culture is a rich tapestry woven from centuries of nomadic life, Silk 
                Road exchanges, spiritual tradition, and modern innovation. From ancient steppe 
                rituals to jazz cafes in the city, culture here is not just preserved — it&apos;s alive and 
                evolving.
              </p>
            </div>
            
            {/* Right Image */}
            <div className="w-full lg:w-[674px] h-[300px] sm:h-[400px] lg:h-[550px] rounded-lg overflow-hidden">
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
        </div>
      </section>

      {/* Modern Urban Culture Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-12 gap-6 lg:gap-0">
            <h2 className="mb-4 text-center sm:text-left">
              {activeTab === 'Now' ? (
                <>
                  <span className="text-[#202020]" style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700,
                    fontSize: 'clamp(24px, 6vw, 48px)',
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
                      fontSize: 'clamp(24px, 6vw, 48px)',
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
                    fontSize: 'clamp(24px, 6vw, 48px)',
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
                      fontSize: 'clamp(24px, 6vw, 48px)',
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

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-pulse text-gray-500">Loading cultural destinations...</div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">Failed to load cultural destinations. Please try again later.</p>
            </div>
          )}

          {/* Featured Category */}
          {featuredCategory && (
            <div className="flex flex-col lg:flex-row gap-6 mb-12">
              {/* Large landscape photo */}
              <div className="relative overflow-hidden rounded-2xl w-full lg:w-[792px] h-[300px] sm:h-[400px]">
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
                    Culture
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                    {featuredCategory.name}
                  </h3>
                </div>
              </div>

              {/* Text box on the right */}
              <div className="bg-white rounded-2xl flex flex-col w-full lg:w-[384px] h-auto lg:h-[400px] p-6 lg:p-8">
                <h3 className="font-montserrat" style={{
                  fontWeight: 600,
                  fontSize: 'clamp(18px, 4vw, 24px)',
                  lineHeight: '130%',
                  letterSpacing: '-2%',
                  color: '#202020',
                  marginBottom: 'clamp(16px, 4vw, 32px)'
                }}>
                  {featuredCategory.name}
                </h3>
                <p className="font-manrope flex-1" style={{
                  fontWeight: 400,
                  fontSize: 'clamp(13px, 2.5vw, 14px)',
                  lineHeight: '24px',
                  letterSpacing: '-1%',
                  color: '#4F504F',
                  marginBottom: 'clamp(24px, 6vw, 48px)'
                }}>
                  {featuredCategory.description}
                </p>
                <Link
                  href={`/destinations/${featuredCategory.slug}`}
                  className="text-white font-manrope rounded-full self-start flex items-center justify-center hover:bg-[#007a9a] transition-colors"
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
                  Learn more
                </Link>
              </div>
            </div>
          )}

          {/* Culture Categories Grid */}
          {otherCategories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherCategories.map((category: { id: string; slug: string; image: string; name: string; subtitle: string; description: string }) => (
                <Link key={category.id} href={`/destinations/${category.slug}`}>
                  <div className="relative overflow-hidden rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300 w-full h-[300px] sm:h-[350px] lg:h-[400px]">
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
                        Culture
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
          )}
        </div>
      </section>
      </div>
      <Footer />
    </>
  )
}

export default CulturePage