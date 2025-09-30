'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import { categoryPageInfoApi } from '@/lib/api';

interface CategoryPageInfo {
  _id: string;
  categorySlug: string;
  title: string;
  subtitle?: string;
  description: string;
  heroImage?: string;
  heroText?: string;
  seoTitle?: string;
  seoDescription?: string;
  sections?: Array<{
    title: string;
    content: string;
    image?: string;
    order: number;
  }>;
  features?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export default function CategoryPagesAdmin() {
  const [categoryPages, setCategoryPages] = useState<CategoryPageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingPage, setEditingPage] = useState<CategoryPageInfo | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [stats, setStats] = useState<{ total: number; active: number; inactive: number } | null>(null);

  // Form state for new/edit category page
  const [formData, setFormData] = useState<{
    categorySlug: string;
    title: string;
    subtitle: string;
    description: string;
    heroImage: string;
    heroText: string;
    seoTitle: string;
    seoDescription: string;
    status: 'ACTIVE' | 'INACTIVE';
    sections: Array<{
      title: string;
      content: string;
      image?: string;
      order: number;
    }>;
    features: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
  }>({
    categorySlug: '',
    title: '',
    subtitle: '',
    description: '',
    heroImage: '',
    heroText: '',
    seoTitle: '',
    seoDescription: '',
    status: 'ACTIVE',
    sections: [],
    features: [],
  });

  const loadCategoryPages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await categoryPageInfoApi.getCategoryPageInfos();
      
      if (response.data.success) {
        const pagesData = response.data.data.categoryPageInfos || [];
        setCategoryPages(pagesData);
      }
    } catch (error) {
      console.error('Error loading category pages:', error);
      toast.error('Failed to load category pages');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const response = await categoryPageInfoApi.getCategoryPageInfoStats();
      if (response.data.success) {
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []);

  useEffect(() => {
    loadCategoryPages();
    loadStats();
  }, [loadCategoryPages, loadStats]);

  const resetForm = () => {
    setFormData({
      categorySlug: '',
      title: '',
      subtitle: '',
      description: '',
      heroImage: '',
      heroText: '',
      seoTitle: '',
      seoDescription: '',
      status: 'ACTIVE',
      sections: [],
      features: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.categorySlug.trim()) {
      toast.error('Please fill in required fields (title and category slug)');
      return;
    }

    setSaving(true);
    try {
      if (editingPage) {
        // Update existing page
        await categoryPageInfoApi.updateCategoryPageInfo(editingPage._id, formData);
        toast.success('Category page updated successfully');
      } else {
        // Create new page
        await categoryPageInfoApi.createCategoryPageInfo(formData);
        toast.success('Category page created successfully');
      }
      
      resetForm();
      setEditingPage(null);
      setShowAddForm(false);
      loadCategoryPages();
      loadStats();
    } catch (error) {
      console.error('Error saving category page:', error);
      toast.error('Failed to save category page');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (page: CategoryPageInfo) => {
    setFormData({
      categorySlug: page.categorySlug,
      title: page.title,
      subtitle: page.subtitle || '',
      description: page.description,
      heroImage: page.heroImage || '',
      heroText: page.heroText || '',
      seoTitle: page.seoTitle || '',
      seoDescription: page.seoDescription || '',
      status: page.status,
      sections: page.sections || [],
      features: page.features || [],
    });
    setEditingPage(page);
    setShowAddForm(true);
  };

  const handleDelete = async (page: CategoryPageInfo) => {
    if (!confirm(`Are you sure you want to delete "${page.title}"?`)) return;

    try {
      await categoryPageInfoApi.deleteCategoryPageInfo(page._id);
      toast.success('Category page deleted successfully');
      loadCategoryPages();
      loadStats();
    } catch (error) {
      console.error('Error deleting category page:', error);
      toast.error('Failed to delete category page');
    }
  };

  const handleAddNew = () => {
    resetForm();
    setEditingPage(null);
    setShowAddForm(true);
  };

  // Removed unused functions for now - can be added back when needed

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-900">Loading category pages...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Category Pages Management</h1>
        <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Category Page
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-gray-600">Total Pages</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-gray-600">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
              <div className="text-gray-600">Inactive</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingPage ? 'Edit Category Page' : 'Add New Category Page'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="categorySlug">Category Slug *</Label>
                  <Input
                    id="categorySlug"
                    value={formData.categorySlug}
                    onChange={(e) => setFormData(prev => ({ ...prev, categorySlug: e.target.value }))}
                    placeholder="e.g., nature, culture, cities"
                    required
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Nature Escapes"
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
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the category..."
                  required
                />
              </div>

              {/* Hero Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="heroImage">Hero Image URL</Label>
                    <Input
                      id="heroImage"
                      type="url"
                      value={formData.heroImage}
                      onChange={(e) => setFormData(prev => ({ ...prev, heroImage: e.target.value }))}
                      placeholder="https://example.com/hero.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="heroText">Hero Text</Label>
                    <Input
                      id="heroText"
                      value={formData.heroText}
                      onChange={(e) => setFormData(prev => ({ ...prev, heroText: e.target.value }))}
                      placeholder="Hero section text"
                    />
                  </div>
                </div>
              </div>

              {/* SEO */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="seoTitle">SEO Title</Label>
                    <Input
                      id="seoTitle"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                      placeholder="SEO title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seoDescription">SEO Description</Label>
                    <Textarea
                      id="seoDescription"
                      rows={2}
                      value={formData.seoDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                      placeholder="SEO description"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : (editingPage ? 'Update Page' : 'Create Page')}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingPage(null);
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

      {/* Category Pages List */}
      <Card>
        <CardHeader>
          <CardTitle>Category Pages ({categoryPages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryPages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No category pages found. Click &quot;Add New Category Page&quot; to create your first page.
            </div>
          ) : (
            <div className="space-y-4">
              {categoryPages.map((page) => (
                <div key={page._id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{page.title}</h3>
                        {page.status === 'ACTIVE' ? (
                          <Eye className="w-4 h-4 text-green-500" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          page.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {page.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Slug:</span> {page.categorySlug}
                      </div>
                      {page.subtitle && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Subtitle:</span> {page.subtitle}
                        </div>
                      )}
                      <p className="text-sm text-gray-700 mt-1">
                        {page.description}
                      </p>
                      <div className="text-xs text-gray-500 mt-2">
                        Created: {new Date(page.createdAt).toLocaleDateString()} | 
                        Updated: {new Date(page.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(page)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(page)}
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