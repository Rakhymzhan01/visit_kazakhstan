'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'react-hot-toast';
import { contentApi } from '@/lib/api';

interface ContentItem {
  id: string;
  page: string;
  section: string;
  key: string;
  type: string;
  value: string;
  metadata?: Record<string, unknown>;
}

interface HomepageContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  whyVisit: {
    title: string;
    items: Array<{
      title: string;
      image: string;
      bgColor: string;
    }>;
  };
  topTours: {
    title: string;
    description: string;
    tours: Array<{
      title: string;
      description: string;
      image: string;
      date: string;
      location: string;
      rating: number;
    }>;
  };
  cities: {
    title: string;
    description: string;
    mapImage: string;
  };
  instagram: {
    handle: string;
    description: string;
    images: string[];
  };
  about: {
    title: string;
    description: string;
    stats: Array<{
      value: string;
      description: string;
    }>;
  };
}

const defaultContent: HomepageContent = {
  hero: {
    title: "Your Next Best Trip,",
    subtitle: "Return Inspired", 
    backgroundImage: "/image.png"
  },
  whyVisit: {
    title: "Why Visit Kazakhstan",
    items: [
      { title: "Silk Road History", image: "/desert.jpg", bgColor: "from-blue-400 to-blue-600" },
      { title: "Nomadic Soul", image: "/shanyrak.jpg", bgColor: "from-amber-600 to-amber-800" },
      { title: "Modern Meets Traditional", image: "/baiterek.jpg", bgColor: "from-orange-400 to-orange-600" },
      { title: "No Crowds, Just Space", image: "/kanatnaya_doroga.jpg", bgColor: "from-red-400 to-red-600" },
      { title: "Unspoiled Nature", image: "/yurta.jpg", bgColor: "from-green-400 to-green-600" }
    ]
  },
  topTours: {
    title: "Top Tour Themes",
    description: "Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you're chasing landscapes, culture, adventure, or spiritual meaning, there's a route for every traveler.",
    tours: [
      {
        title: "Charyn Canyon & Kolsai Lakes Tour",
        description: "A classic multi-day trip from Almaty into the Tian Shan mountains — explore canyons, alpine lakes, and mountain villages.",
        image: "/bao_contras.jpg",
        date: "20 may 2025",
        location: "Almaty",
        rating: 5
      }
    ]
  },
  cities: {
    title: "Discover Cities",
    description: "Kazakhstan's cities reflect the country's past, present, and future — from ancient Silk Road stops to futuristic capitals, sleepy desert towns to cultural and academic centers. Each has its own character, rhythm, and reason to explore.",
    mapImage: "/kz_map.png"
  },
  instagram: {
    handle: "@into.kazakhstan",
    description: "Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you're chasing landscapes, culture, adventure, or spiritual meaning, there's a route for every traveler.",
    images: ["/nomad_girls.png", "/desert.jpg", "/yurta.jpg"]
  },
  about: {
    title: "About  us",
    description: "Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you're chasing landscapes, culture, adventure, or spiritual meaning, there's a route for every traveler.",
    stats: [
      { value: "2010", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
      { value: "50+", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
      { value: "1000+", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
      { value: "20", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." }
    ]
  }
};

export default function HomepageContentEditor() {
  const [content, setContent] = useState<HomepageContent>(defaultContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadContent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await contentApi.getPageContent('homepage');
      if (response.data.success && response.data.data.content.length > 0) {
        // Transform API content to our format
        const transformedContent = transformApiContent(response.data.data.content);
        setContent({ ...defaultContent, ...transformedContent });
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const transformApiContent = (apiContent: ContentItem[]): Partial<HomepageContent> => {
    const transformed: Record<string, Record<string, unknown>> = {};
    
    apiContent.forEach(item => {
      if (!transformed[item.section]) {
        transformed[item.section] = {};
      }
      
      if (item.type === 'json') {
        try {
          transformed[item.section][item.key] = JSON.parse(item.value);
        } catch {
          transformed[item.section][item.key] = item.value;
        }
      } else {
        transformed[item.section][item.key] = item.value;
      }
    });
    
    return transformed;
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const updates = [];

      // Hero section
      updates.push(
        { page: 'homepage', section: 'hero', key: 'title', type: 'text', value: content.hero.title },
        { page: 'homepage', section: 'hero', key: 'subtitle', type: 'text', value: content.hero.subtitle }
      );

      // Why Visit section
      updates.push(
        { page: 'homepage', section: 'whyVisit', key: 'title', type: 'text', value: content.whyVisit.title },
        { page: 'homepage', section: 'whyVisit', key: 'items', type: 'json', value: JSON.stringify(content.whyVisit.items) }
      );

      // Top Tours section
      updates.push(
        { page: 'homepage', section: 'topTours', key: 'title', type: 'text', value: content.topTours.title },
        { page: 'homepage', section: 'topTours', key: 'description', type: 'text', value: content.topTours.description },
        { page: 'homepage', section: 'topTours', key: 'tours', type: 'json', value: JSON.stringify(content.topTours.tours) }
      );

      // Cities section
      updates.push(
        { page: 'homepage', section: 'cities', key: 'title', type: 'text', value: content.cities.title },
        { page: 'homepage', section: 'cities', key: 'description', type: 'text', value: content.cities.description }
      );

      // Instagram section
      updates.push(
        { page: 'homepage', section: 'instagram', key: 'handle', type: 'text', value: content.instagram.handle },
        { page: 'homepage', section: 'instagram', key: 'description', type: 'text', value: content.instagram.description }
      );

      // About section
      updates.push(
        { page: 'homepage', section: 'about', key: 'title', type: 'text', value: content.about.title },
        { page: 'homepage', section: 'about', key: 'description', type: 'text', value: content.about.description },
        { page: 'homepage', section: 'about', key: 'stats', type: 'json', value: JSON.stringify(content.about.stats) }
      );

      await contentApi.bulkUpdateContent({ updates });
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
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateArrayItem = (section: keyof HomepageContent, key: string, index: number, field: string, value: unknown) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key]: ((prev[section] as any)[key] as any[]).map((item: any, i: number) => 
          i === index ? { ...item, [field]: value } : item
        )
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
              <h3 className="text-lg font-semibold text-gray-900">Items</h3>
              {content.whyVisit.items.map((item, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-2">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => updateArrayItem('whyVisit', 'items', index, 'title', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Tours Section */}
        <Card>
          <CardHeader>
            <CardTitle>Top Tour Themes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="toptours-title">Section Title</Label>
              <Input
                id="toptours-title"
                value={content.topTours.title}
                onChange={(e) => updateContent('topTours', 'title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="toptours-desc">Description</Label>
              <Textarea
                id="toptours-desc"
                value={content.topTours.description}
                onChange={(e) => updateContent('topTours', 'description', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Cities Section */}
        <Card>
          <CardHeader>
            <CardTitle>Discover Cities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cities-title">Section Title</Label>
              <Input
                id="cities-title"
                value={content.cities.title}
                onChange={(e) => updateContent('cities', 'title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cities-desc">Description</Label>
              <Textarea
                id="cities-desc"
                value={content.cities.description}
                onChange={(e) => updateContent('cities', 'description', e.target.value)}
                rows={3}
              />
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
              <Label htmlFor="instagram-desc">Description</Label>
              <Textarea
                id="instagram-desc"
                value={content.instagram.description}
                onChange={(e) => updateContent('instagram', 'description', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle>About Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="about-title">Section Title</Label>
              <Input
                id="about-title"
                value={content.about.title}
                onChange={(e) => updateContent('about', 'title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="about-desc">Description</Label>
              <Textarea
                id="about-desc"
                value={content.about.description}
                onChange={(e) => updateContent('about', 'description', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
              {content.about.stats.map((stat, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-2">
                  <div>
                    <Label>Value</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => updateArrayItem('about', 'stats', index, 'value', e.target.value)}
                      placeholder="2010"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={stat.description}
                      onChange={(e) => updateArrayItem('about', 'stats', index, 'description', e.target.value)}
                      placeholder="Description text"
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