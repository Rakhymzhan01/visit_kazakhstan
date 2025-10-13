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

// API client for getting tour by slug
const publicTourApi = {
  getTourBySlug: async (slug: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://intokazakhstan.com/api'}/tours/public/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch tour');
    return response.json();
  },
  
  getRelatedTours: async (category?: string, currentSlug?: string) => {
    const searchParams = new URLSearchParams();
    searchParams.append('status', 'PUBLISHED');
    searchParams.append('limit', '3');
    if (category) searchParams.append('category', category);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://intokazakhstan.com/api'}/tours/public?${searchParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch related tours');
    const data = await response.json();
    
    // Filter out current tour
    const tours = data?.data?.tours?.filter((tour: Tour) => tour.slug !== currentSlug) || [];
    return { data: { tours } };
  }
};

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
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  seoTitle?: string;
  seoDescription?: string;
  gallery?: string[];
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: Array<{
    day: number;
    title: string;
    description: string;
    activities: string[];
  }>;
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  views?: number;
}

export default function TourDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Fetch tour
  const { 
    data: tourData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['tour', slug],
    queryFn: () => publicTourApi.getTourBySlug(slug),
    enabled: !!slug,
  });

  const tour: Tour = tourData?.data?.tour;

  // Fetch related tours
  const { data: relatedData } = useQuery({
    queryKey: ['relatedTours', tour?.category, slug],
    queryFn: () => publicTourApi.getRelatedTours(tour?.category, slug),
    enabled: !!tour,
  });

  const relatedTours = relatedData?.data?.tours || [];

  const handleShare = async (platform: 'facebook' | 'twitter' | 'copy') => {
    const url = window.location.href;
    const title = tour?.title || 'Check out this tour';

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

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Tour Not Found</h1>
            <p className="text-gray-600 mb-8">
              The tour you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/tours" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tours
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Only show published tours to public
  if (tour.status !== 'PUBLISHED') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Tour Not Available</h1>
            <p className="text-gray-600 mb-8">
              This tour is not currently published.
            </p>
            <Link href="/tours" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tours
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
        <div className="relative w-full h-[453px] rounded-lg overflow-hidden bg-gray-900">
          {tour.image ? (
            <img
              src={tour.image}
              alt={tour.title}
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
            <h1 className="text-4xl lg:text-6xl font-black text-white text-center leading-tight px-8 max-w-5xl" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)'
            }}>
              {tour.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {tour.description && (
              <p className="text-xl text-black mb-8 leading-relaxed">
                {tour.description}
              </p>
            )}
            
            {/* Tour Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Highlights</h3>
                <ul className="space-y-2">
                  {tour.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What's Included */}
            {tour.inclusions && tour.inclusions.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">What&apos;s Included</h3>
                <ul className="space-y-2">
                  {tour.inclusions.map((inclusion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">{inclusion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What's Not Included */}
            {tour.exclusions && tour.exclusions.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">What&apos;s Not Included</h3>
                <ul className="space-y-2">
                  {tour.exclusions.map((exclusion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-600 mr-2">×</span>
                      <span className="text-gray-700">{exclusion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Itinerary</h3>
                <div className="space-y-6">
                  {tour.itinerary.map((day) => (
                    <div key={day.day} className="border-l-4 border-blue-600 pl-6">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        Day {day.day}: {day.title}
                      </h4>
                      <p className="text-gray-700 mb-3">{day.description}</p>
                      {day.activities && day.activities.length > 0 && (
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {day.activities.map((activity, index) => (
                            <li key={index}>{activity}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Information Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Tour Information</h3>
              
              <div className="space-y-6">
                {/* Location */}
                {tour.location && (
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Location</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{tour.location}</p>
                  </div>
                )}

                {/* Type (Category) */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-sm font-medium">Type</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{tour.category}</p>
                </div>


                {/* Share Section */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Share Tour</h4>
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
      {relatedTours.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8">
              <span className="text-[#202020]" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: '48px',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}>Related</span> <span 
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
              >Tours</span>
            </h2>

            <div className="flex gap-6">
              {relatedTours.slice(0, 3).map((relatedTour: Tour) => (
                <Link key={relatedTour.id} href={`/tours/${relatedTour.slug}`}>
                  <Card className="overflow-hidden flex-shrink-0 border-0 p-2 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200" style={{
                    width: '384px',
                    height: '506px'
                  }}>
                    <div className="relative">
                      {relatedTour.image ? (
                        <img
                          src={relatedTour.image}
                          alt={relatedTour.title}
                          className="w-full object-cover rounded-lg"
                          style={{
                            width: '368px',
                            height: '260px'
                          }}
                        />
                      ) : (
                        <div className="w-full bg-gray-200 flex items-center justify-center rounded-lg" style={{
                          width: '368px',
                          height: '260px'
                        }}>
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {relatedTour.date && (
                          <Badge className="bg-gray-800/80 text-white text-xs px-2 py-1">
                            📅 {relatedTour.date}
                          </Badge>
                        )}
                        {relatedTour.location && (
                          <Badge className="bg-gray-800/80 text-white text-xs px-2 py-1">
                            📍 {relatedTour.location}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-2 text-[#202020]" style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 600,
                        fontSize: '24px',
                        lineHeight: '100%',
                        letterSpacing: '-2%'
                      }}>{relatedTour.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-3" style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '24px',
                        letterSpacing: '-1%'
                      }}>{relatedTour.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[#009CBC] hover:text-[#007a9a] text-sm">
                          View tour →
                        </span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${
                              i < relatedTour.rating 
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
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}