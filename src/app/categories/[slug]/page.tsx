'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { 
  ArrowLeft, 
  Facebook,
  Twitter,
  Copy,
  MapPin,
  Star
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';

// API client for getting category by slug and related tours
const publicCategoryApi = {
  getCategoryBySlug: async (slug: string) => {
    const response = await fetch(`http://localhost:5001/api/categories/public/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch category');
    return response.json();
  },
  
  getToursByCategory: async (categoryName?: string, limit?: number) => {
    const searchParams = new URLSearchParams();
    searchParams.append('status', 'PUBLISHED');
    if (limit) searchParams.append('limit', limit.toString());
    if (categoryName) searchParams.append('category', categoryName);
    
    const response = await fetch(`http://localhost:5001/api/tours/public?${searchParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch category tours');
    const data = await response.json();
    
    return { data: { tours: data?.data?.tours || [] } };
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
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Tour {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image: string;
  category: string;
  rating: number;
  date?: string;
  location?: string;
  price?: number;
  duration?: string;
  featured: boolean;
  status: string;
  createdAt: string;
}

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Fetch category
  const { 
    data: categoryData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => publicCategoryApi.getCategoryBySlug(slug),
    enabled: !!slug,
  });

  const category: Category = categoryData?.data?.category;

  // Fetch tours in this category
  const { data: toursData } = useQuery({
    queryKey: ['categoryTours', category?.name, slug],
    queryFn: () => publicCategoryApi.getToursByCategory(category?.name, 6),
    enabled: !!category,
  });

  const categoryTours = toursData?.data?.tours || [];

  const handleShare = async (platform: 'facebook' | 'twitter' | 'copy') => {
    const url = window.location.href;
    const title = category?.name || 'Check out this category';

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          toast.success('Link copied to clipboard!');
        } catch {
          toast.error('Failed to copy link');
        }
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-8">
              The category you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/categories" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Only show active categories to public
  if (category.status !== 'ACTIVE') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Available</h1>
            <p className="text-gray-600 mb-8">
              This category is not currently available.
            </p>
            <Link href="/categories" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Image with Title Overlay */}
      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[453px] rounded-lg overflow-hidden bg-gray-900">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <span className="text-white text-xl">No image available</span>
            </div>
          )}
          
          {/* Strong dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
          
          {/* Title overlay with strong contrast */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black text-white text-center leading-tight px-4 sm:px-8 max-w-5xl" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)'
            }}>
              {category.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {category.description && (
              <p className="text-xl text-black mb-8 leading-relaxed">
                {category.description}
              </p>
            )}
            
            <div className="prose prose-lg max-w-none prose-headings:!text-black prose-p:!text-black prose-a:text-blue-600 prose-strong:!text-black prose-li:!text-black prose-ul:!text-black prose-ol:!text-black">
              <h3>About This Category</h3>
              <p>
                Explore everything that {category.name} has to offer in Kazakhstan. From unique experiences 
                to must-visit destinations, this category brings together the best of what makes Kazakhstan 
                an incredible travel destination.
              </p>
              
              <h3>What to Expect</h3>
              <p>
                Whether you&apos;re planning your first visit or you&apos;re a seasoned traveler, {category.name} 
                offers something special for everyone. Discover carefully curated experiences that showcase 
                the authentic beauty and culture of Kazakhstan.
              </p>
            </div>
          </div>

          {/* Sidebar - Information Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Category Information</h3>
              
              <div className="space-y-6">
                {/* Category Type */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-sm font-medium">Category</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{category.name}</p>
                </div>

                {/* Tours Count */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">Available Tours</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{categoryTours.length} tours</p>
                </div>

                {/* Share Section */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Share Category</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="h-4 w-4 mr-2" />
                      Share on Facebook
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                    >
                      <Twitter className="h-4 w-4 mr-2" />
                      Share on Twitter
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Tours */}
      {categoryTours.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center sm:text-left">
              <span className="text-[#202020]" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(24px, 6vw, 48px)',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}>Tours in</span> <span 
                className="bg-gradient-to-r from-[#009CBC] to-[#FFE700] bg-clip-text text-transparent"
                style={{
                  background: 'linear-gradient(90deg, #009CBC 0%, #FFE700 154.07%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 400,
                  fontSize: 'clamp(24px, 6vw, 48px)',
                  lineHeight: '100%',
                  letterSpacing: '-4%'
                }}
              >{category.name}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryTours.slice(0, 6).map((tour: Tour) => (
                <Link key={tour.id} href={`/tours/${tour.slug}`}>
                  <Card className="overflow-hidden border-0 p-2 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200 h-full">
                    <div className="relative">
                      {tour.image ? (
                        <img
                          src={tour.image}
                          alt={tour.title}
                          className="w-full h-60 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-60 bg-gray-200 flex items-center justify-center rounded-lg">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {tour.date && (
                          <Badge className="bg-gray-800/80 text-white text-xs px-2 py-1">
                            📅 {tour.date}
                          </Badge>
                        )}
                        {tour.location && (
                          <Badge className="bg-gray-800/80 text-white text-xs px-2 py-1">
                            📍 {tour.location}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-2 text-[#202020]" style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 600,
                        fontSize: '20px',
                        lineHeight: '120%',
                        letterSpacing: '-1%'
                      }}>{tour.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2" style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '-1%'
                      }}>{tour.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[#009CBC] hover:text-[#007a9a] text-sm">
                          View tour →
                        </span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${
                              i < tour.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`} />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* View All Tours Button */}
            <div className="text-center mt-12">
              <Link 
                href={`/tours?category=${encodeURIComponent(category.name)}`}
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View All {category.name} Tours
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}