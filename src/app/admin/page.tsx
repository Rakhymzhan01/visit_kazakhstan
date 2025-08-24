'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './contexts/AuthContext';
import { blogApi, uploadApi } from '@/lib/api';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  FileText,
  Users,
  Upload,
  Eye,
  Plus,
  TrendingUp,
  Calendar,
  Image,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  // Fetch blog stats
  const { data: blogStats } = useQuery({
    queryKey: ['blogStats'],
    queryFn: () => blogApi.getBlogStats(),
    enabled: isAuthenticated,
  });

  // Fetch media stats
  const { data: mediaStats } = useQuery({
    queryKey: ['mediaStats'],
    queryFn: () => uploadApi.getMediaStats(),
    enabled: isAuthenticated,
  });

  // Fetch recent blogs
  const { data: recentBlogs, isLoading: recentBlogsLoading } = useQuery({
    queryKey: ['recentBlogs'],
    queryFn: () => blogApi.getBlogs({ limit: 5 }),
    enabled: isAuthenticated,
  });

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = blogStats?.data?.data || {};
  const media = mediaStats?.data?.data || {};
  const blogs = recentBlogs?.data?.data?.blogPosts || [];

  const quickStats = [
    {
      name: 'Total Posts',
      value: stats.totalPosts || 0,
      icon: FileText,
      color: 'bg-blue-500',
      href: '/admin/blog',
    },
    {
      name: 'Published',
      value: stats.publishedPosts || 0,
      icon: Eye,
      color: 'bg-green-500',
      href: '/admin/blog?status=published',
    },
    {
      name: 'Draft Posts',
      value: stats.draftPosts || 0,
      icon: Calendar,
      color: 'bg-yellow-500',
      href: '/admin/blog?status=draft',
    },
    {
      name: 'Media Files',
      value: media.totalFiles || 0,
      icon: Image,
      color: 'bg-purple-500',
      href: '/admin/media',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here&apos;s what&apos;s happening with your website today.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Link href="/admin/blog/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
          <Link href="/admin/media">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.name}</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Blog Posts */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Blog Posts
              </h3>
              <Link href="/admin/blog">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            {recentBlogsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : blogs.length > 0 ? (
              <div className="space-y-4">
                {blogs.map((blog: { id: string; title: string; status: string; createdAt: string }) => (
                  <div key={blog.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {blog.title}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          blog.status === 'PUBLISHED' 
                            ? 'bg-green-100 text-green-800'
                            : blog.status === 'DRAFT'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {blog.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link href={`/admin/blog/${blog.id}`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No blog posts yet</p>
                <Link href="/admin/blog/new">
                  <Button className="mt-4" size="sm">
                    Create Your First Post
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Quick Actions
            </h3>
            
            <div className="space-y-4">
              <Link href="/admin/blog/new">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-3" />
                  Create New Blog Post
                </Button>
              </Link>
              
              <Link href="/admin/media">
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-3" />
                  Upload Media Files
                </Button>
              </Link>
              
              <Link href="/admin/content">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-3" />
                  Manage Content
                </Button>
              </Link>
              
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-3" />
                  Manage Users
                </Button>
              </Link>
            </div>

            {/* System Status */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                System Status
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Total Views</span>
                  <span className="text-xs font-medium">
                    {stats.totalViews?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Storage Used</span>
                  <span className="text-xs font-medium">
                    {media.totalSize ? `${(media.totalSize / 1024 / 1024).toFixed(1)} MB` : '0 MB'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Categories</span>
                  <span className="text-xs font-medium">
                    {stats.categories?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}