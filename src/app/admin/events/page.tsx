'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Edit, Star, Calendar, MapPin } from 'lucide-react';
import { eventsApi } from '@/lib/api';
import Image from 'next/image';

interface Event {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  image: string;
  category: string;
  date: string;
  location?: string;
  featured: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  price?: string;
  time?: string;
  duration?: string;
  organizer?: string;
  website?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [stats, setStats] = useState<{ 
    totalEvents: number; 
    publishedEvents: number; 
    draftEvents: number; 
    featuredEvents: number;
  } | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Form state for new/edit event
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    image: string;
    category: string;
    date: string;
    location: string;
    featured: boolean;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    price: string;
    time: string;
    duration: string;
    organizer: string;
    website: string;
    tags: string[];
  }>({
    title: '',
    description: '',
    image: '',
    category: '',
    date: '',
    location: '',
    featured: false,
    status: 'PUBLISHED',
    price: '',
    time: '',
    duration: '',
    organizer: '',
    website: '',
    tags: [],
  });

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params: { category?: string } = {};
      if (selectedCategory) params.category = selectedCategory;
      
      const response = await eventsApi.getEvents(params);
      
      if (response.data.success) {
        const eventsData = response.data.data.events || [];
        setEvents(eventsData);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  const loadStats = useCallback(async () => {
    try {
      const response = await eventsApi.getEventStats();
      if (response.data.success) {
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []);

  useEffect(() => {
    loadEvents();
    loadStats();
  }, [loadEvents, loadStats]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      category: '',
      date: '',
      location: '',
      featured: false,
      status: 'PUBLISHED',
      price: '',
      time: '',
      duration: '',
      organizer: '',
      website: '',
      tags: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image.trim() || !formData.date) {
      toast.error('Please fill in required fields (title, image, date)');
      return;
    }

    setSaving(true);
    try {
      // Prepare data for submission
      const submitData: Record<string, unknown> = {
        ...formData,
        tags: formData.tags.filter(tag => tag.trim() !== ''),
      };

      if (editingEvent) {
        // Update existing event
        await eventsApi.updateEvent(editingEvent._id, submitData);
        toast.success('Event updated successfully');
      } else {
        // Create new event
        await eventsApi.createEvent(submitData);
        toast.success('Event created successfully');
      }
      
      resetForm();
      setEditingEvent(null);
      setShowAddForm(false);
      loadEvents();
      loadStats();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      description: event.description || '',
      image: event.image,
      category: event.category,
      date: event.date,
      location: event.location || '',
      featured: event.featured,
      status: event.status,
      price: event.price || '',
      time: event.time || '',
      duration: event.duration || '',
      organizer: event.organizer || '',
      website: event.website || '',
      tags: event.tags || [],
    });
    setEditingEvent(event);
    setShowAddForm(true);
  };

  const handleDelete = async (event: Event) => {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) return;

    try {
      await eventsApi.deleteEvent(event._id);
      toast.success('Event deleted successfully');
      loadEvents();
      loadStats();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleAddNew = () => {
    resetForm();
    setEditingEvent(null);
    setShowAddForm(true);
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const updateTag = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }));
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-900">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
        <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Event
        </Button>
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
          <option value="Music">Music</option>
          <option value="Culture">Culture</option>
          <option value="Conference">Conference</option>
          <option value="Festival">Festival</option>
          <option value="Sports">Sports</option>
          <option value="Business">Business</option>
        </select>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">{stats.totalEvents}</div>
              <div className="text-gray-600">Total Events</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{stats.publishedEvents}</div>
              <div className="text-gray-600">Published</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.draftEvents}</div>
              <div className="text-gray-600">Drafts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600">{stats.featuredEvents}</div>
              <div className="text-gray-600">Featured</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Spring Music Festival"
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
                      <option value="">Select Category</option>
                      <option value="Music">Music</option>
                      <option value="Culture">Culture</option>
                      <option value="Conference">Conference</option>
                      <option value="Festival">Festival</option>
                      <option value="Sports">Sports</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., Almaty, Kazakhstan"
                    />
                  </div>
                  <div>
                    <Label htmlFor="organizer">Organizer</Label>
                    <Input
                      id="organizer"
                      value={formData.organizer}
                      onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                      placeholder="Organization or person name"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Event description..."
                  />
                </div>
              </div>

              {/* Media & Details */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-4">Media & Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="image">Image URL *</Label>
                    <Input
                      id="image"
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://example.com/event-image.jpg"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://event-website.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="Free / $50 / Varies"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="2 hours / All day / 3 days"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      placeholder="Enter tag..."
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => removeTag(index)}
                      className="text-red-600"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={addTag} variant="outline">
                  Add Tag
                </Button>
              </div>

              {/* Settings */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-4">Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-4 mt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="mr-2"
                      />
                      Featured Event
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingEvent(null);
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

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Events ({events.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No events found. Click &quot;Add New Event&quot; to create your first event.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <div key={event._id} className="border rounded-lg p-4 space-y-2">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    {event.featured && (
                      <div className="absolute top-2 left-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.location}
                      </div>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.category === 'Music' ? 'bg-purple-100 text-purple-800' :
                        event.category === 'Culture' ? 'bg-blue-100 text-blue-800' :
                        event.category === 'Festival' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                        event.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                      {event.featured && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                    <div className="text-xs text-gray-500">
                      Created: {new Date(event.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(event)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(event)}
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