'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Create a simple API client for public category endpoints
const publicCategoryApi = {
  getCategories: async (params?: { featured?: boolean; limit?: number }) => {
    const searchParams = new URLSearchParams();
    
    // Only get active categories for public view
    searchParams.append('status', 'ACTIVE');
    
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const response = await fetch(`http://localhost:5001/api/categories/public?${searchParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }
};

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  featured: boolean;
  status: string;
  displayOrder: number;
  createdAt: string;
}

export default function CategoriesPage() {
  // Fetch published categories
  const { 
    data: categoriesData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['publicCategories'],
    queryFn: () => publicCategoryApi.getCategories({
      limit: 20
    }),
  });

  const categories = categoriesData?.data?.categories || [];
  const featuredCategory = categories.find((category: Category) => category.featured);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !categories.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">No Categories Found</h1>
            <p className="text-gray-600 mb-8">
              Categories are not available at the moment.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative flex justify-center py-8 bg-gray-50">
        <div className="flex gap-2 items-center">
          {/* Left Content */}
          <div className="w-[678px] h-[550px] bg-white rounded-lg px-20 py-16 flex flex-col justify-center">
            <div className="inline-block text-white px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit" style={{ backgroundColor: '#009CBC' }}>
              CATEGORIES
            </div>
            <h1 className="text-[36px] font-bold text-gray-900 mb-6 leading-tight">
              Explore Kazakhstan by Category — Find Your Perfect Adventure
            </h1>
            <p className="text-[14px] text-gray-600 leading-relaxed max-w-md">
              From pristine nature escapes to rich cultural experiences, discover Kazakhstan through our carefully curated categories. Each category offers unique adventures and unforgettable memories waiting to be explored.
            </p>
          </div>
          
          {/* Right Image */}
          <div className="w-[674px] h-[550px] rounded-lg overflow-hidden">
            <Image 
              src="/categories-hero.jpg" 
              alt="Kazakhstan Categories"
              width={674}
              height={550}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Featured Category Section */}
      {featuredCategory && (
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8">
              <span className="text-[#202020]" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: '48px',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}>Featured</span> <span 
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
              >Category</span>
            </h2>

            <Link href={`/categories/${featuredCategory.slug}`}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <div className="relative">
                  {featuredCategory.image ? (
                    <Image
                      src={featuredCategory.image}
                      alt={featuredCategory.name}
                      width={1200}
                      height={400}
                      className="w-full h-[400px] object-cover"
                    />
                  ) : (
                    <div className="w-full h-[400px] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-gray-400 text-xl">No image available</span>
                    </div>
                  )}
                  
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full font-medium">
                      Featured
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{featuredCategory.name}</h3>
                  {featuredCategory.description && (
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                      {featuredCategory.description}
                    </p>
                  )}
                  <span className="text-[#009CBC] hover:text-[#007a9a] font-medium text-lg">
                    Explore this category →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* All Categories Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12">
            <span className="text-[#202020]" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: '48px',
              lineHeight: '100%',
              letterSpacing: '-4%'
            }}>All</span> <span 
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
            >Categories</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category: Category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full">
                  <div className="relative">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={400}
                        height={240}
                        className="w-full h-60 object-cover"
                      />
                    ) : (
                      <div className="w-full h-60 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    
                    {category.featured && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-yellow-500 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3" style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 600
                    }}>
                      {category.name}
                    </h3>
                    
                    {category.description && (
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3" style={{
                        fontFamily: 'Manrope, sans-serif',
                        lineHeight: '1.6'
                      }}>
                        {category.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[#009CBC] hover:text-[#007a9a] font-medium text-sm transition-colors">
                        Explore category →
                      </span>
                      <div className="text-xs text-gray-400">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}