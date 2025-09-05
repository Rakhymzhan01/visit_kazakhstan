'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Edit, Star } from 'lucide-react';
import { categoriesApi } from '@/lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  featured: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [stats, setStats] = useState<{ total: number; active: number; inactive: number; featured: number } | null>(null);

  // Form state for new/edit category
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    image: string;
    featured: boolean;
    status: 'ACTIVE' | 'INACTIVE';
    displayOrder: number;
  }>({
    name: '',
    description: '',
    image: '',
    featured: false,
    status: 'ACTIVE',
    displayOrder: 0,
  });

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await categoriesApi.getCategories();
      
      if (response.data.success) {
        const categoriesData = response.data.data.categories || [];
        // Sort by display order
        categoriesData.sort((a: Category, b: Category) => a.displayOrder - b.displayOrder);
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const response = await categoriesApi.getCategoryStats();
      if (response.data.success) {
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    loadStats();
  }, [loadCategories, loadStats]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      featured: false,
      status: 'ACTIVE',
      displayOrder: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please fill in the category name');
      return;
    }

    setSaving(true);
    try {
      if (editingCategory) {
        // Update existing category
        await categoriesApi.updateCategory(editingCategory.id, formData);
        toast.success('Category updated successfully');
      } else {
        // Create new category
        await categoriesApi.createCategory(formData);
        toast.success('Category created successfully');
      }
      
      resetForm();
      setEditingCategory(null);
      setShowAddForm(false);
      loadCategories();
      loadStats();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      featured: category.featured,
      status: category.status,
      displayOrder: category.displayOrder,
    });
    setEditingCategory(category);
    setShowAddForm(true);
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;

    try {
      await categoriesApi.deleteCategory(category.id);
      toast.success('Category deleted successfully');
      loadCategories();
      loadStats();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleAddNew = () => {
    resetForm();
    setEditingCategory(null);
    setShowAddForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-900">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
        <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Category
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-gray-600">Total Categories</div>
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
              <div className="text-2xl font-bold text-yellow-600">{stats.inactive}</div>
              <div className="text-gray-600">Inactive</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600">{stats.featured}</div>
              <div className="text-gray-600">Featured</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Nature Escapes"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    min="0"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
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
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the category..."
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
                  Featured Category
                </label>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingCategory(null);
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

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Categories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No categories found. Click &quot;Add New Category&quot; to create your first category.
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                        {category.featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          category.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {category.status}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Order: {category.displayOrder}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Slug:</span> {category.slug}
                      </div>
                      {category.description && (
                        <p className="text-sm text-gray-700 mt-1">
                          {category.description}
                        </p>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        Created: {new Date(category.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(category)}
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