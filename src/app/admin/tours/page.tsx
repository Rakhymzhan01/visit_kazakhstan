'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Edit, Star } from 'lucide-react';
import { toursApi, categoriesApi } from '@/lib/api';

interface Tour {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image: string;
  category: string;
  rating: number;
  date?: string;
  location?: string;
  price?: number;
  duration?: string;
  featured: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export default function ToursAdmin() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<Array<{ name: string; id: string }>>([]);
  const [stats, setStats] = useState<{ totalTours: number; publishedTours: number; draftTours: number; featuredTours: number } | null>(null);

  // Form state for new/edit tour
  const [formData, setFormData] = useState<{
    title: string;
    category: string;
    description: string;
    image: string;
    rating: number;
    date: string;
    location: string;
    price: number;
    duration: string;
    featured: boolean;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  }>({
    title: '',
    category: '',
    description: '',
    image: '',
    rating: 5,
    date: '',
    location: '',
    price: 0,
    duration: '',
    featured: false,
    status: 'PUBLISHED',
  });

  const loadTours = useCallback(async () => {
    setLoading(true);
    try {
      const response = await toursApi.getTours({ 
        category: selectedCategory === 'all' ? undefined : selectedCategory 
      });
      
      if (response.data.success) {
        const toursData = response.data.data.tours || [];
        setTours(toursData);
      }
    } catch (error) {
      console.error('Error loading tours:', error);
      toast.error('Failed to load tours');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await categoriesApi.getCategories();
      if (response.data.success) {
        setCategories(response.data.data.categories || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const response = await toursApi.getTourStats();
      if (response.data.success) {
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []);

  useEffect(() => {
    loadTours();
    loadStats();
    loadCategories();
  }, [loadTours, loadStats, loadCategories]);

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      image: '',
      rating: 5,
      date: '',
      location: '',
      price: 0,
      duration: '',
      featured: false,
      status: 'PUBLISHED',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.category.trim() || !formData.image.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      if (editingTour) {
        // Update existing tour
        await toursApi.updateTour(editingTour.id, formData);
        toast.success('Tour updated successfully');
      } else {
        // Create new tour
        await toursApi.createTour(formData);
        toast.success('Tour created successfully');
      }
      
      resetForm();
      setEditingTour(null);
      setShowAddForm(false);
      loadTours();
    } catch (error: unknown) {
      console.error('Error saving tour:', error);
      
      // Show specific error message if available
      const axiosError = error as { response?: { data?: { error?: string; errors?: Array<{ msg: string }> } } };
      if (axiosError.response?.data?.error) {
        toast.error(axiosError.response.data.error);
      } else if (axiosError.response?.data?.errors) {
        // Handle validation errors
        const errorMsg = axiosError.response.data.errors.map((err) => err.msg).join(', ');
        toast.error(`Validation error: ${errorMsg}`);
      } else {
        toast.error('Failed to save tour');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (tour: Tour) => {
    setFormData({
      title: tour.title,
      category: tour.category,
      description: tour.description || '',
      image: tour.image,
      rating: tour.rating,
      date: tour.date || '',
      location: tour.location || '',
      price: tour.price || 0,
      duration: tour.duration || '',
      featured: tour.featured,
      status: tour.status,
    });
    setEditingTour(tour);
    setShowAddForm(true);
  };

  const handleDelete = async (tour: Tour) => {
    if (!confirm(`Are you sure you want to delete "${tour.title}"?`)) return;

    try {
      await toursApi.deleteTour(tour.id);
      toast.success('Tour deleted successfully');
      loadTours();
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast.error('Failed to delete tour');
    }
  };

  const handleAddNew = () => {
    resetForm();
    setEditingTour(null);
    setShowAddForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-900">Loading tours...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tours Management</h1>
        <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Tour
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">{stats.totalTours}</div>
              <div className="text-gray-600">Total Tours</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{stats.publishedTours}</div>
              <div className="text-gray-600">Published</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.draftTours}</div>
              <div className="text-gray-600">Drafts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600">{stats.featuredTours}</div>
              <div className="text-gray-600">Featured</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Categories ({tours.length})
          </button>
          {categories.map((category) => {
            const count = tours.filter(tour => tour.category === category.name).length;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  selectedCategory === category.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingTour ? 'Edit Tour' : 'Add New Tour'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-500 mt-1">
                    <a href="/admin/categories" className="text-blue-500 hover:text-blue-600">
                      Manage categories →
                    </a>
                  </div>
                </div>
                <div>
                  <Label htmlFor="image">Image URL *</Label>
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
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    placeholder="20 may 2025"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Almaty"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="3 days"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed tour description..."
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="mr-2"
                  />
                  Featured Tour
                </label>
                
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' }))}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : (editingTour ? 'Update Tour' : 'Create Tour')}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingTour(null);
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

      {/* Tours List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Tours ({selectedCategory === 'all' ? tours.length : tours.filter(t => t.category === selectedCategory).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tours.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tours found. Click &quot;Add New Tour&quot; to create your first tour.
            </div>
          ) : (
            <div className="space-y-4">
              {tours
                .filter(tour => selectedCategory === 'all' || tour.category === selectedCategory)
                .map((tour) => (
                <div key={tour.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{tour.title}</h3>
                        {tour.featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          tour.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                          tour.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {tour.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Category:</span> {tour.category}
                      </div>
                      {tour.location && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Location:</span> {tour.location}
                        </div>
                      )}
                      {tour.description && (
                        <p className="text-sm text-gray-700 mt-1">
                          {tour.description.substring(0, 150)}
                          {tour.description.length > 150 && '...'}
                        </p>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        Created: {new Date(tour.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(tour)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(tour)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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