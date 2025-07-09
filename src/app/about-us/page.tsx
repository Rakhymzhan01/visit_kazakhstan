import React from 'react'
import Image from 'next/image'
import Header from '../components/Header'
import Footer from '../components/Footer'

// About Section Component
export const AboutSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#202020] mb-6">
              About <span className="text-[#009CBC]">us</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Kazakhstan is vast and diverse — and so are the ways to experience 
              it. Whether you&apos;re chasing landscapes, culture, adventure, or 
              spiritual meaning, there&apos;s a route for every traveler.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-[#009CBC] mb-2">2010</div>
              <p className="text-gray-600">
                Year we started our journey to showcase Kazakhstan&apos;s beauty.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-[#009CBC] mb-2">50+</div>
              <p className="text-gray-600">
                Unique destinations across Kazakhstan waiting to be explored.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-[#009CBC] mb-2">1000+</div>
              <p className="text-gray-600">
                Happy travelers who discovered Kazakhstan with us.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-[#009CBC] mb-2">20</div>
              <p className="text-gray-600">
                Years of experience in Kazakhstan tourism industry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Stats Section Component  
export const StatsSection = () => {
  const stats = [
    { number: '2010', label: 'Year Founded', description: 'Started our mission to promote Kazakhstan tourism globally.' },
    { number: '50+', label: 'Tour Destinations', description: 'Carefully curated destinations showcasing Kazakhstan&apos;s diversity.' },
    { number: '1000+', label: 'Happy Travelers', description: 'Satisfied customers who experienced Kazakhstan&apos;s wonders.' },
    { number: '20', label: 'Years Experience', description: 'Two decades of expertise in Kazakhstan travel and tourism.' }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-5xl font-bold text-[#009CBC] mb-4">{stat.number}</div>
              <h3 className="text-xl font-semibold text-[#202020] mb-2">{stat.label}</h3>
              <p className="text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Team Section Component
export const TeamSection = () => {
  const teamMembers = [
    {
      name: 'Aida Nazarbayeva',
      position: 'Tourism Director',
      image: '/images/team/aida.jpg'
    },
    {
      name: 'Nurlan Suleimenov',
      position: 'Cultural Guide Expert',
      image: '/images/team/nurlan.jpg'
    },
    {
      name: 'Aigerim Tokayeva',
      position: 'Adventure Tour Specialist',
      image: '/images/team/aigerim.jpg'
    },
    {
      name: 'Daniyar Bekmuratov',
      position: 'Photography Coordinator',
      image: '/images/team/daniyar.jpg'
    },
    {
      name: 'Saltanat Amanova',
      position: 'Customer Experience Manager',
      image: '/images/team/saltanat.jpg'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#202020] mb-4">
            Our <span className="text-[#009CBC]">Team</span>
          </h2>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-4 overflow-hidden rounded-2xl">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={250}
                  height={300}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold text-[#202020] mb-1">{member.name}</h3>
              <p className="text-gray-600">{member.position}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed">
            Kazakhstan is vast and diverse — and so are the ways to experience it. Whether 
            you&apos;re chasing landscapes, culture, adventure, or spiritual meaning, there&apos;s a 
            route for every traveler.
          </p>
        </div>
      </div>
    </section>
  )
}

// Main Page Component
export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AboutSection />
      <StatsSection />
      <TeamSection />
      <Footer />
    </div>
  )
}