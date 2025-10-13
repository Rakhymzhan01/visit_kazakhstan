'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, User, Instagram } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Create a simple API client for public blog endpoints
const publicBlogApi = {
  getBlogs: async (params?: { search?: string; category?: string; limit?: number; page?: number }) => {
    const searchParams = new URLSearchParams();
    
    // Only get published posts for public view
    searchParams.append('status', 'PUBLISHED');
    
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://intokazakhstan.com/api'}/blog?${searchParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch blogs');
    return response.json();
  }
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  status: string;
  featured: boolean;
  featuredImage?: string;
  category?: string;
  tags: string[];
  author: {
    name: string;
    email: string;
  };
  publishedAt?: string;
  createdAt: string;
  views: number;
  readTime?: number;
}

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch published blog posts
  const { 
    data: blogsData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['publicBlogs', { search: searchTerm, category: selectedCategory }],
    queryFn: () => publicBlogApi.getBlogs({
      search: searchTerm || undefined,
      category: selectedCategory || undefined,
      limit: 12
    }),
  });

  console.log('📊 Blog page state:', { blogsData, isLoading, error, searchTerm, selectedCategory });


  const blogs = blogsData?.data?.blogs || [];
  const featuredPost = blogs.find((post: BlogPost) => post.featured);
  // Show all posts except the featured one in Latest Articles section
  const regularPosts = blogs.filter((post: BlogPost) => post.id !== featuredPost?.id);
  
  console.log('🔍 Blog data analysis:', {
    totalBlogs: blogs.length,
    featuredPost: featuredPost?.title,
    regularPostsCount: regularPosts.length,
    allPosts: blogs.map((b: { title: string; featured: boolean }) => ({ title: b.title, featured: b.featured }))
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-2 items-center justify-center">
            {/* Left Content */}
            <div className="w-full lg:w-[678px] h-auto lg:h-[550px] bg-white rounded-lg px-6 sm:px-12 lg:px-20 py-8 lg:py-16 flex flex-col justify-center">
              <div className="inline-block text-white px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit" style={{ backgroundColor: '#FFE700', color: '#000' }}>
                BLOG
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-gray-900 mb-6 leading-tight">
                Discover Kazakhstan Through Stories — Travel Guides & Adventures
              </h1>
              <p className="text-sm lg:text-[14px] text-gray-600 leading-relaxed max-w-md">
                From hidden gems in ancient cities to breathtaking natural wonders, explore Kazakhstan through our curated collection of travel stories, guides, and insider tips that bring this incredible country to life.
              </p>
            </div>
            
            {/* Right Image */}
            <div className="w-full lg:w-[674px] h-[300px] sm:h-[400px] lg:h-[550px] rounded-lg overflow-hidden">
              <img 
                src="/couple-photo.jpg" 
                alt="Travel planning"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>


      {/* Featured Article Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12">
            <h2 className="mb-4 text-center sm:text-left">
              <span className="text-[#202020]" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(24px, 6vw, 48px)',
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
                  fontSize: 'clamp(24px, 6vw, 48px)',
                  lineHeight: '100%',
                  letterSpacing: '-4%'
                }}
              >Article</span>
            </h2>
          </div>

          {featuredPost && (
            <div className="flex flex-col lg:flex-row gap-6 mb-12">
              {/* Large featured image */}
              <div className="relative overflow-hidden rounded-2xl w-full lg:w-[792px] h-[300px] sm:h-[400px]">
                {featuredPost.featuredImage ? (
                  <img
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="text-black text-sm px-4 py-2 rounded-full font-medium" style={{ backgroundColor: '#FFE700' }}>
                    {featuredPost.category || 'Blog'}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white text-3xl font-bold leading-tight">
                    {featuredPost.title}
                  </h3>
                </div>
              </div>

              {/* Text box on the right */}
              <div className="bg-white rounded-2xl flex flex-col w-full lg:w-[384px] h-auto lg:h-[400px] p-6 lg:p-8">
                <h3 className="font-montserrat" style={{
                  fontWeight: 600,
                  fontSize: 'clamp(18px, 4vw, 24px)',
                  lineHeight: '130%',
                  letterSpacing: '-2%',
                  color: '#202020',
                  marginBottom: 'clamp(16px, 4vw, 32px)'
                }}>
                  {featuredPost.title}
                </h3>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {featuredPost.author.name}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString()}
                  </div>
                  {featuredPost.readTime && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {featuredPost.readTime} min
                    </div>
                  )}
                </div>

                {featuredPost.excerpt && (
                  <p className="font-manrope flex-1" style={{
                    fontWeight: 400,
                    fontSize: 'clamp(13px, 2.5vw, 14px)',
                    lineHeight: '24px',
                    letterSpacing: '-1%',
                    color: '#4F504F',
                    marginBottom: 'clamp(24px, 6vw, 48px)'
                  }}>
                    {featuredPost.excerpt}
                  </p>
                )}
                
                <Link href={`/blog/${featuredPost.slug}`}>
                  <button 
                    className="text-white font-manrope rounded-full self-start flex items-center justify-center"
                    style={{
                      width: 'clamp(140px, 30vw, 160px)',
                      height: '50px',
                      backgroundColor: '#009CBC',
                      padding: '13px 30px',
                      borderRadius: '99px',
                      fontWeight: 600,
                      fontSize: '14px',
                      lineHeight: '1',
                      letterSpacing: '-2%'
                    }}
                  >
                    Read Article
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12">
            <h2 className="mb-4 text-center sm:text-left">
              <span className="text-[#202020]" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(24px, 6vw, 48px)',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}>Latest</span> <span 
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
              >Articles</span>
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-[400px] bg-gray-200 rounded-2xl"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Failed to load articles</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-blue-600 hover:text-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : regularPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedCategory 
                  ? 'Try adjusting your search or filters'
                  : 'No articles have been published yet'
                }
              </p>
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post: BlogPost) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div className="relative overflow-hidden rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300 w-full h-[300px] sm:h-[350px] lg:h-[400px]">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    
                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="text-black text-sm px-4 py-2 rounded-full font-medium" style={{ backgroundColor: '#FFE700' }}>
                        {post.category || 'Blog'}
                      </span>
                    </div>
                    
                    {/* Content at bottom */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-white text-2xl font-bold leading-tight mb-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-white/80 text-sm">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {post.author.name}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                        </div>
                        {post.readTime && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {post.readTime} min
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-8 sm:py-12 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
            <div className="text-center lg:text-left lg:max-w-md">
              <h2 className="mb-4">
                <span 
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
                >@into.kazakhstan</span>
              </h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you&apos;re chasing
                landscapes, culture, adventure, or spiritual meaning, there&apos;s a route for every traveler.
              </p>
              <Button 
                className="bg-white hover:bg-gray-50 text-[#009CBC] border-0 hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                style={{
                  height: '50px',
                  borderRadius: '99px',
                  padding: '0 24px'
                }}
              >
                See Instagram
              </Button>
            </div>

            <div className="flex-1">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 sm:gap-6 pb-4" style={{ width: 'max-content' }}>
                  {[
                    { image: "/nomad_girls.png", alt: "Nomad girls" },
                    { image: "/desert.jpg", alt: "Desert landscape" },
                    { image: "/yurta.jpg", alt: "Traditional yurt" }
                  ].map((post, index) => (
                    <div key={index} className="relative flex-shrink-0" style={{ 
                      width: 'clamp(200px, 50vw, 282px)', 
                      height: 'clamp(200px, 50vw, 282px)' 
                    }}>
                      <Image
                        src={post.image}
                        alt={post.alt}
                        width={282}
                        height={282}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Instagram className="absolute top-3 left-3 w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}