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
  Star,
  Calendar,
  Clock,
  Users,
  Mountain,
  Building,
  Landmark,
  Info
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';

// API client for getting destination by slug and related destinations
const destinationsApi = {
  getDestinationBySlug: async (slug: string) => {
    const response = await fetch(`http://localhost:5001/api/destinations/public/slug/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch destination');
    return response.json();
  },
  
  getRelatedDestinations: async (category?: string, currentSlug?: string) => {
    const searchParams = new URLSearchParams({
      status: 'ACTIVE',
      limit: '3'
    });
    if (category) searchParams.append('category', category);
    
    const response = await fetch(`http://localhost:5001/api/destinations/public?${searchParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch related destinations');
    const data = await response.json();
    
    // Filter out current destination
    const destinations = data?.data?.destinations?.filter((dest: Destination) => dest.slug !== currentSlug) || [];
    return { data: { destinations } };
  }
};

interface Destination {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  description: string;
  content: string;
  image: string;
  gallery?: string[];
  category: 'nature' | 'culture' | 'cities';
  subcategory?: string;
  location: string;
  highlights: string[];
  featured: boolean;
  status: string;
  displayOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  price?: string;
  rating?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  activities?: string[];
  facilities?: string[];
  tips?: string[];
  bestTime?: string;
  duration?: string;
  difficulty?: string;
  era?: string;
  type?: string;
  region?: string;
  population?: string;
  founded?: string;
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'nature':
      return <Mountain className="h-5 w-5" />;
    case 'cities':
      return <Building className="h-5 w-5" />;
    case 'culture':
      return <Landmark className="h-5 w-5" />;
    default:
      return <MapPin className="h-5 w-5" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'nature':
      return 'bg-green-600';
    case 'cities':
      return 'bg-amber-500';
    case 'culture':
      return 'bg-blue-600';
    default:
      return 'bg-gray-600';
  }
};

export default function DestinationDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Fetch destination
  const { 
    data: destinationData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['destination', slug],
    queryFn: () => destinationsApi.getDestinationBySlug(slug),
    enabled: !!slug,
  });

  const destination: Destination = destinationData?.data?.destination;

  // Fetch related destinations
  const { data: relatedData } = useQuery({
    queryKey: ['relatedDestinations', destination?.category, slug],
    queryFn: () => destinationsApi.getRelatedDestinations(destination?.category, slug),
    enabled: !!destination,
  });

  const relatedDestinations = relatedData?.data?.destinations || [];

  const handleShare = async (platform: 'facebook' | 'twitter' | 'copy') => {
    const url = window.location.href;
    const title = destination?.name || 'Check out this destination';

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

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Destination Not Found</h1>
            <p className="text-gray-600 mb-8">
              The destination you&apos;re looking for doesn&apos;t exist or has been removed.
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

  // Only show active destinations to public
  if (destination.status !== 'ACTIVE') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Destination Not Available</h1>
            <p className="text-gray-600 mb-8">
              This destination is not currently available.
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
        <div className="relative w-full h-[453px] rounded-lg overflow-hidden bg-gray-900">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          
          {/* Strong dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
          
          {/* Title overlay with strong contrast */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <h1 className="text-4xl lg:text-6xl font-black text-white text-center leading-tight px-8 max-w-5xl" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)'
            }}>
              {destination.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {destination.description && (
              <p className="text-xl text-black mb-8 leading-relaxed">
                {destination.description}
              </p>
            )}
            
            {/* About This Destination */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">About This Destination</h3>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>{destination.content}</p>
              </div>
            </div>

            {/* Highlights */}
            {destination.highlights && destination.highlights.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Highlights</h3>
                <ul className="space-y-2">
                  {destination.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What to Expect */}
            {destination.activities && destination.activities.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">What to Expect</h3>
                <ul className="space-y-2">
                  {destination.activities.map((activity, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Facilities */}
            {destination.facilities && destination.facilities.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Facilities & Services</h3>
                <ul className="space-y-2">
                  {destination.facilities.map((facility, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">⚬</span>
                      <span className="text-gray-700">{facility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips */}
            {destination.tips && destination.tips.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Visitor Tips</h3>
                <div className="space-y-3">
                  {destination.tips.map((tip, index) => (
                    <div key={index} className="border-l-4 border-yellow-400 pl-6">
                      <p className="text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Information Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Destination Information</h3>
              
              <div className="space-y-6">
                {/* Location */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{destination.location}</p>
                </div>

                {/* Type (Category) */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-sm font-medium">Type</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{destination.category.charAt(0).toUpperCase() + destination.category.slice(1)}</p>
                </div>

                {/* Rating */}
                {destination.rating && (
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Star className="h-5 w-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${
                            i < destination.rating! 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} />
                        ))}
                      </div>
                      <span className="text-gray-900 font-medium">({destination.rating}/5)</span>
                    </div>
                  </div>
                )}

                {/* Best Time to Visit */}
                {destination.bestTime && (
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Best Time to Visit</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{destination.bestTime}</p>
                  </div>
                )}

                {/* Duration */}
                {destination.duration && (
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Recommended Duration</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{destination.duration}</p>
                  </div>
                )}

                {/* Difficulty */}
                {destination.difficulty && (
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Difficulty Level</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{destination.difficulty}</p>
                  </div>
                )}

                {/* Population (for cities) */}
                {destination.population && (
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Population</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{destination.population}</p>
                  </div>
                )}

                {/* Founded (for cities) */}
                {destination.founded && (
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Info className="h-5 w-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Founded</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{destination.founded}</p>
                  </div>
                )}

                {/* Era (for culture) */}
                {destination.era && (
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Era</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{destination.era}</p>
                  </div>
                )}

                {/* Share Section */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Share Destination</h4>
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

      {/* Related Destinations */}
      {relatedDestinations.length > 0 && (
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
              >Destinations</span>
            </h2>

            <div className="flex gap-6">
              {relatedDestinations.slice(0, 3).map((relatedDestination: Destination) => (
                <Link key={relatedDestination.id} href={`/destinations/${relatedDestination.slug}`}>
                  <Card className="overflow-hidden flex-shrink-0 border-0 p-2 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200" style={{
                    width: '384px',
                    height: '506px'
                  }}>
                    <div className="relative">
                      <img
                        src={relatedDestination.image}
                        alt={relatedDestination.name}
                        className="w-full object-cover rounded-lg"
                        style={{
                          width: '368px',
                          height: '260px'
                        }}
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className={`text-white text-xs px-2 py-1 ${getCategoryColor(relatedDestination.category)}`}>
                          {getCategoryIcon(relatedDestination.category)}
                          {relatedDestination.category.charAt(0).toUpperCase() + relatedDestination.category.slice(1)}
                        </Badge>
                        {relatedDestination.featured && (
                          <Badge className="bg-yellow-500 text-white text-xs px-2 py-1">
                            ⭐ Featured
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
                      }}>{relatedDestination.name}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-3" style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '24px',
                        letterSpacing: '-1%'
                      }}>{relatedDestination.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[#009CBC] hover:text-[#007a9a] text-sm">
                          Learn more →
                        </span>
                        {relatedDestination.rating && (
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${
                                i < relatedDestination.rating! 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-300'
                              }`} />
                            ))}
                          </div>
                        )}
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