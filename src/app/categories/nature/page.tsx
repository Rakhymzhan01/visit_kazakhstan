import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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
      image: '/images/nature/charyn-canyon.jpg',
      category: 'Nature',
      slug: 'charyn-canyon'
    },
    {
      id: 3,
      name: 'Lake Kaindy & Kolsai Lakes',
      description: 'Crystal-clear alpine lakes in the Tian Shan mountains, perfect for hiking and photography.',
      image: '/images/nature/kolsai-lakes.jpg',
      category: 'Nature',
      slug: 'kolsai-lakes'
    },
    {
      id: 4,
      name: 'Big Almaty Lake',
      description: 'Stunning turquoise lake nestled high in the mountains above Almaty city.',
      image: '/images/nature/big-almaty-lake.jpg',
      category: 'Nature',
      slug: 'big-almaty-lake'
    },
    {
      id: 5,
      name: 'Altyn-Emel National Park',
      description: 'Home to the famous Singing Dunes and diverse wildlife in a vast desert landscape.',
      image: '/images/nature/altyn-emel.jpg',
      category: 'Nature',
      slug: 'altyn-emel'
    },
    {
      id: 6,
      name: 'Borovoe (Burabay)',
      description: 'Kazakhstan\'s "Switzerland" with pristine lakes, unique rock formations, and pine forests.',
      image: '/images/nature/borovoe.jpg',
      category: 'Nature',
      slug: 'borovoe'
    },
    {
      id: 7,
      name: 'Tulip Fields in South Kazakhstan (Taraz & Shymkent)',
      description: 'Spectacular wildflower displays in spring, covering the steppes in vibrant colors.',
      image: '/images/nature/tulip-fields.jpg',
      category: 'Nature',
      slug: 'tulip-fields'
    }
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        <div className="flex gap-4 p-4">
          {/* Left Content */}
          <div className="w-[674px] h-[550px] bg-white rounded-lg shadow-lg px-20 py-16 flex flex-col justify-center">
            <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit">
              NATURE
            </div>
            <h1 className="text-[36px] font-bold text-gray-900 mb-6 leading-tight">
              Where Earth Tells Stories —
              <br />
              <span className="text-green-600">Discover Kazakhstan&apos;s Wild Beauty</span>
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
          <div className="w-[674px] h-[550px] rounded-lg overflow-hidden shadow-lg">
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

      {/* Featured Destination */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative h-64 lg:h-auto">
                <Image
                  src={destinations[0].image}
                  alt={destinations[0].name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {destinations[0].category}
                  </span>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {destinations[0].name}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {destinations[0].description}
                </p>
                <Link
                  href={`/nature/${destinations[0].slug}`}
                  className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 w-fit"
                >
                  Plan your trip
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Natural Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Top Natural <span className="text-green-600">Destinations</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.slice(1).map((destination) => (
              <div key={destination.id} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
                  <div className="p-6 lg:p-8 flex flex-col justify-center order-1 lg:order-1">
                    <div className="mb-4">
                      <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                        {destination.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {destination.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                      {destination.description}
                    </p>
                    <Link
                      href={`/nature/${destination.slug}`}
                      className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1 group w-fit"
                    >
                      Explore destination
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="relative h-48 lg:h-auto order-2 lg:order-2 rounded-r-3xl overflow-hidden">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
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