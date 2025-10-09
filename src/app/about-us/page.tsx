'use client'

import React from 'react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { aboutUsApi } from '@/lib/api'

// Types
interface AboutUsData {
  aboutDescription: string;
  stats: Array<{
    value: string;
    description: string;
    order: number;
  }>;
  teamMembers: Array<{
    name: string;
    position: string;
    image: string;
    order: number;
  }>;
  teamDescription: string;
  contact: {
    address: {
      street: string;
      city: string;
      country: string;
    };
    phone: string;
    email: string;
    mapImage: string;
  };
}

// About Section Component
const AboutSection = ({ aboutData }: { aboutData?: AboutUsData }) => {
  const sortedStats = aboutData?.stats?.sort((a, b) => a.order - b.order) || [];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div>
            {/* Static heading "About Us" - Do not change */}
            <h2 className="mb-6 text-center sm:text-left">
              <span className="text-[#202020]" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(24px, 6vw, 48px)',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}>About</span> <span 
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
              >us</span>
            </h2>
            {/* Dynamic description */}
            <p className="text-lg text-gray-600 leading-relaxed">
              {aboutData?.aboutDescription || "Loading about description..."}
            </p>
          </div>

          {/* Stats Grid - Dynamic content */}
          <div className="w-full max-w-lg mx-auto lg:max-w-none lg:w-[588px] h-auto lg:h-[476px] relative">
            {/* Staggered layout */}
            {sortedStats.slice(0, 4).map((stat, index) => {
              const positions = [
                { top: 0, left: 0 },
                { top: 60, left: 306 },
                { top: 220, left: 0 },
                { top: 280, left: 306 }
              ];
              
              return (
                <div 
                  key={stat.order}
                  className={`bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 lg:mb-0 ${
                    index < 4 ? 'lg:absolute' : ''
                  } w-full max-w-[282px] h-auto min-h-[196px]`}
                  style={index < 4 ? {
                    top: positions[index].top,
                    left: positions[index].left
                  } : {}}
                >
                  <div className="text-[#009CBC] mb-3 font-montserrat" style={{
                    fontWeight: 600,
                    fontSize: 'clamp(32px, 8vw, 50px)',
                    lineHeight: '100%',
                    letterSpacing: '-4%'
                  }}>{stat.value}</div>
                  <p className="text-gray-600 font-manrope" style={{
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '150%',
                    letterSpacing: '-1%'
                  }}>{stat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

// Team Section Component
const TeamSection = ({ aboutData }: { aboutData?: AboutUsData }) => {
  const sortedTeamMembers = aboutData?.teamMembers?.sort((a, b) => a.order - b.order) || [];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Static section header "Our Team" - Do not change */}
        <div className="text-center mb-12">
          <h2 className="mb-4">
            <span className="text-[#202020]" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(24px, 6vw, 48px)',
              lineHeight: '100%',
              letterSpacing: '-4%'
            }}>Our</span> <span 
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
            >Team</span>
          </h2>
        </div>

        {/* Dynamic Team Grid */}
        <div className="overflow-x-auto scrollbar-hide mb-12">
          <div className="flex gap-4 sm:gap-6 lg:gap-8 pb-4" style={{ width: 'max-content' }}>
            {sortedTeamMembers.map((member, index) => (
              <div key={`${member.name}-${index}`} className="group cursor-pointer flex-shrink-0">
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={300}
                    height={400}
                    className="object-cover group-hover:scale-105 transition-transform duration-300 w-[250px] h-[320px] sm:w-[280px] sm:h-[360px] lg:w-[300px] lg:h-[400px]"
                  />
                  {/* Overlay with name and position */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4">
                    <h3 className="text-[#202020] mb-1" style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 600,
                      fontSize: '20px',
                      lineHeight: '100%',
                      letterSpacing: '-2%'
                    }}>{member.name}</h3>
                    <p className="text-gray-600 text-sm">{member.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic team description */}
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed">
            {aboutData?.teamDescription || "Loading team description..."}
          </p>
        </div>
      </div>
    </section>
  )
}

// Visit Kazakhstan Location Section with Map
const VisitKazakhstanSection = ({ aboutData }: { aboutData?: AboutUsData }) => {
  const contact = aboutData?.contact;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left side - Contact Info */}
          <div>
            {/* Static heading "Visit Kazakhstan" - Do not change */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#202020] mb-8">
              Visit <span className="text-[#009CBC]">Kazakhstan</span>
            </h2>
            
            {/* Address Section */}
            <div className="space-y-6">
              <div>
                {/* Static "ADDRESS" heading - Do not change */}
                <h3 className="text-xl font-semibold text-[#202020] mb-4">ADDRESS</h3>
                {/* Dynamic address content */}
                <p className="text-gray-600 leading-relaxed">
                  {contact ? (
                    <>
                      {contact.address.street},<br />
                      {contact.address.city}, {contact.address.country}
                    </>
                  ) : (
                    "Loading address..."
                  )}
                </p>
              </div>

              {/* Dynamic contact info */}
              <div className="space-y-4">
                <div>
                  <a 
                    href={`tel:${contact?.phone || ''}`}
                    className="text-[#202020] font-semibold text-xl hover:text-[#009CBC] transition-colors"
                  >
                    {contact?.phone || "Loading phone..."}
                  </a>
                </div>
                
                <div>
                  <a 
                    href={`mailto:${contact?.email || ''}`}
                    className="text-gray-600 hover:text-[#009CBC] transition-colors"
                  >
                    {contact?.email || "Loading email..."}
                  </a>
                </div>
              </div>

              {/* Get Directions Button */}
              <div className="pt-4">
                <button className="bg-[#009CBC] hover:bg-[#007A9A] text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                  Get directions
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Dynamic Map */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden h-96">
              <Image
                src={contact?.mapImage || "/map.png"}
                alt="Kazakhstan Map"
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Main Page Component
export default function AboutUsPage() {
  // Fetch About Us content from API
  const { 
    data: aboutUsData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['aboutus'],
    queryFn: async () => {
      const response = await aboutUsApi.getPublicAboutUs();
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-gray-900">Loading about us content...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-lg text-red-600 mb-2">Failed to load content</div>
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AboutSection aboutData={aboutUsData} />
      <TeamSection aboutData={aboutUsData} />
      <VisitKazakhstanSection aboutData={aboutUsData} />
      <Footer />
    </div>
  )
}