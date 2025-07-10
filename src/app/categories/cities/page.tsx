import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const CitiesPage = () => {
  const cities = [
    {
      id: 1,
      name: 'Astana',
      subtitle: 'Bold, Visionary, Futuristic',
      description: 'Kazakhstan\'s capital rises from the steppe with ambition and style. Known for its striking architecture — the Bayterek Tower, Khan Shatyr, and Nur Alem Sphere — Astana is a hub for politics, business, and innovation. Museums, concert halls, and festivals make it a symbol of a forward-looking nation.',
      image: '/images/cities/astana.jpg',
      category: 'Cities',
      slug: 'astana'
    },
    {
      id: 2,
      name: 'Almaty',
      subtitle: 'Green, Cultural, Creative',
      description: 'The cultural and creative heart of Kazakhstan, nestled in the foothills of the majestic Tian Shan mountains. Former capital with rich history, vibrant arts scene, and gateway to natural wonders.',
      image: '/images/cities/almaty.jpg',
      category: 'Cities',
      slug: 'almaty'
    },
    {
      id: 3,
      name: 'Turkestan',
      subtitle: 'Sacred & Historic',
      description: 'Ancient spiritual center and UNESCO World Heritage site, home to the magnificent Mausoleum of Khoja Ahmed Yasawi and centuries of Islamic architecture.',
      image: '/images/cities/turkestan.jpg',
      category: 'Cities',
      slug: 'turkestan'
    },
    {
      id: 4,
      name: 'Shymkent',
      subtitle: 'Southern Flavor & Tulip Capital',
      description: 'Kazakhstan\'s southern gateway, rich in tradition and known as the tulip capital. A vibrant mix of modern development and traditional Central Asian culture.',
      image: '/images/cities/shymkent.jpg',
      category: 'Cities',
      slug: 'shymkent'
    },
    {
      id: 5,
      name: 'Aktau & Mangystau',
      subtitle: 'Caspian Port & Martian Landscapes',
      description: 'Coastal city on the Caspian Sea surrounded by otherworldly desert landscapes, underground mosques, and unique geological formations.',
      image: '/images/cities/aktau.jpg',
      category: 'Cities',
      slug: 'aktau-mangystau'
    },
    {
      id: 6,
      name: 'Oskemen',
      subtitle: 'Mountain Gateway',
      description: 'Eastern Kazakhstan\'s cultural center, gateway to the Altai Mountains and rich in mining heritage and natural beauty.',
      image: '/images/cities/oskemen.jpg',
      category: 'Cities',
      slug: 'oskemen'
    },
    {
      id: 7,
      name: 'Taraz',
      subtitle: 'Ancient City of Traders',
      description: 'One of Kazakhstan\'s oldest cities, a key stop on the ancient Silk Road with rich archaeological heritage and trading history.',
      image: '/images/cities/taraz.jpg',
      category: 'Cities',
      slug: 'taraz'
    },
    {
      id: 8,
      name: 'Karaganda',
      subtitle: 'Industrial Heritage',
      description: 'Major industrial center with a unique Soviet-era architecture and important role in Kazakhstan\'s mining and space program history.',
      image: '/images/cities/karaganda.jpg',
      category: 'Cities',
      slug: 'karaganda'
    },
    {
      id: 9,
      name: 'Pavlodar',
      subtitle: 'Northern Industry',
      description: 'Industrial city on the Irtysh River, known for its petrochemical industry and as a gateway to northern Kazakhstan\'s natural areas.',
      image: '/images/cities/pavlodar.jpg',
      category: 'Cities',
      slug: 'pavlodar'
    },
    {
      id: 10,
      name: 'Atyrau',
      subtitle: 'Oil Capital',
      description: 'Kazakhstan\'s oil capital at the mouth of the Ural River, where Europe meets Asia, with modern development and Caspian Sea access.',
      image: '/images/cities/atyrau.jpg',
      category: 'Cities',
      slug: 'atyrau'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/cities-hero.jpg"
            alt="Kazakhstan Cities"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            CITIES
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            From Silk Road Settlements
            <br />
            to Modern Metropolises
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Kazakhstan&apos;s culture is a rich tapestry woven from centuries of nomadic life, Silk 
            Road exchanges, spiritual tradition, and modern innovation. From ancient steppe 
            rituals to jazz cafes in the city, culture here is not just preserved — it&apos;s alive and 
            evolving.
          </p>
        </div>
      </section>

      {/* Cities Grid Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discover the <span className="text-teal-500">Cities</span> of Kazakhstan
            </h2>
          </div>

          {/* Featured City - Astana */}
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src={cities[0].image}
                    alt={cities[0].name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {cities[0].category}
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {cities[0].name} — {cities[0].subtitle}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {cities[0].description}
                  </p>
                  <Link
                    href={`/cities/${cities[0].slug}`}
                    className="inline-flex items-center bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 w-fit"
                  >
                    Show more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Cities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cities.slice(1).map((city) => (
              <div key={city.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {city.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h4 className="text-lg font-bold mb-1">{city.name}</h4>
                    <p className="text-sm text-white/90">{city.subtitle}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {city.name} — {city.subtitle}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {city.description}
                  </p>
                  <Link
                    href={`/cities/${city.slug}`}
                    className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 group"
                  >
                    Explore {city.name}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default CitiesPage