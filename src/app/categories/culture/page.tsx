'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const CulturePage = () => {
  const [activeTab, setActiveTab] = useState('Now')

  const tabs = ['Then', 'Now']

  const cultureCategories = {
    'Now': [
      {
        id: 1,
        name: 'Astana — The Bold & Futuristic Capital',
        description: 'Sleek skyscrapers and avant-garde architecture define Astana. Visit the Astana Opera, National Museum, and Nur Alem Sphere from EXPO 2017. The city hosts cultural forums, design events, and digital art festivals.',
        image: '/images/culture/astana-modern.jpg',
        category: 'Culture',
        slug: 'astana-culture',
        featured: true
      },
      {
        id: 2,
        name: 'Almaty — The Creative Soul',
        description: 'Street art, fashion studios, coffee culture, and live music — explore Almaty\'s youthful soul.',
        image: '/images/culture/almaty-creative.jpg',
        category: 'Culture',
        slug: 'almaty-creative'
      },
      {
        id: 3,
        name: 'Art, Fashion & Media',
        description: 'Contemporary galleries, fashion weeks, and media production hubs across major cities.',
        image: '/images/culture/art-fashion.jpg',
        category: 'Culture',
        slug: 'art-fashion-media'
      },
      {
        id: 4,
        name: 'Theater & Cinema',
        description: 'Modern theater productions, film festivals, and cinematic experiences.',
        image: '/images/culture/theater-cinema.jpg',
        category: 'Culture',
        slug: 'theater-cinema'
      },
      {
        id: 5,
        name: 'Modern Spirituality & Identity',
        description: 'Contemporary expressions of faith and cultural identity in modern Kazakhstan.',
        image: '/images/culture/modern-spirituality.jpg',
        category: 'Culture',
        slug: 'modern-spirituality'
      }
    ],
    'Then': [
      {
        id: 6,
        name: 'Life in the Steppe',
        description: 'The heart of Kazakh culture beats in the rhythms of nomadic life — yurt living, horse racing, eagle hunting, and deep-rooted hospitality.',
        image: '/images/culture/steppe-life.jpg',
        category: 'Culture',
        slug: 'life-in-steppe',
        featured: true
      },
      {
        id: 7,
        name: 'Music & Instruments',
        description: 'Traditional dombra music, epic songs, and the rich musical heritage of the nomadic peoples.',
        image: '/images/culture/music-instruments.jpg',
        category: 'Culture',
        slug: 'music-instruments'
      },
      {
        id: 8,
        name: 'Cuisine',
        description: 'Traditional Kazakh dishes like beshbarmak, kumys, and the art of nomadic cooking.',
        image: '/images/culture/cuisine.jpg',
        category: 'Culture',
        slug: 'cuisine'
      },
      {
        id: 9,
        name: 'Spiritual & Festive Life',
        description: 'Ancient traditions, seasonal festivals, and spiritual practices of the Kazakh people.',
        image: '/images/culture/spiritual-life.jpg',
        category: 'Culture',
        slug: 'spiritual-life'
      },
      {
        id: 10,
        name: 'Crafts & Textiles',
        description: 'Traditional handicrafts, carpet weaving, and the intricate artistry of nomadic design.',
        image: '/images/culture/crafts-textiles.jpg',
        category: 'Culture',
        slug: 'crafts-textiles'
      },
      {
        id: 11,
        name: 'Tulip Heritage',
        description: 'The ancient connection between Kazakhstan and tulips, celebrated in spring festivals.',
        image: '/images/culture/tulip-heritage.jpg',
        category: 'Culture',
        slug: 'tulip-heritage'
      }
    ]
  }

  const currentCategories = cultureCategories[activeTab as keyof typeof cultureCategories] || []
  const featuredCategory = currentCategories.find(cat => cat.featured)
  const otherCategories = currentCategories.filter(cat => !cat.featured)

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/culture-hero.jpg"
            alt="Kazakhstan Culture"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            CULTURE
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            A Journey Through Time —
            <br />
            From Nomadic Roots to
            <br />
            <span className="text-purple-400">Modern Expression</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Kazakhstan&apos;s culture is a rich tapestry woven from centuries of nomadic life, Silk 
            Road exchanges, spiritual tradition, and modern innovation. From ancient steppe 
            rituals to jazz cafes in the city, culture here is not just preserved — it&apos;s alive and 
            evolving.
          </p>
        </div>
      </section>

      {/* Modern Urban Culture Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Modern <span className="text-teal-500">Urban Culture</span>
            </h2>
            
            {/* Tab Navigation */}
            <div className="flex justify-center gap-2 mb-12">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Category */}
          {featuredCategory && (
            <div className="mb-16">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="relative h-64 lg:h-auto">
                    <Image
                      src={featuredCategory.image}
                      alt={featuredCategory.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                        {featuredCategory.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      {featuredCategory.name}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {featuredCategory.description}
                    </p>
                    <Link
                      href={`/culture/${featuredCategory.slug}`}
                      className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 w-fit"
                    >
                      Plan your trip
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Culture Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {category.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {category.description}
                  </p>
                  <Link
                    href={`/culture/${category.slug}`}
                    className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 group"
                  >
                    Explore culture
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
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

export default CulturePage