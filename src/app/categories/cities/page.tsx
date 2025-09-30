'use client'
import React from 'react'
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
  subtitle?: string;
  featured?: boolean;
}

const CitiesPage = () => {
  // Fetch cities destinations from database
  const { data: destinationsData, isLoading, error } = useQuery({
    queryKey: ['destinations', 'cities'],
    queryFn: () => destinationsApi.getPublicDestinations({
      category: 'cities',
      limit: 20
    }),
  });

  const cities = destinationsData?.data?.data?.destinations || [];

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cities...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || cities.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No cities found.</p>
            <p className="text-sm text-gray-500">Check back later or contact support.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative flex justify-center py-8">
        <div className="flex gap-2 items-center">
          {/* Left Content */}
          <div className="w-[678px] h-[550px] bg-white rounded-lg px-20 py-16 flex flex-col justify-center">
            <div className="inline-block text-white px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit" style={{ backgroundColor: '#F59E0B' }}>
              CITIES
            </div>
            <h1 className="text-[36px] font-bold text-gray-900 mb-6 leading-tight">
              From Silk Road Settlements to Modern Metropolises
              <br />
            </h1>
            <p className="text-[14px] text-gray-600 leading-relaxed max-w-md">
              Kazakhstan&apos;s cities are a rich tapestry woven from centuries of nomadic life, Silk 
              Road exchanges, spiritual tradition, and modern innovation. From ancient steppe 
              settlements to jazz cafes in the city, urban culture here is not just preserved — it&apos;s alive and 
              evolving.
            </p>
          </div>
          
          {/* Interactive Kazakhstan Map */}
          <div className="w-[674px] h-[550px] rounded-lg bg-white flex items-center justify-center p-8">
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
                  <circle cx="280" cy="280" r="5" fill="#DC2626" className="cursor-pointer hover:fill-red-500 transition-colors">
                    <title>Shymkent</title>
                  </circle>
                  <text x="290" y="275" fontSize="9" fill="#1f2937" className="font-medium pointer-events-none">
                    Shymkent
                  </text>
                  
                  {/* Aktau - West Coast */}
                  <circle cx="80" cy="200" r="4" fill="#DC2626" className="cursor-pointer hover:fill-red-500 transition-colors">
                    <title>Aktau</title>
                  </circle>
                  <text x="90" y="195" fontSize="9" fill="#1f2937" className="font-medium pointer-events-none">
                    Aktau
                  </text>
                  
                  {/* Turkestan - South */}
                  <circle cx="250" cy="290" r="4" fill="#DC2626" className="cursor-pointer hover:fill-red-500 transition-colors">
                    <title>Turkestan</title>
                  </circle>
                  <text x="210" y="305" fontSize="9" fill="#1f2937" className="font-medium pointer-events-none">
                    Turkestan
                  </text>
                  
                  {/* Oskemen - Northeast */}
                  <circle cx="520" cy="100" r="4" fill="#DC2626" className="cursor-pointer hover:fill-red-500 transition-colors">
                    <title>Oskemen</title>
                  </circle>
                  <text x="530" y="95" fontSize="9" fill="#1f2937" className="font-medium pointer-events-none">
                    Oskemen
                  </text>
                  
                  {/* Taraz - South */}
                  <circle cx="300" cy="270" r="4" fill="#DC2626" className="cursor-pointer hover:fill-red-500 transition-colors">
                    <title>Taraz</title>
                  </circle>
                  <text x="310" y="265" fontSize="9" fill="#1f2937" className="font-medium pointer-events-none">
                    Taraz
                  </text>
                  
                  {/* Karaganda - Center */}
                  <circle cx="380" cy="160" r="4" fill="#DC2626" className="cursor-pointer hover:fill-red-500 transition-colors">
                    <title>Karaganda</title>
                  </circle>
                  <text x="390" y="155" fontSize="9" fill="#1f2937" className="font-medium pointer-events-none">
                    Karaganda
                  </text>
                  
                  {/* Pavlodar - North */}
                  <circle cx="420" cy="90" r="4" fill="#DC2626" className="cursor-pointer hover:fill-red-500 transition-colors">
                    <title>Pavlodar</title>
                  </circle>
                  <text x="430" y="85" fontSize="9" fill="#1f2937" className="font-medium pointer-events-none">
                    Pavlodar
                  </text>
                  
                  {/* Atyrau - West */}
                  <circle cx="50" cy="160" r="4" fill="#DC2626" className="cursor-pointer hover:fill-red-500 transition-colors">
                    <title>Atyrau</title>
                  </circle>
                  <text x="60" y="155" fontSize="9" fill="#1f2937" className="font-medium pointer-events-none">
                    Atyrau
                  </text>
                </g>
              </svg>
              
              {/* Map Legend */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Major Cities</h3>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span>Click to explore</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Grid Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discover the <span 
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
              >Cities of Kazakhstan</span>
            </h2>
          </div>

          {/* Featured City - Astana */}
          <div className="flex gap-6 mb-12">
            {/* Large landscape photo */}
            <div className="relative overflow-hidden rounded-2xl" style={{ width: '792px', height: '400px' }}>
              <Image
                src={cities[0]?.image || '/baiterek.jpg'}
                alt={cities[0]?.name || 'City'}
                width={792}
                height={400}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="text-white text-sm px-4 py-2 rounded-full font-medium" style={{ backgroundColor: '#F59E0B' }}>
                  {cities[0]?.category || 'Cities'}
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white text-3xl font-bold leading-tight">
                  {cities[0]?.name || 'City'}
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
                {cities[0]?.name || 'City'} {cities[0]?.subtitle && `— ${cities[0].subtitle}`}
              </h3>
              <p className="font-manrope flex-1" style={{
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '24px',
                letterSpacing: '-1%',
                color: '#4F504F',
                marginBottom: '32px'
              }}>
                {cities[0]?.description || 'Explore this amazing city.'}
              </p>
              <button 
                className="text-white font-manrope rounded-full self-start flex items-center justify-center"
                style={{
                  width: '124px',
                  height: '50px',
                  backgroundColor: '#009CBC',
                  padding: '13px 20px',
                  borderRadius: '99px',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '24px',
                  letterSpacing: '-2%'
                }}
              >
                Show more
              </button>
            </div>
          </div>

          {/* Cities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.slice(1).map((city: Destination) => (
              <Link key={city._id} href={`/cities/${city.slug}`}>
                <div className="relative overflow-hidden rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300" style={{ width: '384px', height: '400px' }}>
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
                      {city.category || 'Cities'}
                    </span>
                  </div>
                  
                  {/* Title at bottom */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white text-2xl font-bold leading-tight">
                      {city.name} {city.subtitle && `— ${city.subtitle}`}
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

export default CitiesPage