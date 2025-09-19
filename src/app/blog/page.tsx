'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Calendar, Clock, User, ArrowRight, Search, Instagram } from 'lucide-react';
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
    
    const response = await fetch(`http://localhost:5001/api/blog?${searchParams.toString()}`);
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

  // Fetch categories (get all published posts and extract unique categories)
  const { data: categoriesData } = useQuery({
    queryKey: ['blogCategories'],
    queryFn: () => publicBlogApi.getBlogs({ limit: 100 }),
    select: (data) => {
      const posts = data?.data?.blogPosts || [];
      const categories = [...new Set(posts
        .map((post: BlogPost) => post.category)
        .filter(Boolean)
      )];
      return categories;
    }
  });

  const blogs = blogsData?.data?.blogPosts || [];
  const categories = categoriesData || [];
  const featuredPost = blogs.find((post: BlogPost) => post.featured);
  const regularPosts = blogs.filter((post: BlogPost) => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative flex justify-center py-8 bg-gray-50">
        <div className="flex gap-2 items-center">
          {/* Left Content */}
          <div className="w-[678px] h-[550px] bg-white rounded-lg px-20 py-16 flex flex-col justify-center">
            <div className="inline-block text-white px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit" style={{ backgroundColor: '#FFE700', color: '#000' }}>
              BLOG
            </div>
            <h1 className="text-[36px] font-bold text-gray-900 mb-6 leading-tight">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h1>
            <p className="text-[14px] text-gray-600 leading-relaxed max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et 
              velit interdum, ac aliquet odio mattis.
            </p>
          </div>
          
          {/* Right Image */}
          <div className="w-[674px] h-[550px] rounded-lg overflow-hidden">
            <img 
              src="/couple-photo.jpg" 
              alt="Travel planning"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>


      {/* Featured Post */}
      {featuredPost && (
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Article</h2>
            </div>
            
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto">
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
                  {featuredPost.category && (
                    <Badge className="absolute top-4 left-4 bg-blue-600">
                      {featuredPost.category}
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-8 flex flex-col justify-center">
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                      {featuredPost.title}
                    </h3>
                    
                    {featuredPost.excerpt && (
                      <p className="text-gray-600 text-lg">
                        {featuredPost.excerpt}
                      </p>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                          {featuredPost.readTime} min read
                        </div>
                      )}
                    </div>

                    <Link 
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Read Article
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchTerm || selectedCategory ? 'Search Results' : 'Latest Articles'}
            </h2>
            <p className="text-gray-600 mt-2">
              {searchTerm || selectedCategory 
                ? `${regularPosts.length} article${regularPosts.length !== 1 ? 's' : ''} found`
                : 'Discover our latest travel guides and stories'
              }
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post: BlogPost) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow group">
                  <div className="relative h-48 overflow-hidden">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    {post.category && (
                      <Badge className="absolute top-4 left-4 bg-white text-gray-900">
                        {post.category}
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      
                      {post.excerpt && (
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <span>{post.author.name}</span>
                          <span>•</span>
                          <span>
                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {post.readTime && (
                          <span>{post.readTime} min</span>
                        )}
                      </div>

                      <Link 
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                      >
                        Read More
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-12 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-start" style={{ gap: '50px' }}>
            <div style={{ 
              width: '486px', 
              height: '282px',
              paddingTop: '50px',
              opacity: 1,
              transform: 'rotate(0deg)'
            }}>
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
                    fontSize: '48px',
                    lineHeight: '100%',
                    letterSpacing: '-4%'
                  }}
                >@into.kazakhstan</span>
              </h2>
              <p className="text-gray-600 mb-6 text-sm" style={{ width: '486px' }}>
                Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you&apos;re chasing
                landscapes, culture, adventure, or spiritual meaning, there&apos;s a route for every traveler.
              </p>
              <Button 
                className="bg-white hover:bg-gray-50 text-[#009CBC] border-0 hover:scale-105 transition-all duration-200"
                style={{
                  width: '145px',
                  height: '50px',
                  borderRadius: '99px'
                }}
              >
                See Instagram
              </Button>
            </div>
          </div>

          {/* Instagram Photos Overlay */}
          <div className="absolute z-20 overflow-x-auto scrollbar-hide" style={{ top: '0px', left: '570px', right: '0px', height: '282px' }}>
            <div 
              className="flex gap-6" 
              style={{ 
                width: 'max-content'
              }}
            >
              {[
                { image: "/nomad_girls.png", alt: "Nomad girls" },
                { image: "/desert.jpg", alt: "Desert landscape" },
                { image: "/yurta.jpg", alt: "Traditional yurt" }
              ].map((post, index) => (
                <div key={index} className="relative flex-shrink-0" style={{ width: '282px', height: '282px' }}>
                  <Image
                    src={post.image}
                    alt={post.alt}
                    width={282}
                    height={282}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Instagram className="absolute top-3 left-3 w-8 h-8 text-white" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}