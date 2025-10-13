'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

// API client for destinations
const destinationsApi = {
  getDestinations: async (category?: string) => {
    const searchParams = new URLSearchParams({
      status: 'ACTIVE',
      category: category || '',
      limit: '50'
    });
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://intokazakhstan.com/api'}/destinations/public?${searchParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch destinations');
    return response.json();
  }
};

const CitiesPage = () => {
  // Fetch cities destinations from API
  const { data: destinationsData, isLoading, error } = useQuery({
    queryKey: ['destinations', 'cities'],
    queryFn: () => destinationsApi.getDestinations('cities'),
  });

  const cities = destinationsData?.data?.destinations || [];
  const featuredCity = cities.find((city: { featured?: boolean }) => city.featured) || cities[0];
  const otherCities = cities.filter((city: { id: string }) => city.id !== featuredCity?.id)

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
                <div className="inline-block text-white px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit" style={{ backgroundColor: '#F59E0B' }}>
                  CITIES
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-gray-900 mb-6 leading-tight">
                  From Silk Road Settlements to Modern Metropolises
                </h1>
                <p className="text-sm lg:text-[14px] text-gray-600 leading-relaxed max-w-md">
                  Kazakhstan&apos;s cities are a rich tapestry woven from centuries of nomadic life, Silk 
                  Road exchanges, spiritual tradition, and modern innovation. From ancient steppe 
                  settlements to jazz cafes in the city, urban culture here is not just preserved — it&apos;s alive and 
                  evolving.
                </p>
              </div>
              
              {/* Interactive Kazakhstan Map */}
              <div className="w-full lg:w-[674px] h-[300px] sm:h-[400px] lg:h-[550px] rounded-lg bg-white flex items-center justify-center p-4 lg:p-8">
                <div className="relative w-full h-full flex items-center justify-center">
                  <svg 
                    width="100%" 
                    height="100%" 
                    viewBox="0 0 640 348" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="max-w-full max-h-full"
                  >
                    {/* Main Kazakhstan outline */}
                    <path 
                      d="M383.443 313.276L374.494 317.155L353.916 331.673L347.088 346.414L341.279 346.547L337 336.803L317.161 336.136L313.984 319.113L306.382 318.969L307.545 297.817L288.87 282.197L262.11 283.878L243.813 286.999L228.911 267.534L216.145 259.276L191.961 243.489L189.045 241.564L148.879 254.624L149.497 333.237L141.489 334.249L130.571 317.934L120.026 312.057L102.313 316.426L95.4187 323.381L94.5451 318.29L98.3794 309.536L95.402 302.18L77.3225 294.94L70.2773 275.664L61.6633 270.183L61.1457 263.082L76.3209 265.158L76.9217 249.115L90.1879 245.52L103.821 248.825L106.632 227.084L103.849 213.094L88.2349 214.196L74.9685 208.637L56.9056 218.637L42.3481 223.372L34.4239 219.722L36.01 208.025L26.066 192.666L14.4859 193.312L1.24182 177.525L10.2454 159.634L5.68775 154.771L18.1418 128.227L34.1848 142.317L36.1269 124.549L68.3352 97.5654L92.7087 96.9145L127.099 114.176L145.573 124.142L162.129 113.748L186.864 113.252L206.819 126.007L211.354 118.717L233.268 119.78L237.18 108.061L211.894 90.8266L226.868 78.4563L223.947 71.4781L238.927 64.7782L227.664 46.9267L234.815 37.9229L293.2 28.6688L300.818 22.0468L339.86 12.0803L353.888 0.772949L381.929 6.66032L386.842 34.5508L403.13 28.0678L423.169 37.144L421.878 51.5175L436.842 50.0261L475.945 25.0184L470.235 33.3877L490.146 53.7489L525.009 118.166L533.323 105.184L554.819 119.457L577.239 113.113L585.853 117.56L593.36 131.727L604.267 136.446L610.911 146.702L631.011 143.48L639.286 158.137L627.411 173.891L614.451 176.084L613.71 199.377L605.029 209.728L574.078 202.199L562.821 242.61L554.836 247.54L523.924 256.343L537.969 293.927L527.262 299.464L528.509 311.512L518.899 308.424L511.069 300.828L487.92 298.607L462.05 298.023L456.379 300.366L434.16 291.412L425.3 295.831L422.88 308.334L397.204 301.05L386.937 304.038L383.443 313.276Z" 
                      fill="#22d3ee" 
                      stroke="#0891b2" 
                      strokeWidth="2" 
                      className="hover:fill-cyan-300 transition-colors cursor-pointer"
                    />
                    
                    {/* City markers with better positioning */}
                    <g>
                      {/* Nur-Sultan/Astana - Center-North */}
                      <circle cx="320" cy="120" r="6" fill="#DC2626" className="cursor-pointer hover:fill-red-500 transition-colors">
                        <title>Nur-Sultan (Astana)</title>
                      </circle>
                      <text x="330" y="115" fontSize="10" fill="#1f2937" className="font-semibold pointer-events-none">
                        Nur-Sultan
                      </text>
                      
                      {/* Almaty - Southeast */}
                      <circle cx="480" cy="220" r="6" fill="#DC2626" className="cursor-pointer hover:fill-red-500 transition-colors">
                        <title>Almaty</title>
                      </circle>
                      <text x="490" y="215" fontSize="10" fill="#1f2937" className="font-semibold pointer-events-none">
                        Almaty
                      </text>
                      
                      {/* Shymkent - South */}
                      <circle cx="380" cy="280" r="5" fill="#F59E0B" className="cursor-pointer hover:fill-yellow-500 transition-colors">
                        <title>Shymkent</title>
                      </circle>
                      <text x="390" y="275" fontSize="9" fill="#1f2937" className="font-medium pointer-events-none">
                        Shymkent
                      </text>
                      
                      {/* Aktau - West Coast */}
                      <circle cx="120" cy="200" r="5" fill="#F59E0B" className="cursor-pointer hover:fill-yellow-500 transition-colors">
                        <title>Aktau</title>
                      </circle>
                      <text x="130" y="195" fontSize="9" fill="#1f2937" className="font-medium pointer-events-none">
                        Aktau
                      </text>
                      
                      {/* Turkestan - South-Central */}
                      <circle cx="350" cy="270" r="4" fill="#6B7280" className="cursor-pointer hover:fill-gray-500 transition-colors">
                        <title>Turkestan</title>
                      </circle>
                      <text x="355" y="285" fontSize="8" fill="#1f2937" className="font-medium pointer-events-none">
                        Turkestan
                      </text>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cities Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="mb-4 text-center sm:text-left">
                <span className="text-[#202020]" style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(24px, 6vw, 48px)',
                  lineHeight: '100%',
                  letterSpacing: '-4%'
                }}>Discover the</span> <span 
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
                >Cities of Kazakhstan</span>
              </h2>
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-pulse text-gray-500">Loading cities...</div>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-500">Failed to load cities. Please try again later.</p>
              </div>
            )}

            {/* Featured City */}
            {featuredCity && (
              <div className="flex flex-col lg:flex-row gap-6 mb-12">
                {/* Large landscape photo */}
                <div className="relative overflow-hidden rounded-2xl w-full lg:w-[792px] h-[300px] sm:h-[400px]">
                  <Image
                    src={featuredCity.image}
                    alt={featuredCity.name}
                    width={792}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="text-white text-sm px-4 py-2 rounded-full font-medium" style={{ backgroundColor: '#F59E0B' }}>
                      Cities
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                      {featuredCity.name}
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
                    {featuredCity.name} {featuredCity.subtitle && `— ${featuredCity.subtitle}`}
                  </h3>
                  <p className="font-manrope flex-1" style={{
                    fontWeight: 400,
                    fontSize: 'clamp(13px, 2.5vw, 14px)',
                    lineHeight: '24px',
                    letterSpacing: '-1%',
                    color: '#4F504F',
                    marginBottom: 'clamp(24px, 6vw, 32px)'
                  }}>
                    {featuredCity.description}
                  </p>
                  <Link 
                    href={`/destinations/${featuredCity.slug}`}
                    className="text-white font-manrope rounded-full self-start flex items-center justify-center hover:bg-[#007a9a] transition-colors"
                    style={{
                      width: 'clamp(120px, 25vw, 124px)',
                      height: '50px',
                      backgroundColor: '#009CBC',
                      padding: '13px 20px',
                      borderRadius: '99px',
                      fontWeight: 600,
                      fontSize: '14px',
                      lineHeight: '1',
                      letterSpacing: '-2%'
                    }}
                  >
                    Show more
                  </Link>
                </div>
              </div>
            )}

            {/* Cities Grid */}
            {otherCities.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherCities.map((city: { id: string; slug: string; image: string; name: string; subtitle: string; description: string }) => (
                  <Link key={city.id} href={`/destinations/${city.slug}`}>
                    <div className="relative overflow-hidden rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300 w-full h-[300px] sm:h-[350px] lg:h-[400px]">
                      <Image
                        src={city.image}
                        alt={city.name}
                        width={384}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      
                      {/* Cities badge */}
                      <div className="absolute top-4 left-4">
                        <span className="text-white text-sm px-4 py-2 rounded-full font-medium" style={{ backgroundColor: '#F59E0B' }}>
                          Cities
                        </span>
                      </div>
                      
                      {/* Title at bottom */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold leading-tight">
                          {city.name} {city.subtitle && `— ${city.subtitle}`}
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

export default CitiesPage