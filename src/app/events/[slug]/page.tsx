'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { ArrowLeft, MapPin, Copy, Facebook, Twitter } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { eventsApi } from '@/lib/api'
import toast from 'react-hot-toast'

interface Event {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  image: string;
  category: string;
  date: string;
  time?: string;
  location?: string;
  featured: boolean;
  status: string;
  views: number;
  price?: string;
  duration?: string;
  organizer?: string;
  website?: string;
  tags: string[];
}

const EventDetailPage = () => {
  const params = useParams()
  const slug = params?.slug as string

  // Fetch single event by slug
  const { 
    data: eventData, 
    isLoading: eventLoading, 
    error: eventError 
  } = useQuery({
    queryKey: ['event', slug],
    queryFn: async () => {
      const response = await eventsApi.getPublicEventBySlug(slug);
      return response.data.data;
    },
    enabled: !!slug,
  });

  // Fetch similar events
  const { 
    data: similarEventsData 
  } = useQuery({
    queryKey: ['similar-events', eventData?.category],
    queryFn: async () => {
      const response = await eventsApi.getPublicEvents({ 
        limit: 3,
        category: eventData?.category 
      });
      return response.data.data.events.filter((e: Event) => e._id !== eventData?._id);
    },
    enabled: !!eventData?.category,
  });

  const handleShare = async (platform: 'facebook' | 'twitter' | 'copy') => {
    const url = window.location.href;
    const title = eventData?.title || 'Check out this event';

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

  if (eventLoading) {
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

  if (eventError || !eventData) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-8">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/events" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Image with Title Overlay - Matching Tour Design */}
      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative w-full h-[453px] rounded-lg overflow-hidden bg-gray-900">
          <Image
            src={eventData.image}
            alt={eventData.title}
            fill
            className="object-cover"
            priority
          />
          
          {/* Strong dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
          
          {/* Title overlay with strong contrast */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <h1 className="text-4xl lg:text-6xl font-black text-white text-center leading-tight px-8 max-w-5xl" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)'
            }}>
              {eventData.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Layout - Matching Tour Design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            {eventData.description && (
              <p className="text-xl text-black mb-8 leading-relaxed">
                {eventData.description}
              </p>
            )}

            {/* Event Details Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Event Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {eventData.organizer && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Organizer</h4>
                    <p className="text-gray-700">{eventData.organizer}</p>
                  </div>
                )}
                {eventData.duration && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Duration</h4>
                    <p className="text-gray-700">{eventData.duration}</p>
                  </div>
                )}
                {eventData.website && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Website</h4>
                    <a 
                      href={eventData.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                {eventData.tags && eventData.tags.length > 0 && (
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {eventData.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Information Panel - Matching Tour Design */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Information</h3>
              
              <div className="space-y-6">
                {/* Location */}
                {eventData.location && (
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Location</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{eventData.location}</p>
                  </div>
                )}

                {/* Date & Time */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">Date & Time</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(eventData.date)}</p>
                  {eventData.time && (
                    <p className="text-sm text-gray-600">{eventData.time}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-sm font-medium">Type</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{eventData.category}</p>
                </div>

                {/* Price */}
                {eventData.price && (
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span className="text-sm font-medium">Price</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{eventData.price}</p>
                  </div>
                )}

                {/* Share Section - Matching Tour Design */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Share Event</h4>
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

      {/* Similar Events - Matching Tour Design */}
      {similarEventsData && similarEventsData.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8">
              <span className="text-[#202020]" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: '48px',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}>Similar</span> <span 
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
              >Events</span>
            </h2>

            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {similarEventsData.slice(0, 3).map((event: Event) => (
                <Link key={event._id} href={`/events/${event.slug}`}>
                  <div className="overflow-hidden flex-shrink-0 border-0 p-2 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200 bg-white rounded-lg" style={{
                    width: '384px',
                    height: '506px'
                  }}>
                    <div className="relative">
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={368}
                        height={260}
                        className="w-full object-cover rounded-lg"
                        style={{
                          width: '368px',
                          height: '260px'
                        }}
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-gray-800/80 text-white text-xs px-2 py-1 rounded">
                          📅 {formatDate(event.date)}
                        </span>
                        <span className="bg-gray-800/80 text-white text-xs px-2 py-1 rounded">
                          {event.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="mb-2 text-[#202020]" style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 600,
                        fontSize: '24px',
                        lineHeight: '100%',
                        letterSpacing: '-2%'
                      }}>{event.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-3" style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '24px',
                        letterSpacing: '-1%'
                      }}>{event.excerpt || event.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[#009CBC] hover:text-[#007a9a] text-sm">
                          View event →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

export default EventDetailPage