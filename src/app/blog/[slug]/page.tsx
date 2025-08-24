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
    const posts = data?.data?.blogPosts?.filter((post: BlogPost) => post.slug !== currentSlug) || [];
    return { data: { blogPosts: posts } };
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

  const post: BlogPost = postData?.data?.blogPost;

  // Fetch related posts
  const { data: relatedData } = useQuery({
    queryKey: ['relatedBlogs', post?.category, slug],
    queryFn: () => publicBlogApi.getRelatedBlogs(post?.category, slug),
    enabled: !!post,
  });

  const relatedPosts = relatedData?.data?.blogPosts || [];

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
      <div className="min-h-screen bg-gray-50">
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
      <div className="min-h-screen bg-gray-50">
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
      <div className="min-h-screen bg-gray-50">
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          {post.category && (
            <Badge className="mb-4 bg-blue-600">
              {post.category}
            </Badge>
          )}
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6">
              {post.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-500 border-b border-gray-200 pb-6">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span>By {post.author.name}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            {post.readTime && (
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{post.readTime} min read</span>
              </div>
            )}
            {post.views > 0 && (
              <div className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                <span>{post.views} views</span>
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8">
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Share */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <Share2 className="h-5 w-5 inline mr-2" />
                  Share Article
                </h3>
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
              </CardContent>
            </Card>

            {/* Author Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Author</h3>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {post.author.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{post.author.name}</p>
                    <p className="text-sm text-gray-500">Travel Writer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.slice(0, 3).map((relatedPost: BlogPost) => (
              <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  {relatedPost.featuredImage ? (
                    <img
                      src={relatedPost.featuredImage}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                  {relatedPost.category && (
                    <Badge className="absolute top-4 left-4 bg-white text-gray-900">
                      {relatedPost.category}
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        {relatedPost.title}
                      </Link>
                    </h3>
                    
                    {relatedPost.excerpt && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    )}

                    <div className="flex items-center text-xs text-gray-500">
                      <span>{relatedPost.author.name}</span>
                      <span className="mx-2">•</span>
                      <span>
                        {new Date(relatedPost.publishedAt || relatedPost.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}