'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './contexts/AuthContext';
import { blogApi, uploadApi, destinationsApi, eventsApi, toursApi } from '@/lib/api';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  FileText,
  Plus,
  TrendingUp,
  Calendar,
  MapPin,
  Plane,
  Mountain,
  Edit3,
  BarChart3,
  Users,
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

  // Fetch destinations stats
  const { data: destinationStats } = useQuery({
    queryKey: ['destinationStats'],
    queryFn: () => destinationsApi.getDestinationStats(),
    enabled: isAuthenticated,
  });

  // Fetch events stats
  const { data: eventStats } = useQuery({
    queryKey: ['eventStats'],
    queryFn: () => eventsApi.getEventStats(),
    enabled: isAuthenticated,
  });

  // Fetch tours stats
  const { data: tourStats } = useQuery({
    queryKey: ['tourStats'],
    queryFn: () => toursApi.getTourStats(),
    enabled: isAuthenticated,
  });

  // Fetch media stats
  const { data: mediaStats } = useQuery({
    queryKey: ['mediaStats'],
    queryFn: () => uploadApi.getMediaStats(),
    enabled: isAuthenticated,
  });

  // Fetch recent content (currently unused but kept for future feature)
  // const { data: recentBlogs } = useQuery({
  //   queryKey: ['recentBlogs'],
  //   queryFn: async () => {
  //     const result = await blogApi.getBlogs({ limit: 3 });
  //     return result;
  //   },
  //   enabled: isAuthenticated,
  // });

  const { data: recentDestinations, isLoading: recentDestinationsLoading } = useQuery({
    queryKey: ['recentDestinations'],
    queryFn: async () => {
      const result = await destinationsApi.getDestinations({ limit: 3 });
      return result;
    },
    enabled: isAuthenticated,
  });

  const { data: recentEvents, isLoading: recentEventsLoading } = useQuery({
    queryKey: ['recentEvents'],
    queryFn: async () => {
      const result = await eventsApi.getEvents({ limit: 3 });
      return result;
    },
    enabled: isAuthenticated,
  });

  const blogStatsData = blogStats?.data?.stats || {};
  const destinationStatsData = destinationStats?.data?.stats || {};
  const eventStatsData = eventStats?.data?.stats || {};
  const tourStatsData = tourStats?.data?.stats || {};
  const media = mediaStats?.data?.data || {};
  
  const destinations = recentDestinations?.data?.data?.destinations || [];
  const events = recentEvents?.data?.events || [];


  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const quickStats = [
    {
      name: 'Destinations',
      value: destinationStatsData.totalDestinations || 0,
      icon: MapPin,
      color: 'bg-blue-500',
      href: '/admin/destinations',
      description: 'Cities, Nature & Culture'
    },
    {
      name: 'Tours',
      value: tourStatsData.totalTours || 0,
      icon: Plane,
      color: 'bg-green-500',
      href: '/admin/tours',
      description: 'Travel packages'
    },
    {
      name: 'Events',
      value: eventStatsData.totalEvents || 0,
      icon: Calendar,
      color: 'bg-purple-500',
      href: '/admin/events',
      description: 'Cultural events'
    },
    {
      name: 'Blog Posts',
      value: blogStatsData.totalPosts || 0,
      icon: FileText,
      color: 'bg-orange-500',
      href: '/admin/blog',
      description: 'Articles & stories'
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
        
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/destinations">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              New Destination
            </Button>
          </Link>
          <Link href="/admin/events">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
          </Link>
          <Link href="/admin/tours">
            <Button className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              New Tour
            </Button>
          </Link>
          <Link href="/admin/blog/new">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-2">
              <Plus className="h-4 w-4 mr-2" />
              New Post
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
                      <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
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

      {/* Recent Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Destinations */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Destinations</h3>
              </div>
              <Link href="/admin/destinations">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            {recentDestinationsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : destinations.length > 0 ? (
              <div className="space-y-4">
                {destinations.map((dest: { id: string; name: string; category: string; status: string; featured: boolean }) => (
                  <div key={dest.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{dest.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                          {dest.category}
                        </span>
                        {dest.featured && (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <Link href={`/admin/destinations?edit=${dest.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No destinations yet</p>
                <Link href="/admin/destinations">
                  <Button className="mt-4" size="sm">
                    Add First Destination
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
              </div>
              <Link href="/admin/events">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            {recentEventsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event: { id: string; name: string; status: string; featured: boolean; date: string }) => (
                  <div key={event.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{event.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        {event.featured && (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <Link href={`/admin/events?edit=${event.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No events yet</p>
                <Link href="/admin/events">
                  <Button className="mt-4" size="sm">
                    Add First Event
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Overview & Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              System Overview
            </h3>
            
            {/* Statistics */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {destinationStatsData.citiesDestinations || 0}
                  </div>
                  <div className="text-xs text-gray-600">Cities</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {destinationStatsData.natureDestinations || 0}
                  </div>
                  <div className="text-xs text-gray-600">Nature</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {destinationStatsData.cultureDestinations || 0}
                  </div>
                  <div className="text-xs text-gray-600">Culture</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {blogStatsData.publishedPosts || 0}
                  </div>
                  <div className="text-xs text-gray-600">Published</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Link href="/admin/homepage">
                <Button variant="outline" className="w-full justify-start text-sm border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 font-medium py-2">
                  <TrendingUp className="h-4 w-4 mr-3" />
                  Manage Homepage
                </Button>
              </Link>
              
              <Link href="/admin/categories">
                <Button variant="outline" className="w-full justify-start text-sm border-gray-300 hover:bg-green-50 hover:border-green-300 hover:text-green-700 font-medium py-2">
                  <Mountain className="h-4 w-4 mr-3" />
                  Manage Categories
                </Button>
              </Link>

              <Link href="/admin/about-us">
                <Button variant="outline" className="w-full justify-start text-sm border-gray-300 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 font-medium py-2">
                  <Users className="h-4 w-4 mr-3" />
                  Manage About Us
                </Button>
              </Link>
              
              <Link href="/admin/debug">
                <Button variant="outline" className="w-full justify-start text-sm border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-medium py-2">
                  <BarChart3 className="h-4 w-4 mr-3" />
                  System Analytics
                </Button>
              </Link>
            </div>

            {/* System Status */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Storage & Performance</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Media Files</span>
                  <span className="text-xs font-medium">{media.totalFiles || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Storage Used</span>
                  <span className="text-xs font-medium">
                    {media.totalSize ? `${(media.totalSize / 1024 / 1024).toFixed(1)} MB` : '0 MB'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Active Content</span>
                  <span className="text-xs font-medium">
                    {(destinationStatsData.activeDestinations || 0) + (eventStatsData.activeEvents || 0)}
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