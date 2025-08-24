'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Calendar, Clock, User, ArrowRight, Search } from 'lucide-react';
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              BLOG
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Discover Kazakhstan
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore stories, guides, and insights about Kazakhstan&apos;s culture, nature, and adventures from our travel experts.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
              >
                <option value="">All Categories</option>
                {(categories as string[]).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
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

      <Footer />
    </div>
  );
}