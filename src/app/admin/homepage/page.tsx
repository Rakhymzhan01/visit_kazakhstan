'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'react-hot-toast';
import { homepageApi } from '@/lib/api';

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
  const [content, setContent] = useState<HomepageContent>(defaultContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadContent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await homepageApi.getHomepageContent();
      if (response.data.success) {
        if (response.data.data) {
          setContent(response.data.data);
        } else {
          // No content in database - start with empty form
          setContent(defaultContent);
        }
      } else {
        setContent(defaultContent);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
      setContent(defaultContent);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const saveContent = async () => {
    setSaving(true);
    try {
      await homepageApi.updateHomepageContent(content as unknown as Record<string, unknown>);
      toast.success('Content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-900">Loading content...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Homepage Content Editor</h1>
        <Button 
          onClick={saveContent} 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={content.hero.title}
                onChange={(e) => updateContent('hero', 'title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input
                id="hero-subtitle"
                value={content.hero.subtitle}
                onChange={(e) => updateContent('hero', 'subtitle', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hero-bg">Background Image URL</Label>
              <Input
                id="hero-bg"
                value={content.hero.backgroundImage}
                onChange={(e) => updateContent('hero', 'backgroundImage', e.target.value)}
                placeholder="/image.png"
              />
            </div>
          </CardContent>
        </Card>

        {/* Why Visit Section */}
        <Card>
          <CardHeader>
            <CardTitle>Why Visit Kazakhstan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="whyvisit-title">Section Title</Label>
              <Input
                id="whyvisit-title"
                value={content.whyVisit.title}
                onChange={(e) => updateContent('whyVisit', 'title', e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Features</h3>
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
                  Add Feature
                </Button>
              </div>
              {content.whyVisit.features.map((feature, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Feature {index + 1}</h4>
                    <Button
                      onClick={() => removeArrayItem('whyVisit', 'features', index)}
                      size="sm"
                      variant="destructive"
                    >
                      Remove
                    </Button>
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={feature.title}
                      onChange={(e) => updateArrayItem('whyVisit', 'features', index, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Description (shown when + button is clicked)</Label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => updateArrayItem('whyVisit', 'features', index, 'description', e.target.value)}
                      placeholder="Enter description that appears when user clicks the + button..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      value={feature.image}
                      onChange={(e) => updateArrayItem('whyVisit', 'features', index, 'image', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Background Gradient</Label>
                    <Input
                      value={feature.bgColor}
                      onChange={(e) => updateArrayItem('whyVisit', 'features', index, 'bgColor', e.target.value)}
                      placeholder="from-blue-400 to-blue-600"
                    />
                  </div>
                  <div>
                    <Label>Order</Label>
                    <Input
                      type="number"
                      value={feature.order}
                      onChange={(e) => updateArrayItem('whyVisit', 'features', index, 'order', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instagram Section */}
        <Card>
          <CardHeader>
            <CardTitle>Instagram Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="instagram-handle">Instagram Handle</Label>
              <Input
                id="instagram-handle"
                value={content.instagram.handle}
                onChange={(e) => updateContent('instagram', 'handle', e.target.value)}
                placeholder="@into.kazakhstan"
              />
            </div>
            <div>
              <Label htmlFor="instagram-title">Title</Label>
              <Input
                id="instagram-title"
                value={content.instagram.title}
                onChange={(e) => updateContent('instagram', 'title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="instagram-desc">Description</Label>
              <Textarea
                id="instagram-desc"
                value={content.instagram.description}
                onChange={(e) => updateContent('instagram', 'description', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Instagram Posts</h3>
                <Button
                  onClick={() => addArrayItem('instagram', 'posts', {
                    image: '/placeholder.jpg',
                    alt: 'New post',
                    order: content.instagram.posts.length + 1
                  })}
                  size="sm"
                  variant="outline"
                >
                  Add Post
                </Button>
              </div>
              {content.instagram.posts.map((post, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Post {index + 1}</h4>
                    <Button
                      onClick={() => removeArrayItem('instagram', 'posts', index)}
                      size="sm"
                      variant="destructive"
                    >
                      Remove
                    </Button>
                  </div>
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      value={post.image}
                      onChange={(e) => updateArrayItem('instagram', 'posts', index, 'image', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Alt Text</Label>
                    <Input
                      value={post.alt}
                      onChange={(e) => updateArrayItem('instagram', 'posts', index, 'alt', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="mt-8">
        <Button 
          onClick={saveContent} 
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  );
}