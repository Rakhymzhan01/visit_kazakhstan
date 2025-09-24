'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { blogApi } from '@/lib/api';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
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
  updatedAt: string;
  views: number;
  readTime?: number;
}

export default function BlogManagementPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('ALL');
  const queryClient = useQueryClient();

  // Debug auth status
  console.log('Admin Blog Page - isAuthenticated:', isAuthenticated);
  console.log('Admin Blog Page - User:', user);
  console.log('Admin Blog Page - Loading:', loading);
  console.log('Admin Blog Page - Component mounted');

  // Fetch blogs using blogApi with enhanced debugging
  const { 
    data: blogsData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['blogs', { search: searchTerm, status: statusFilter }],
    queryFn: async () => {
      console.log('Admin Blog Page - Making blogApi call to get blogs');
      console.log('Admin Blog Page - Search term:', searchTerm);
      console.log('Admin Blog Page - Status filter:', statusFilter);
      
      try {
        const result = await blogApi.getBlogs({
          search: searchTerm || undefined,
          status: statusFilter === 'ALL' ? undefined : statusFilter,
          limit: 50
        });
        console.log('blogApi response:', result);
        console.log('blogApi response data:', result.data);
        return result;
      } catch (err) {
        console.error('blogApi error:', err);
        throw err;
      }
    },
    enabled: !loading, // Run when auth loading is complete
    retry: false, // Disable retry to see errors faster
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogApi.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogStats'] });
      toast.success('Post deleted successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'error' in error.response.data ? String(error.response.data.error) : 'Failed to delete post';
      toast.error(errorMessage);
    },
  });

  const blogs = blogsData?.data?.data?.blogs || [];
  const totalPosts = blogsData?.data?.data?.pagination?.total || 0;
  
  // Extra debugging for data structure
  console.log('Data path check:');
  console.log('- blogsData exists:', !!blogsData);
  console.log('- blogsData.data exists:', !!blogsData?.data);
  console.log('- blogsData.data.blogs exists:', !!blogsData?.data?.blogs);
  console.log('- blogsData structure keys:', blogsData ? Object.keys(blogsData) : 'no blogsData');

  // Debug logging
  console.log('Admin Blog Page - Raw blogs data:', blogsData);
  console.log('Admin Blog Page - Parsed blogs:', blogs);
  console.log('Admin Blog Page - Total posts:', totalPosts);
  console.log('Admin Blog Page - Is loading:', isLoading);
  console.log('Admin Blog Page - Error:', error);
  console.log('Admin Blog Page - Blogs array length:', blogs.length);
  console.log('Admin Blog Page - Query enabled:', !loading);
  console.log('Admin Blog Page - Status filter:', statusFilter);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string, featured: boolean) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    let statusClasses = '';
    switch (status) {
      case 'PUBLISHED':
        statusClasses = 'bg-green-100 text-green-800';
        break;
      case 'DRAFT':
        statusClasses = 'bg-yellow-100 text-yellow-800';
        break;
      case 'ARCHIVED':
        statusClasses = 'bg-gray-100 text-gray-800';
        break;
      default:
        statusClasses = 'bg-gray-100 text-gray-800';
    }

    return (
      <div className="flex items-center space-x-2">
        <span className={`${baseClasses} ${statusClasses}`}>
          {status.toLowerCase()}
        </span>
        {featured && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Featured
          </span>
        )}
      </div>
    );
  };

  if (loading) {
    return <div>Loading auth...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please login to access this page.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600 mt-1">
            Manage your blog posts and articles ({totalPosts} total)
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading posts...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              <p>Error loading posts: {error.message}</p>
              <p>Check console for details.</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'ALL' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first blog post'
                }
              </p>
              <Link href="/admin/blog/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {blogs.map((post: BlogPost) => (
                <div key={post.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Title and Status */}
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate mr-4">
                          {post.title}
                        </h3>
                        {getStatusBadge(post.status, post.featured)}
                      </div>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Meta information */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {post.author.name}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        {post.views > 0 && (
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {post.views} views
                          </div>
                        )}
                        {post.category && (
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {post.category}
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{post.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {post.status === 'PUBLISHED' && (
                        <Link 
                          href={`/blog/${post.slug}`} 
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      )}
                      <Link 
                        href={`/admin/blog/${post.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deleteMutation.isPending}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}