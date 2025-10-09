'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { homepageApi } from '@/lib/api';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Home,
  Edit3,
  Save,
  CheckCircle,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface HomepageContent {
  _id?: string;
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  whyVisit: {
    title: string;
    features: Array<{
      title: string;
      description: string;
      image: string;
      bgColor: string;
      order: number;
    }>;
  };
  tourThemes: {
    title: string;
    description: string;
    tours: Array<{
      title: string;
      description: string;
      image: string;
      date: string;
      location: string;
      rating: number;
      order: number;
    }>;
  };
  instagram: {
    handle: string;
    title: string;
    description: string;
    posts: Array<{
      image: string;
      alt: string;
      order: number;
    }>;
  };
  events: {
    title: string;
    description: string;
    eventList: Array<{
      name: string;
      image: string;
      date: string;
      category: string;
      order: number;
    }>;
  };
  isActive?: boolean;
  version?: number;
}

const defaultContent: HomepageContent = {
  hero: {
    title: "",
    subtitle: "", 
    backgroundImage: ""
  },
  whyVisit: {
    title: "",
    features: []
  },
  tourThemes: {
    title: "",
    description: "",
    tours: []
  },
  instagram: {
    handle: "",
    title: "", 
    description: "",
    posts: []
  },
  events: {
    title: "",
    description: "",
    eventList: []
  },
};

