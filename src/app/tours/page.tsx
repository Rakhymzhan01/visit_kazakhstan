'use client'

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { contentApi, toursApi, categoriesApi } from '@/lib/api';


interface Tour {
  id: string;
  title: string;
  slug: string;
  image: string;
  rating: number;
  description?: string;
  date?: string;
  location?: string;
  category: string;
  price?: number;
  duration?: string;
  featured: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  featured: boolean;
}

interface ToursContent {
  hero: {
    title: string;
    description: string;
    badge: string;
  };
  sectionTitle: string;
}

const defaultToursContent: ToursContent = {
  hero: {
    title: "Find Your Way to Explore Kazakhstan",
    description: "Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you're chasing landscapes, culture, adventure, or spiritual meaning, there's a route for every traveler.",
    badge: "TOURS"
  },
  sectionTitle: "Top Tour Themes"
};

const ToursPage = () => {
  const [content, setContent] = useState<ToursContent>(defaultToursContent);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [activeTab, setActiveTab] = useState('');
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformApiContent = (apiContent: any[]): Partial<ToursContent> => {
    const transformed: Record<string, Record<string, unknown>> = {};
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiContent.forEach((item: any) => {
      if (!transformed[item.section]) {
        transformed[item.section] = {};
      }
      
      if (item.type === 'json') {
        try {
          transformed[item.section][item.key] = JSON.parse(item.value);
        } catch {
          transformed[item.section][item.key] = item.value;
        }
      } else {
        transformed[item.section][item.key] = item.value;
      }
    });
    
    return transformed;
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Load page content, categories, and tours in parallel
      const [contentResponse, categoriesResponse, toursResponse] = await Promise.all([
        contentApi.getPageContent('tours').catch(() => ({ data: { success: false } })),
        categoriesApi.getPublicCategories({ featured: true }).catch(() => ({ data: { success: false } })),
        toursApi.getPublicTours({ limit: 50 }).catch(() => ({ data: { success: false } }))
      ]);

      // Update content
      if (contentResponse.data.success && contentResponse.data.data?.content?.length > 0) {
        const transformedContent = transformApiContent(contentResponse.data.data.content);
        setContent({ ...defaultToursContent, ...transformedContent });
      }

      // Update categories
      if (categoriesResponse.data.success && categoriesResponse.data.data?.categories) {
        const loadedCategories = categoriesResponse.data.data.categories;
        setCategories(loadedCategories);
        if (loadedCategories.length > 0 && !activeTab) {
          setActiveTab(loadedCategories[0].name);
        }
      }

      // Update tours
      if (toursResponse.data.success && toursResponse.data.data?.tours) {
        setTours(toursResponse.data.data.tours);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter tours by active category
  const filteredTours = tours.filter(tour => tour.category === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-900">Loading tours...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative flex justify-center py-8">
        <div className="flex gap-2 items-center">
          {/* Left Content */}
          <div className="w-[678px] h-[550px] bg-white rounded-lg px-20 py-16 flex flex-col justify-center">
            <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit">
              {content.hero.badge}
            </div>
            <h1 className="text-[36px] font-bold text-gray-900 mb-6 leading-tight">
              {content.hero.title}
            </h1>
            <p className="text-[14px] text-gray-600 leading-relaxed max-w-md">
              {content.hero.description}
            </p>
          </div>
          
          {/* Right Image */}
          <div className="w-[674px] h-[550px] rounded-lg overflow-hidden">
            <Image 
              src="/tours.jpg" 
              alt="Traveler with backpack taking photo"
              width={674}
              height={550}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Tours Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="mb-8">
            <span className="text-[#202020]" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: '48px',
              lineHeight: '100%',
              letterSpacing: '-4%'
            }}>Top Tour</span> <span 
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
            >Themes</span>
          </h2>
          
          {/* Category Tabs Navigation */}
          <div className="flex space-x-8 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.name)}
                className={`pb-2 px-1 text-lg font-medium transition-colors border-b-2 ${
                  activeTab === category.name
                    ? 'border-[#009CBC] text-[#009CBC]'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: activeTab === category.name ? 600 : 400,
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tour Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.slice(0, 3).map((tour, index) => (
            <div key={tour.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="relative">
                <Image 
                  src={tour.image} 
                  alt={tour.title}
                  width={400}
                  height={300}
                  className="w-full h-[300px] object-cover"
                />
                
                {/* Date and Location Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {tour.date && (
                    <div className="flex items-center bg-black/80 text-white px-3 py-1.5 rounded-md">
                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">{tour.date}</span>
                    </div>
                  )}
                  {tour.location && (
                    <div className={`flex items-center text-white px-3 py-1.5 rounded-md ${
                      index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-blue-500' : 'bg-green-600'
                    }`}>
                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">{tour.location}</span>
                    </div>
                  )}
                </div>
                
                {/* Heart Icon (favorites) */}
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight" style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600
                }}>
                  {tour.title}
                </h3>
                
                {tour.description && (
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed" style={{
                    fontFamily: 'Manrope, sans-serif',
                    lineHeight: '1.6'
                  }}>
                    {tour.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <Link href={`/tours/${tour.slug}`} className="text-[#009CBC] hover:text-[#007a9a] font-medium text-sm transition-colors flex items-center" style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 500
                  }}>
                    Read more 
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  
                  {/* Star Rating */}
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
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

export default ToursPage;