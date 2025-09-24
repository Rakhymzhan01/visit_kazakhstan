'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Eye,
  Share2,
  Facebook,
  Twitter,
  Copy
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';

// API client for getting blog post by slug
const publicBlogApi = {
  getBlogBySlug: async (slug: string) => {
    const response = await fetch(`http://localhost:5001/api/blog/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch blog post');
    return response.json();
  },
  
  getRelatedBlogs: async (category?: string, currentSlug?: string) => {
    const searchParams = new URLSearchParams();
    searchParams.append('status', 'PUBLISHED');
    searchParams.append('limit', '3');
    if (category) searchParams.append('category', category);
    
    const response = await fetch(`http://localhost:5001/api/blog?${searchParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch related blogs');
    const data = await response.json();
    
    // Filter out current post
    const posts = data?.data?.blogs?.filter((post: BlogPost) => post.slug !== currentSlug) || [];
    return { data: { blogs: posts } };
  }
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
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
  seoTitle?: string;
  seoDescription?: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Fetch blog post
  const { 
    data: postData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => publicBlogApi.getBlogBySlug(slug),
    enabled: !!slug,
  });

  const post: BlogPost = postData?.data?.blog;

  // Fetch related posts
  const { data: relatedData } = useQuery({
    queryKey: ['relatedBlogs', post?.category, slug],
    queryFn: () => publicBlogApi.getRelatedBlogs(post?.category, slug),
    enabled: !!post,
  });

  const relatedPosts = relatedData?.data?.blogs || [];

  const handleShare = async (platform: 'facebook' | 'twitter' | 'copy') => {
    const url = window.location.href;
    const title = post?.title || 'Check out this article';

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

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">
              The article you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Only show published posts to public
  if (post.status !== 'PUBLISHED') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Available</h1>
            <p className="text-gray-600 mb-8">
              This article is not currently published.
            </p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
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
          {post.featuredImage ? (
            <img
              src={post.featuredImage}
              alt={post.title}
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
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {post.excerpt && (
              <p className="text-xl text-black mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}
            
            <div 
              className="prose prose-lg max-w-none prose-headings:!text-black prose-p:!text-black prose-a:text-blue-600 prose-strong:!text-black prose-li:!text-black prose-ul:!text-black prose-ol:!text-black"
              style={{ color: '#000000' }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

          </div>

          {/* Sidebar - Information Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Information</h3>
              
              <div className="space-y-6">
                {/* Author */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">Author</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{post.author.name}</p>
                </div>

                {/* Category */}
                {post.category && (
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-sm font-medium">Category</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{post.category}</p>
                  </div>
                )}

                {/* Date */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">Published</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Read Time */}
                {post.readTime && (
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Read Time</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{post.readTime} minutes</p>
                  </div>
                )}

                {/* Views */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Eye className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">Views</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{post.views.toLocaleString()}</p>
                </div>

                {/* Share Section */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Share Article</h4>
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

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
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
              >Articles</span>
            </h2>

            <div className="flex gap-6">
              {relatedPosts.slice(0, 3).map((relatedPost: BlogPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <Card className="overflow-hidden flex-shrink-0 border-0 p-2 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200" style={{
                    width: '384px',
                    height: '506px'
                  }}>
                    <div className="relative">
                      {relatedPost.featuredImage ? (
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
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
                        <Badge className="bg-gray-800/80 text-white text-xs px-2 py-1">
                          📅 {new Date(relatedPost.publishedAt || relatedPost.createdAt).toLocaleDateString()}
                        </Badge>
                        {relatedPost.category && (
                          <Badge className="bg-gray-800/80 text-white text-xs px-2 py-1">
                            {relatedPost.category}
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
                      }}>{relatedPost.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-3" style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '24px',
                        letterSpacing: '-1%'
                      }}>{relatedPost.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[#009CBC] hover:text-[#007a9a] text-sm">
                          Read more →
                        </span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
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