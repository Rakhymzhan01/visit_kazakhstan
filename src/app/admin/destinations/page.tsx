'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Edit, Eye, EyeOff, Star, MapPin } from 'lucide-react';
import { destinationsApi } from '@/lib/api';
import Image from 'next/image';

interface Destination {
  _id: string;
  name: string;
  slug: string;
  subtitle?: string;
  description: string;
  content: string;
  image: string;
  gallery?: string[];
  category: 'nature' | 'culture' | 'cities';
  subcategory?: string;
  location: string;
  highlights: string[];
  featured: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  displayOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  price?: string;
  rating?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  activities?: string[];
  facilities?: string[];
  tips?: string[];
  bestTime?: string;
  duration?: string;
  difficulty?: string;
  era?: string;
  type?: string;
  region?: string;
  population?: string;
  founded?: string;
  createdAt: string;
  updatedAt: string;
}

export default function DestinationsAdmin() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [stats, setStats] = useState<{ 
    totalDestinations: number; 
    activeDestinations: number; 
    inactiveDestinations: number; 
    featuredDestinations: number;
    natureDestinations: number;
    cultureDestinations: number;
    citiesDestinations: number;
  } | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Form state for new/edit destination
  const [formData, setFormData] = useState<{
    name: string;
    subtitle: string;
    description: string;
    content: string;
    image: string;
    gallery: string[];
    category: 'nature' | 'culture' | 'cities';
    subcategory: string;
    location: string;
    highlights: string[];
    featured: boolean;
    status: 'ACTIVE' | 'INACTIVE';
    displayOrder: number;
    seoTitle: string;
    seoDescription: string;
    price: string;
    rating: number;
    coordinates: { lat: string; lng: string };
    activities: string[];
    facilities: string[];
    tips: string[];
    bestTime: string;
    duration: string;
    difficulty: string;
    era: string;
    type: string;
    region: string;
    population: string;
    founded: string;
  }>({
    name: '',
    subtitle: '',
    description: '',
    content: '',
    image: '',
    gallery: [],
    category: 'nature',
    subcategory: '',
    location: '',
    highlights: [],
    featured: false,
    status: 'ACTIVE',
    displayOrder: 0,
    seoTitle: '',
    seoDescription: '',
    price: '',
    rating: 5,
    coordinates: { lat: '', lng: '' },
    activities: [],
    facilities: [],
    tips: [],
    bestTime: '',
    duration: '',
    difficulty: '',
    era: '',
    type: '',
    region: '',
    population: '',
    founded: '',
  });

  const loadDestinations = useCallback(async () => {
    setLoading(true);
    try {
      const params: { category?: string } = {};
      if (selectedCategory) params.category = selectedCategory;
      
      const response = await destinationsApi.getDestinations(params);
      
      if (response.data.success) {
        const destinationsData = response.data.data.destinations || [];
        setDestinations(destinationsData);
      }
    } catch (error) {
      console.error('Error loading destinations:', error);
      toast.error('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  const loadStats = useCallback(async () => {
    try {
      const response = await destinationsApi.getDestinationStats();
      if (response.data.success) {
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []);

  useEffect(() => {
    loadDestinations();
    loadStats();
  }, [loadDestinations, loadStats]);

  const resetForm = () => {
    setFormData({
      name: '',
      subtitle: '',
      description: '',
      content: '',
      image: '',
      gallery: [],
      category: 'nature',
      subcategory: '',
      location: '',
      highlights: [],
      featured: false,
      status: 'ACTIVE',
      displayOrder: 0,
      seoTitle: '',
      seoDescription: '',
      price: '',
      rating: 5,
      coordinates: { lat: '', lng: '' },
      activities: [],
      facilities: [],
      tips: [],
      bestTime: '',
      duration: '',
      difficulty: '',
      era: '',
      type: '',
      region: '',
      population: '',
      founded: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || !formData.content.trim()) {
      toast.error('Please fill in required fields (name, description, content)');
      return;
    }

    setSaving(true);
    try {
      // Prepare data for submission
      const submitData: Record<string, unknown> = {
        ...formData,
        coordinates: formData.coordinates.lat && formData.coordinates.lng ? {
          lat: parseFloat(formData.coordinates.lat),
          lng: parseFloat(formData.coordinates.lng)
        } : undefined,
        gallery: formData.gallery.filter(url => url.trim() !== ''),
        highlights: formData.highlights.filter(h => h.trim() !== ''),
        activities: formData.activities.filter(a => a.trim() !== ''),
        facilities: formData.facilities.filter(f => f.trim() !== ''),
        tips: formData.tips.filter(t => t.trim() !== ''),
      };

      if (editingDestination) {
        // Update existing destination
        await destinationsApi.updateDestination(editingDestination._id, submitData);
        toast.success('Destination updated successfully');
      } else {
        // Create new destination
        await destinationsApi.createDestination(submitData);
        toast.success('Destination created successfully');
      }
      
      resetForm();
      setEditingDestination(null);
      setShowAddForm(false);
      loadDestinations();
      loadStats();
    } catch (error) {
      console.error('Error saving destination:', error);
      toast.error('Failed to save destination');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (destination: Destination) => {
    setFormData({
      name: destination.name,
      subtitle: destination.subtitle || '',
      description: destination.description,
      content: destination.content,
      image: destination.image,
      gallery: destination.gallery || [],
      category: destination.category,
      subcategory: destination.subcategory || '',
      location: destination.location,
      highlights: destination.highlights || [],
      featured: destination.featured,
      status: destination.status,
      displayOrder: destination.displayOrder,
      seoTitle: destination.seoTitle || '',
      seoDescription: destination.seoDescription || '',
      price: destination.price || '',
      rating: destination.rating || 5,
      coordinates: {
        lat: destination.coordinates?.lat?.toString() || '',
        lng: destination.coordinates?.lng?.toString() || ''
      },
      activities: destination.activities || [],
      facilities: destination.facilities || [],
      tips: destination.tips || [],
      bestTime: destination.bestTime || '',
      duration: destination.duration || '',
      difficulty: destination.difficulty || '',
      era: destination.era || '',
      type: destination.type || '',
      region: destination.region || '',
      population: destination.population || '',
      founded: destination.founded || '',
    });
    setEditingDestination(destination);
    setShowAddForm(true);
  };

  const handleDelete = async (destination: Destination) => {
    if (!confirm(`Are you sure you want to delete "${destination.name}"?`)) return;

    try {
      await destinationsApi.deleteDestination(destination._id);
      toast.success('Destination deleted successfully');
      loadDestinations();
      loadStats();
    } catch (error) {
      console.error('Error deleting destination:', error);
      toast.error('Failed to delete destination');
    }
  };

  const handleAddNew = () => {
    resetForm();
    setEditingDestination(null);
    setShowAddForm(true);
  };

  const handleImportData = async () => {
    if (!confirm('This will import sample destination data. Continue?')) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/migrate/destinations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(`Successfully imported ${result.data.imported} destinations!`);
        loadDestinations();
        loadStats();
      } else {
        toast.error('Failed to import data');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data');
    } finally {
      setSaving(false);
    }
  };

  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, '']
    }));
  };

  const updateHighlight = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => i === index ? value : h)
    }));
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-900">Loading destinations...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Destinations Management</h1>
        <div className="flex gap-2">
          <Button 
            onClick={handleImportData} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={saving}
          >
            {saving ? 'Importing...' : 'Import Sample Data'}
          </Button>
          <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Destination
          </Button>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <Label htmlFor="categoryFilter">Filter by Category</Label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="ml-2 px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Categories</option>
          <option value="nature">Nature</option>
          <option value="culture">Culture</option>
          <option value="cities">Cities</option>
        </select>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">{stats.totalDestinations}</div>
              <div className="text-gray-600">Total Destinations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{stats.activeDestinations}</div>
              <div className="text-gray-600">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.featuredDestinations}</div>
              <div className="text-gray-600">Featured</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">
                {stats.natureDestinations + stats.cultureDestinations + stats.citiesDestinations}
              </div>
              <div className="text-gray-600">By Category</div>
              <div className="text-xs text-gray-500 mt-1">
                Nature: {stats.natureDestinations} | Culture: {stats.cultureDestinations} | Cities: {stats.citiesDestinations}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingDestination ? 'Edit Destination' : 'Add New Destination'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Lake Kaindy"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Optional subtitle"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'nature' | 'culture' | 'cities' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="nature">Nature</option>
                      <option value="culture">Culture</option>
                      <option value="cities">Cities</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., Almaty Region, Kazakhstan"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description for cards..."
                    required
                  />
                </div>

                <div className="mt-4">
                  <Label htmlFor="content">Detailed Content *</Label>
                  <Textarea
                    id="content"
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Detailed content for the destination page..."
                    required
                  />
                </div>
              </div>

              {/* Media */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-4">Media</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="image">Main Image URL *</Label>
                    <Input
                      id="image"
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="gallery">Gallery Images (comma-separated URLs)</Label>
                    <Textarea
                      id="gallery"
                      rows={2}
                      value={formData.gallery.join(', ')}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        gallery: e.target.value.split(',').map(url => url.trim()) 
                      }))}
                      placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-4">Highlights</h3>
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={highlight}
                      onChange={(e) => updateHighlight(index, e.target.value)}
                      placeholder="Enter highlight..."
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => removeHighlight(index)}
                      className="text-red-600"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={addHighlight} variant="outline">
                  Add Highlight
                </Button>
              </div>

              {/* Settings */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-4">Settings</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'ACTIVE' | 'INACTIVE' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="displayOrder">Display Order</Label>
                    <Input
                      id="displayOrder"
                      type="number"
                      min="0"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) || 5 }))}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="mr-2"
                    />
                    Featured Destination
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : (editingDestination ? 'Update Destination' : 'Create Destination')}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingDestination(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Destinations List */}
      <Card>
        <CardHeader>
          <CardTitle>Destinations ({destinations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {destinations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No destinations found. Click &quot;Add New Destination&quot; to create your first destination.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {destinations.map((destination) => (
                <div key={destination._id} className="border rounded-lg p-4 space-y-2">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className="object-cover"
                    />
                    {destination.featured && (
                      <div className="absolute top-2 left-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      {destination.status === 'ACTIVE' ? (
                        <Eye className="w-4 h-4 text-green-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">{destination.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-3 h-3 mr-1" />
                      {destination.location}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        destination.category === 'nature' ? 'bg-green-100 text-green-800' :
                        destination.category === 'culture' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {destination.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        destination.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {destination.status}
                      </span>
                      {destination.featured && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {destination.description}
                    </p>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(destination.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(destination)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(destination)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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