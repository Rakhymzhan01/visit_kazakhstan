'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TravelWebsite = () => {
  const [activeCategory, setActiveCategory] = useState('Lorem ipsum');

  const categories = ['Lorem ipsum', 'Lorem ipsum1', 'Lorem ipsum2', 'Lorem ipsum3'];
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-md text-sm font-medium inline-block mb-6">
                BLOG
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc molestie lobortis sit velit venenatis, neque aliquam arcu mattis.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-lg h-96 overflow-hidden">
                <Image
                  src="/blog/49c8567c6f05a91d4f398f427407312baef1ffe4.jpg"
                  alt="Travel Planning"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8">
            {categories.map((category) => (
              <button 
                key={category}
                onClick={() => setActiveCategory(category)}
                className="text-center hover:opacity-80 transition-all duration-300"
              >
                <div className={`font-medium ${activeCategory === category ? 'text-gray-900' : 'text-gray-500'}`}>
                  {category}
                </div>
                {activeCategory === category && (
                  <div className="w-16 h-1 bg-orange-400 mx-auto mt-2"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Company Cards */}
            {[
              { name: 'Biffco Enterprises Ltd.', category: 'Culture', date: '20 may 2025' },
              { name: 'Barone LLC.', category: 'Culture', date: '20 may 2025' },
              { name: 'Acme Co.', category: 'Culture', date: '20 may 2025' },
              { name: 'Abstergo Ltd.', category: 'Culture', date: '20 may 2025' },
              { name: 'Binford Ltd.', category: 'Culture', date: '20 may 2025' },
              { name: 'Big Kahuna Burger Ltd.', category: 'Culture', date: '20 may 2025' },
            ].map((company, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="bg-gray-200 h-48 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                      <p className="text-sm">Company Image</p>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      📅 {company.date}
                    </span>
                    <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      {company.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {company.name}
                  </h3>
                  <Link href="#" className="text-blue-500 hover:text-blue-600 font-medium text-sm">
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-teal-600">@info.kazakhstan</h2>
            <p className="text-gray-600 mt-2">
              Kazakhstan is vast and diverse - and so are the ways to experience it. Whether you're chasing landscapes, culture, adventure, or spiritual meaning, there's a route for every traveler.
            </p>
            <Link href="#" className="text-teal-500 hover:text-teal-600 mt-4 inline-block">
              See Instagram
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="relative group">
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="text-gray-400 text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                    <p className="text-sm">Instagram Image {item}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TravelWebsite;