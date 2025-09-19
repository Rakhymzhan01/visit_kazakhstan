import React from 'react'
import Image from 'next/image'
import Header from '../components/Header'
import Footer from '../components/Footer'

// About Section Component
const AboutSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div>
            <h2 className="mb-6">
              <span className="text-[#202020]" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: '48px',
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
                  fontSize: '48px',
                  lineHeight: '100%',
                  letterSpacing: '-4%'
                }}
              >us</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Kazakhstan is vast and diverse — and so are the ways to experience 
              it. Whether you&apos;re chasing landscapes, culture, adventure, or 
              spiritual meaning, there&apos;s a route for every traveler.
            </p>
          </div>

          {/* Stats Grid - Same as Home Page */}
          <div style={{ 
            width: '588px', 
            height: '476px',
            position: 'relative'
          }}>
            {/* Staggered layout */}
            <div className="bg-white rounded-lg shadow-sm p-6" style={{ 
              position: 'absolute',
              top: '0px',
              left: '0px',
              width: '282px', 
              height: '196px' 
            }}>
              <div className="text-[#009CBC] mb-3 font-montserrat" style={{
                fontWeight: 600,
                fontSize: '50px',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}>2010</div>
              <p className="text-gray-600 font-manrope" style={{
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '150%',
                letterSpacing: '-1%'
              }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6" style={{ 
              position: 'absolute',
              top: '60px',
              left: '306px',
              width: '282px', 
              height: '196px' 
            }}>
              <div className="text-[#009CBC] mb-3 font-montserrat" style={{
                fontWeight: 600,
                fontSize: '50px',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}>50+</div>
              <p className="text-gray-600 font-manrope" style={{
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '150%',
                letterSpacing: '-1%'
              }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6" style={{ 
              position: 'absolute',
              top: '220px',
              left: '0px',
              width: '282px', 
              height: '196px' 
            }}>
              <div className="text-[#009CBC] mb-3 font-montserrat" style={{
                fontWeight: 600,
                fontSize: '50px',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}>1000+</div>
              <p className="text-gray-600 font-manrope" style={{
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '150%',
                letterSpacing: '-1%'
              }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6" style={{ 
              position: 'absolute',
              top: '280px',
              left: '306px',
              width: '282px', 
              height: '196px' 
            }}>
              <div className="text-[#009CBC] mb-3 font-montserrat" style={{
                fontWeight: 600,
                fontSize: '50px',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}>20</div>
              <p className="text-gray-600 font-manrope" style={{
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '150%',
                letterSpacing: '-1%'
              }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Team Section Component - Exact Figma Match
const TeamSection = () => {
  const teamMembers = [
    {
      name: 'Darlene Robertson',
      position: 'Marketing Coordinator',
      image: '/team/4838ebf99f5d3b04e54d4bda4b727af5ea1e799c.png'
    },
    {
      name: 'Annette Black',
      position: 'President of Sales',
      image: '/team/0d57fbe1ccda59febd767fcdce533d97448fc201.png'
    },
    {
      name: 'Guy Hawkins',
      position: 'Nursing Assistant',
      image: '/team/772ad5a28014d2afa8904da5a2b103415f00c620.png'
    },
    {
      name: 'Jane Cooper',
      position: 'Medical Assistant',
      image: '/team/87c4fa29ccd407339492099a0753c544ac923c3d.png'
    },
    {
      name: 'Arlene McCoy',
      position: 'Web Designer',
      image: '/team/ac3097d85855fb2e2d9ee42dceff5f098abc3b17.png'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="mb-4">
            <span className="text-[#202020]" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: '48px',
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
                fontSize: '48px',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}
            >Team</span>
          </h2>
        </div>

        {/* Team Grid */}
        <div className="overflow-x-auto scrollbar-hide mb-12">
          <div className="flex gap-8 pb-4" style={{ width: 'max-content' }}>
            {teamMembers.map((member, index) => (
              <div key={index} className="group cursor-pointer flex-shrink-0">
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={300}
                    height={400}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    style={{ width: '300px', height: '400px' }}
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

// Visit Kazakhstan Location Section with Map - Exact Figma Match
const VisitKazakhstanSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left side - Contact Info */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#202020] mb-8">
              Visit <span className="text-[#009CBC]">Kazakhstan</span>
            </h2>
            
            {/* Address Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[#202020] mb-4">ADDRESS</h3>
                <p className="text-gray-600 leading-relaxed">
                  4517 Washington Ave, Manchester,<br />
                  Kentucky 39495
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <div>
                  <a 
                    href="tel:+77078005060" 
                    className="text-[#202020] font-semibold text-xl hover:text-[#009CBC] transition-colors"
                  >
                    +77078005060
                  </a>
                </div>
                
                <div>
                  <a 
                    href="mailto:info@visitkazakhstan.com"
                    className="text-gray-600 hover:text-[#009CBC] transition-colors"
                  >
                    info@visitkazakhstan.com
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

          {/* Right side - Map */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden h-96">
              <Image
                src="/map.png"
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
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AboutSection />
      <TeamSection />
      <VisitKazakhstanSection />
      <Footer />
    </div>
  )
}