export default function HomepageContentEditor() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<HomepageContent>(defaultContent);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  // Fetch homepage content
  const { data: homepageResponse, isLoading, error } = useQuery({
    queryKey: ['homepageContent'],
    queryFn: async () => {
      console.log('🔄 Loading Homepage data...');
      const response = await homepageApi.getHomepageContent();
      console.log('📦 Homepage API Response:', response);
      return response;
    },
    enabled: isAuthenticated,
  });

  // Extract the actual data from response - try both possible structures
  const homepageData = homepageResponse?.data?.data || 
    (homepageResponse?.data?.success ? homepageResponse?.data?.data : null) ||
    (homepageResponse?.data && homepageResponse?.data.hero ? homepageResponse?.data : null);

  // Load data into form when received
  useEffect(() => {
    console.log('🔍 DEBUG - useEffect triggered');
    console.log('🔍 DEBUG - homepageResponse:', homepageResponse);
    console.log('🔍 DEBUG - homepageResponse?.data:', homepageResponse?.data);
    console.log('🔍 DEBUG - homepageData (extracted):', homepageData);
    
    if (homepageData) {
      console.log('📝 Loading homepage data into form:', homepageData);
      // Ensure the data has the correct structure
      const dataToSet = {
        ...defaultContent,
        ...homepageData,
        // Ensure nested objects exist
        hero: homepageData.hero || defaultContent.hero,
        whyVisit: homepageData.whyVisit || defaultContent.whyVisit,
        tourThemes: homepageData.tourThemes || defaultContent.tourThemes,
        instagram: homepageData.instagram || defaultContent.instagram,
        events: homepageData.events || defaultContent.events,
      };
      setContent(dataToSet);
      console.log('✅ Homepage form data loaded successfully:', dataToSet);
    } else if (homepageResponse?.data) {
      console.log('🔍 DEBUG - No data.data found, checking response.data directly');
      const directData = homepageResponse.data;
      if (directData && typeof directData === 'object' && directData.hero) {
        console.log('📝 Using direct data from response.data');
        setContent({
          ...defaultContent,
          ...directData
        });
      } else if (directData && directData.success && directData.data === null) {
        console.log('📝 No homepage content in database, using default content for first-time setup');
        setContent(defaultContent);
      } else {
        console.log('📝 No valid data found, using default content');
        setContent(defaultContent);
      }
    } else {
      console.log('📝 No response data, using default content');
      setContent(defaultContent);
    }
  }, [homepageData, homepageResponse]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: HomepageContent) => {
      console.log('💾 Saving Homepage data:', data);
      const response = await homepageApi.updateHomepageContent(data as unknown as Record<string, unknown>);
      console.log('✅ Save response:', response);
      return response;
    },
    onSuccess: () => {
      toast.success('Homepage content updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['homepageContent'] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('❌ Save error:', error);
      toast.error('Failed to update content. Please try again.');
    },
  });

  const handleEdit = () => {
    console.log('📝 Starting edit mode');
    setIsEditing(true);
  };

  const handleSave = () => {
    console.log('💾 Saving changes:', content);
    updateMutation.mutate(content);
  };

  const handleCancel = () => {
    console.log('❌ Canceling edit');
    setIsEditing(false);
    // Reload original data
    if (homepageData) {
      setContent(homepageData);
    } else {
      setContent(defaultContent);
    }
  };

  const updateContent = (section: keyof HomepageContent, key: string, value: unknown) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, unknown>),
        [key]: value
      }
    }));
  };

  const updateArrayItem = (section: keyof HomepageContent, key: string, index: number, field: string, value: unknown) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, unknown>),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key]: ((prev[section] as any)[key] as any[]).map((item: any, i: number) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addArrayItem = (section: keyof HomepageContent, key: string, newItem: unknown) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, unknown>),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key]: [...((prev[section] as any)[key] as any[]), newItem]
      }
    }));
  };

  const removeArrayItem = (section: keyof HomepageContent, key: string, index: number) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, unknown>),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key]: ((prev[section] as any)[key] as any[]).filter((_: any, i: number) => i !== index)
      }
    }));
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <p className="ml-4">Loading Homepage content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Failed to load Homepage content</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black flex items-center gap-3">
            <Home className="h-8 w-8 text-blue-600" />
            Homepage Content Management
          </h1>
          <p className="text-gray-600 mt-2">
            Edit your website's homepage content including hero section, features, tours, and events.
          </p>
        </div>
        
        {!isEditing ? (
          <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Content
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={updateMutation.isPending}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Debug Info */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-red-600 mb-2">🐛 DEBUG INFO</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <div>API Response: {homepageResponse ? 'Present' : 'Missing'}</div>
            <div>Homepage Data: {homepageData ? 'Present' : 'Missing'}</div>
            <div>Hero Title: {homepageData?.hero?.title ? 'Has content' : 'Empty'}</div>
            <div>Features Count: {homepageData?.whyVisit?.features?.length || 0}</div>
            <div>Tours Count: {homepageData?.tourThemes?.tours?.length || 0}</div>
            <div>Events Count: {homepageData?.events?.eventList?.length || 0}</div>
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs max-h-40 overflow-y-auto">
              <strong>Raw API Response:</strong>
              <pre>{JSON.stringify(homepageResponse, null, 2)}</pre>
            </div>
            <div className="mt-2 p-2 bg-yellow-50 rounded text-xs max-h-40 overflow-y-auto">
              <strong>Response.data structure:</strong>
              <pre>{JSON.stringify(homepageResponse?.data, null, 2)}</pre>
            </div>
            <div className="mt-2 p-2 bg-blue-50 rounded text-xs max-h-40 overflow-y-auto">
              <strong>Extracted homepageData:</strong>
              <pre>{JSON.stringify(homepageData, null, 2)}</pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      {homepageData ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-600 font-medium">Content Loaded Successfully</span>
              </div>
              <span className="text-sm text-gray-500">
                Last updated: {homepageData.updatedAt ? new Date(homepageData.updatedAt).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
          </CardContent>
        </Card>
      ) : homepageResponse?.data?.success && homepageResponse?.data?.data === null ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">!</div>
                <span className="text-blue-600 font-medium">First-time Setup</span>
              </div>
              <span className="text-sm text-gray-500">
                No homepage content found. Create your first homepage content by editing and saving.
              </span>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-8">
        {/* Hero Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Hero Section</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Hero Title
                </label>
                {isEditing ? (
                  <Input
                    value={content.hero.title}
                    onChange={(e) => updateContent('hero', 'title', e.target.value)}
                    placeholder="Enter hero title..."
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 font-semibold text-lg">
                      {content.hero.title || 'No title set'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Hero Subtitle
                </label>
                {isEditing ? (
                  <Textarea
                    value={content.hero.subtitle}
                    onChange={(e) => updateContent('hero', 'subtitle', e.target.value)}
                    placeholder="Enter hero subtitle..."
                    rows={3}
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">
                      {content.hero.subtitle || 'No subtitle set'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Background Image URL
                </label>
                {isEditing ? (
                  <Input
                    value={content.hero.backgroundImage}
                    onChange={(e) => updateContent('hero', 'backgroundImage', e.target.value)}
                    placeholder="/hero-background.jpg"
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">
                      {content.hero.backgroundImage || 'No background image set'}
                    </p>
                    {content.hero.backgroundImage && (
                      <div className="mt-2">
                        <img 
                          src={content.hero.backgroundImage} 
                          alt="Hero background preview"
                          className="w-32 h-20 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Visit Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Why Visit Kazakhstan Section</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Section Title
                </label>
                {isEditing ? (
                  <Input
                    value={content.whyVisit.title}
                    onChange={(e) => updateContent('whyVisit', 'title', e.target.value)}
                    placeholder="Why Visit Kazakhstan?"
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 font-semibold">
                      {content.whyVisit.title || 'No title set'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-black">Features</h3>
                  {isEditing && (
                    <Button
                      onClick={() => addArrayItem('whyVisit', 'features', {
                        title: 'New Feature',
                        description: 'Enter description here...',
                        image: '/placeholder.jpg',
                        bgColor: 'from-blue-400 to-blue-600',
                        order: content.whyVisit.features.length + 1
                      })}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feature
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.whyVisit.features.map((feature, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-black">Feature {index + 1}</h4>
                        {isEditing && (
                          <Button
                            onClick={() => removeArrayItem('whyVisit', 'features', index)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Title</label>
                            <Input
                              value={feature.title}
                              onChange={(e) => updateArrayItem('whyVisit', 'features', index, 'title', e.target.value)}
                              placeholder="Feature title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Description</label>
                            <Textarea
                              value={feature.description}
                              onChange={(e) => updateArrayItem('whyVisit', 'features', index, 'description', e.target.value)}
                              placeholder="Feature description..."
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Image URL</label>
                            <Input
                              value={feature.image}
                              onChange={(e) => updateArrayItem('whyVisit', 'features', index, 'image', e.target.value)}
                              placeholder="/feature.jpg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Background Color</label>
                            <Input
                              value={feature.bgColor}
                              onChange={(e) => updateArrayItem('whyVisit', 'features', index, 'bgColor', e.target.value)}
                              placeholder="from-blue-400 to-blue-600"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <h5 className="font-medium text-gray-900">{feature.title || 'No title'}</h5>
                          <p className="text-sm text-gray-600">{feature.description || 'No description'}</p>
                          {feature.image && (
                            <img 
                              src={feature.image} 
                              alt={feature.title}
                              className="w-full h-20 object-cover rounded border"
                            />
                          )}
                          <div className="text-xs text-gray-500">Background: {feature.bgColor}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tour Themes Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Tour Themes Section</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Section Title
                </label>
                {isEditing ? (
                  <Input
                    value={content.tourThemes.title}
                    onChange={(e) => updateContent('tourThemes', 'title', e.target.value)}
                    placeholder="Discover Our Tour Themes"
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 font-semibold">
                      {content.tourThemes.title || 'No title set'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Section Description
                </label>
                {isEditing ? (
                  <Textarea
                    value={content.tourThemes.description}
                    onChange={(e) => updateContent('tourThemes', 'description', e.target.value)}
                    placeholder="Enter tour themes description..."
                    rows={3}
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">
                      {content.tourThemes.description || 'No description set'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-black">Tours</h3>
                  {isEditing && (
                    <Button
                      onClick={() => addArrayItem('tourThemes', 'tours', {
                        title: 'New Tour',
                        description: 'Enter tour description...',
                        image: '/placeholder.jpg',
                        date: '2024-12-01',
                        location: 'Kazakhstan',
                        rating: 5,
                        order: content.tourThemes.tours.length + 1
                      })}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Tour
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {content.tourThemes.tours.map((tour, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-black">Tour {index + 1}</h4>
                        {isEditing && (
                          <Button
                            onClick={() => removeArrayItem('tourThemes', 'tours', index)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Title</label>
                            <Input
                              value={tour.title}
                              onChange={(e) => updateArrayItem('tourThemes', 'tours', index, 'title', e.target.value)}
                              placeholder="Tour title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Description</label>
                            <Textarea
                              value={tour.description}
                              onChange={(e) => updateArrayItem('tourThemes', 'tours', index, 'description', e.target.value)}
                              placeholder="Tour description..."
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Image URL</label>
                            <Input
                              value={tour.image}
                              onChange={(e) => updateArrayItem('tourThemes', 'tours', index, 'image', e.target.value)}
                              placeholder="/tour.jpg"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Date</label>
                              <Input
                                value={tour.date}
                                onChange={(e) => updateArrayItem('tourThemes', 'tours', index, 'date', e.target.value)}
                                placeholder="2024-12-01"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Rating</label>
                              <Input
                                type="number"
                                min="1"
                                max="5"
                                value={tour.rating}
                                onChange={(e) => updateArrayItem('tourThemes', 'tours', index, 'rating', parseFloat(e.target.value))}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Location</label>
                            <Input
                              value={tour.location}
                              onChange={(e) => updateArrayItem('tourThemes', 'tours', index, 'location', e.target.value)}
                              placeholder="Kazakhstan"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <h5 className="font-medium text-gray-900">{tour.title || 'No title'}</h5>
                          <p className="text-sm text-gray-600">{tour.description || 'No description'}</p>
                          {tour.image && (
                            <img 
                              src={tour.image} 
                              alt={tour.title}
                              className="w-full h-24 object-cover rounded border"
                            />
                          )}
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>📅 {tour.date}</div>
                            <div>📍 {tour.location}</div>
                            <div>⭐ {tour.rating}/5</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instagram Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Instagram Section</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Instagram Handle
                </label>
                {isEditing ? (
                  <Input
                    value={content.instagram.handle}
                    onChange={(e) => updateContent('instagram', 'handle', e.target.value)}
                    placeholder="@into.kazakhstan"
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">
                      {content.instagram.handle || 'No handle set'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Section Title
                </label>
                {isEditing ? (
                  <Input
                    value={content.instagram.title}
                    onChange={(e) => updateContent('instagram', 'title', e.target.value)}
                    placeholder="Follow us on Instagram"
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 font-semibold">
                      {content.instagram.title || 'No title set'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Section Description
                </label>
                {isEditing ? (
                  <Textarea
                    value={content.instagram.description}
                    onChange={(e) => updateContent('instagram', 'description', e.target.value)}
                    placeholder="Follow us for amazing content..."
                    rows={3}
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">
                      {content.instagram.description || 'No description set'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-black">Instagram Posts</h3>
                  {isEditing && (
                    <Button
                      onClick={() => addArrayItem('instagram', 'posts', {
                        image: '/placeholder.jpg',
                        alt: 'New post',
                        order: content.instagram.posts.length + 1
                      })}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Post
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {content.instagram.posts.map((post, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-black text-sm">Post {index + 1}</h4>
                        {isEditing && (
                          <Button
                            onClick={() => removeArrayItem('instagram', 'posts', index)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Image URL</label>
                            <Input
                              value={post.image}
                              onChange={(e) => updateArrayItem('instagram', 'posts', index, 'image', e.target.value)}
                              placeholder="/instagram.jpg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Alt Text</label>
                            <Input
                              value={post.alt}
                              onChange={(e) => updateArrayItem('instagram', 'posts', index, 'alt', e.target.value)}
                              placeholder="Post description"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {post.image ? (
                            <img 
                              src={post.image} 
                              alt={post.alt}
                              className="w-full h-24 object-cover rounded border"
                            />
                          ) : (
                            <div className="w-full h-24 bg-gray-200 rounded border flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No image</span>
                            </div>
                          )}
                          <p className="text-xs text-gray-600">{post.alt || 'No description'}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Events Section</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Section Title
                </label>
                {isEditing ? (
                  <Input
                    value={content.events.title}
                    onChange={(e) => updateContent('events', 'title', e.target.value)}
                    placeholder="Upcoming Events"
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 font-semibold">
                      {content.events.title || 'No title set'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Section Description
                </label>
                {isEditing ? (
                  <Textarea
                    value={content.events.description}
                    onChange={(e) => updateContent('events', 'description', e.target.value)}
                    placeholder="Discover amazing events in Kazakhstan..."
                    rows={3}
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">
                      {content.events.description || 'No description set'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-black">Event List</h3>
                  {isEditing && (
                    <Button
                      onClick={() => addArrayItem('events', 'eventList', {
                        name: 'New Event',
                        image: '/placeholder.jpg',
                        date: '2024-12-01',
                        category: 'Cultural',
                        order: content.events.eventList.length + 1
                      })}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {content.events.eventList.map((event, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-black">Event {index + 1}</h4>
                        {isEditing && (
                          <Button
                            onClick={() => removeArrayItem('events', 'eventList', index)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Event Name</label>
                            <Input
                              value={event.name}
                              onChange={(e) => updateArrayItem('events', 'eventList', index, 'name', e.target.value)}
                              placeholder="Event name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Image URL</label>
                            <Input
                              value={event.image}
                              onChange={(e) => updateArrayItem('events', 'eventList', index, 'image', e.target.value)}
                              placeholder="/event.jpg"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Date</label>
                              <Input
                                value={event.date}
                                onChange={(e) => updateArrayItem('events', 'eventList', index, 'date', e.target.value)}
                                placeholder="2024-12-01"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Category</label>
                              <Input
                                value={event.category}
                                onChange={(e) => updateArrayItem('events', 'eventList', index, 'category', e.target.value)}
                                placeholder="Cultural"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <h5 className="font-medium text-gray-900">{event.name || 'No name'}</h5>
                          {event.image && (
                            <img 
                              src={event.image} 
                              alt={event.name}
                              className="w-full h-24 object-cover rounded border"
                            />
                          )}
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>📅 {event.date}</div>
                            <div>🏷️ {event.category}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Bottom Save Button */}
      {isEditing && (
        <div className="mt-8">
          <Button 
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      )}
    </div>
  );
}