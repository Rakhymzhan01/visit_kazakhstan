'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Users, Music, Camera, Clock, MapIcon } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { destinationsApi } from '@/lib/api';

interface Destination {
  _id: string;
  name: string;
  slug: string;
  subtitle?: string;
  description: string;
  content: string;
  image: string;
  category: string;
  subcategory?: string;
  location: string;
  highlights: string[];
  activities?: string[];
  facilities?: string[];
  tips?: string[];
  bestTime?: string;
  duration?: string;
  difficulty?: string;
  era?: string;
  type?: string;
  rating?: number;
  featured?: boolean;
  status: string;
}


export default function CultureDestinationPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  // Fetch destination from database
  const { data: destinationData, isLoading, error } = useQuery({
    queryKey: ['destination', slug],
    queryFn: () => destinationsApi.getPublicDestinationBySlug(slug),
    retry: 1,
  });

  const destination = destinationData?.data?.data?.destination as Destination;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading destination...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cultural Destination Not Found</h1>
            <p className="text-gray-600 mb-8">
              The cultural destination you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/categories/culture" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cultural Tours
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isTraditional = destination.subcategory === 'then';

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Image with Title Overlay */}
      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative w-full h-[453px] rounded-lg overflow-hidden bg-gray-900">
          <Image
            src={destination.image}
            alt={destination.name}
            width={1200}
            height={453}
            className="w-full h-full object-cover"
            priority
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
            <p className="text-xl text-black mb-8 leading-relaxed">
              {destination.description}
            </p>
            
            <div className="prose prose-lg max-w-none prose-headings:!text-black prose-p:!text-black prose-a:text-blue-600 prose-strong:!text-black prose-li:!text-black prose-ul:!text-black prose-ol:!text-black">
              {destination.content ? (
                <div dangerouslySetInnerHTML={{ __html: destination.content }} />
              ) : (
                <div>
                  <h3>About this destination</h3>
                  <p>{destination.description}</p>
                </div>
              )}
            </div>

            {/* Highlights Section */}
            {destination.highlights && destination.highlights.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-black mb-6">Cultural Highlights</h3>
                <ul className="space-y-3">
                  {destination.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      {isTraditional ? (
                        <Music className="h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                      ) : (
                        <Camera className="h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                      )}
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Activities Section */}
            {destination.activities && destination.activities.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-black mb-6">Activities</h3>
                <ul className="space-y-3">
                  {destination.activities.map((activity, index) => (
                    <li key={index} className="flex items-start">
                      <Users className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips Section */}
            {destination.tips && destination.tips.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-black mb-6">Tips</h3>
                <ul className="space-y-3">
                  {destination.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-amber-600 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar - Information Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Cultural Information</h3>
              
              <div className="space-y-6">
                {/* Location */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{destination.location}</p>
                </div>

                {/* Era or Category */}
                {(destination.era || destination.subcategory) && (
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">Era</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {destination.era || (destination.subcategory === 'then' ? 'Traditional' : 'Contemporary')}
                    </p>
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

                {/* Type or Best Time */}
                {(destination.type || destination.bestTime) && (
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">{destination.type ? 'Cultural Type' : 'Best Time'}</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{destination.type || destination.bestTime}</p>
                  </div>
                )}


                {/* Plan Your Trip */}
                <div className="pt-6">
                  <Link 
                    href="/plan-your-trip"
                    className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Plan Your Visit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Culture Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Link 
          href="/categories/culture" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cultural Tours
        </Link>
      </div>

      <Footer />
    </div>
  );
}