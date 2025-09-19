import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const NaturePage = () => {
  const destinations = [
    {
      id: 1,
      name: 'Mangystau Region',
      description: 'A surreal desert meets seas region in the west, filled with chalk mountains, underground mosques, and alien-like rock formations. Visit Bozzhyra, Torysh (Valley of Balls), and Sherkala Mountain for a journey into a land that feels untouched by time.',
      image: '/mangystau.jpg',
      category: 'Nature',
      slug: 'mangystau-region',
      featured: true
    },
    {
      id: 2,
      name: 'Charyn Canyon',
      description: 'Kazakhstan\'s answer to the Grand Canyon, with dramatic red rock formations carved by millennia of erosion.',
      image: '/charyn.jpg',
      category: 'Nature',
      slug: 'charyn-canyon'
    },
    {
      id: 3,
      name: 'Lake Kaindy & Kolsai Lakes',
      description: 'Crystal-clear alpine lakes in the Tian Shan mountains, perfect for hiking and photography.',
      image: '/bao_contras.jpg',
      category: 'Nature',
      slug: 'kolsai-lakes'
    },
    {
      id: 4,
      name: 'Big Almaty Lake',
      description: 'Stunning turquoise lake nestled high in the mountains above Almaty city.',
      image: '/almaty.jpg',
      category: 'Nature',
      slug: 'big-almaty-lake'
    },
    {
      id: 5,
      name: 'Altyn-Emel National Park',
      description: 'Home to the famous Singing Dunes and diverse wildlife in a vast desert landscape.',
      image: '/desert.jpg',
      category: 'Nature',
      slug: 'altyn-emel'
    },
    {
      id: 6,
      name: 'Borovoe (Burabay)',
      description: 'Kazakhstan\'s "Switzerland" with pristine lakes, unique rock formations, and pine forests.',
      image: '/kanatnaya_doroga.jpg',
      category: 'Nature',
      slug: 'borovoe'
    },
    {
      id: 7,
      name: 'Tulip Fields in South Kazakhstan (Taraz & Shymkent)',
      description: 'Spectacular wildflower displays in spring, covering the steppes in vibrant colors.',
      image: '/yurta.jpg',
      category: 'Nature',
      slug: 'tulip-fields'
    }
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative flex justify-center py-8">
        <div className="flex gap-2 items-center">
          {/* Left Content */}
          <div className="w-[678px] h-[550px] bg-white rounded-lg px-20 py-16 flex flex-col justify-center">
            <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit">
              NATURE
            </div>
            <h1 className="text-[36px] font-bold text-gray-900 mb-6 leading-tight">
              Where Earth Tells Stories — Discover Kazakhstan&apos;s Wild Beauty
              <br />
            </h1>
            <p className="text-[14px] text-gray-600 leading-relaxed max-w-md">
              From the dramatic cliffs of Mangystau to the turquoise alpine lakes of the Tian 
              Shan, Kazakhstan&apos;s natural wonders are as vast and varied as the country itself. 
              Here, landscapes shift from singing sand dunes to ancient canyons, from flower-
              filled valleys to underwater forests. Whether you&apos;re hiking, stargazing, or simply 
              soaking in the silence — Kazakhstan&apos;s wild side is unforgettable.
            </p>
          </div>
          
          {/* Right Image */}
          <div className="w-[674px] h-[550px] rounded-lg overflow-hidden">
            <Image
              src="/mangystau.jpg"
              alt="Kazakhstan Nature"
              width={674}
              height={550}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      </section>


      {/* Top Natural Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12">
            <h2 className="mb-4">
              <span className="text-[#202020]" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: '48px',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}>Top Natural</span> <span 
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
              >Destinations</span>
            </h2>
          </div>

          {/* Featured section with large photo and card */}
          <div className="flex gap-6 mb-12">
            {/* Large landscape photo */}
            <div className="relative overflow-hidden rounded-2xl" style={{ width: '792px', height: '400px' }}>
              <Image
                src="/mangystau.jpg"
                alt="Kazakhstan Nature Landscape"
                width={792}
                height={400}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-green-600 text-white text-sm px-4 py-2 rounded-full font-medium">
                  Nature
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white text-3xl font-bold leading-tight">
                  Mangystau Region
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
                Mangystau Region
              </h3>
              <p className="font-manrope flex-1" style={{
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '24px',
                letterSpacing: '-1%',
                color: '#4F504F',
                marginBottom: '48px'
              }}>
                A surreal desert-meets-sea region in the west, filled with chalk mountains, underground mosques, and alien-like rock formations. Visit Bozzhyra, Torysh (Valley of Balls), and Sherkala Mountain for a journey into a land that feels untouched by time.
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
                Plan your trip
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.slice(2).map((destination) => (
              <Link key={destination.id} href={`/nature/${destination.slug}`}>
                <div className="relative overflow-hidden rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300" style={{ width: '384px', height: '400px' }}>
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    width={384}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  {/* Nature badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-600 text-white text-sm px-4 py-2 rounded-full font-medium">
                      {destination.category}
                    </span>
                  </div>
                  
                  {/* Title at bottom */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white text-2xl font-bold leading-tight">
                      {destination.name}
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

export default NaturePage