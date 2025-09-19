'use client'

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { contentApi, toursApi, categoriesApi } from '@/lib/api';


interface Tour {
  id: string;
  title: string;
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
          
          {/* Tab Navigation */}
          <div className="flex space-x-8 border-b border-gray-200">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.name)}
                className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === category.name
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tour Cards */}
        <div className="grid grid-cols-3 gap-8">
          {filteredTours.slice(0, 3).map((tour) => (
            <div key={tour.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image 
                  src={tour.image} 
                  alt={tour.title}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover"
                />
                {tour.date && (
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-gray-800 text-white px-3 py-1 rounded-md text-xs font-medium">
                      {tour.date}
                    </span>
                    {tour.location && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-md text-xs font-medium">
                        {tour.location}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                  {tour.title}
                </h3>
                {tour.description && (
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {tour.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {tour.price && (
                      <span className="text-lg font-semibold text-green-600">
                        ${tour.price}
                      </span>
                    )}
                    {tour.duration && (
                      <span className="text-sm text-gray-500">
                        {tour.duration}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < tour.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                
                <button className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                  View Details
                </button>
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