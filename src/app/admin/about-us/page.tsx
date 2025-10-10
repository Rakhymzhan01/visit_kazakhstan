'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { aboutUsApi } from '@/lib/api';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Users,
  Edit3,
  Save,
  CheckCircle,
  X,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AboutUsAdminPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    aboutDescription: '',
    teamDescription: '',
    stats: [
      { value: '', description: '', order: 1 },
      { value: '', description: '', order: 2 },
      { value: '', description: '', order: 3 },
      { value: '', description: '', order: 4 },
    ],
    teamMembers: [
      { name: '', position: '', image: '', order: 1 },
      { name: '', position: '', image: '', order: 2 },
      { name: '', position: '', image: '', order: 3 },
      { name: '', position: '', image: '', order: 4 },
      { name: '', position: '', image: '', order: 5 },
    ],
    contact: {
      address: {
        street: '',
        city: '',
        country: '',
      },
      phone: '',
      email: '',
      mapImage: '',
    },
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  // Fetch public about us content
  const { data: aboutUsResponse, isLoading, error } = useQuery({
    queryKey: ['publicAboutUs'],
    queryFn: async () => {
      const response = await aboutUsApi.getPublicAboutUs();
      return response;
    },
    enabled: isAuthenticated,
  });

  // Extract the actual data from response - it's nested in response.data.data
  const aboutUsData = aboutUsResponse?.data?.data;

  // Load data into form when received
  useEffect(() => {
    if (aboutUsData) {
      setFormData({
        aboutDescription: aboutUsData.aboutDescription || '',
        teamDescription: aboutUsData.teamDescription || '',
        stats: aboutUsData.stats && aboutUsData.stats.length > 0 ? aboutUsData.stats : [
          { value: '', description: '', order: 1 },
          { value: '', description: '', order: 2 },
          { value: '', description: '', order: 3 },
          { value: '', description: '', order: 4 },
        ],
        teamMembers: aboutUsData.teamMembers && aboutUsData.teamMembers.length > 0 ? aboutUsData.teamMembers : [
          { name: '', position: '', image: '', order: 1 },
          { name: '', position: '', image: '', order: 2 },
          { name: '', position: '', image: '', order: 3 },
          { name: '', position: '', image: '', order: 4 },
          { name: '', position: '', image: '', order: 5 },
        ],
        contact: aboutUsData.contact || {
          address: { street: '', city: '', country: '' },
          phone: '',
          email: '',
          mapImage: '',
        },
      });
    }
  }, [aboutUsData]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Use the ID from the current data
      const id = aboutUsData?._id;
      if (!id) {
        throw new Error('No About Us data ID found');
      }
      
      const response = await aboutUsApi.updateAboutUs(id, data);
      return response;
    },
    onSuccess: () => {
      toast.success('About Us content updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['publicAboutUs'] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Save error:', error);
      toast.error('Failed to update content. Please try again.');
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reload original data
    if (aboutUsData) {
      setFormData({
        aboutDescription: aboutUsData.aboutDescription || '',
        teamDescription: aboutUsData.teamDescription || '',
        stats: aboutUsData.stats || [
          { value: '', description: '', order: 1 },
          { value: '', description: '', order: 2 },
          { value: '', description: '', order: 3 },
          { value: '', description: '', order: 4 },
        ],
        teamMembers: aboutUsData.teamMembers || [
          { name: '', position: '', image: '', order: 1 },
          { name: '', position: '', image: '', order: 2 },
          { name: '', position: '', image: '', order: 3 },
          { name: '', position: '', image: '', order: 4 },
          { name: '', position: '', image: '', order: 5 },
        ],
        contact: aboutUsData.contact || {
          address: { street: '', city: '', country: '' },
          phone: '',
          email: '',
          mapImage: '',
        },
      });
    }
  };

  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setFormData(prev => ({ ...prev, stats: newStats }));
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const newTeamMembers = [...formData.teamMembers];
    newTeamMembers[index] = { ...newTeamMembers[index], [field]: value };
    setFormData(prev => ({ ...prev, teamMembers: newTeamMembers }));
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
        <p className="ml-4">Loading About Us content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Failed to load About Us content</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            About Us Management
          </h1>
          <p className="text-gray-600 mt-2">
            Edit your website&apos;s About Us content, team information, and contact details.
          </p>
        </div>
        
        {!isEditing ? (
          <Button 
            onClick={handleEdit} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 shadow-sm"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Content
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 shadow-sm disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={updateMutation.isPending}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-4 py-2 disabled:opacity-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>


      {/* Status */}
      {aboutUsData && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-600 font-medium">Content Loaded Successfully</span>
              </div>
              <span className="text-sm text-gray-500">
                Last updated: {new Date(aboutUsData.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Descriptions */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Main Content</h2>
          
          <div className="space-y-6">
            {/* About Description */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                About Description
              </label>
              {isEditing ? (
                <Textarea
                  value={formData.aboutDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, aboutDescription: e.target.value }))}
                  placeholder="Enter the main about description..."
                  rows={6}
                  className="w-full"
                />
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {aboutUsData?.aboutDescription || 'No description available'}
                  </p>
                </div>
              )}
            </div>

            {/* Team Description */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Team Description
              </label>
              {isEditing ? (
                <Textarea
                  value={formData.teamDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, teamDescription: e.target.value }))}
                  placeholder="Enter the team description..."
                  rows={4}
                  className="w-full"
                />
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {aboutUsData?.teamDescription || 'No team description available'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.stats.map((stat, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-3 text-black">Statistic {index + 1}</h3>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Value</label>
                      <Input
                        value={stat.value || ''}
                        onChange={(e) => updateStat(index, 'value', e.target.value)}
                        placeholder="e.g., 2010, 50+, 1000+"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Description</label>
                      <Textarea
                        value={stat.description || ''}
                        onChange={(e) => updateStat(index, 'description', e.target.value)}
                        placeholder="Description of this statistic..."
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {stat.value || 'No value'}
                    </div>
                    <p className="text-gray-700 text-sm">
                      {stat.description || 'No description'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Team Members</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.teamMembers.map((member, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-3 text-black">Team Member {index + 1}</h3>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Name</label>
                      <Input
                        value={member.name || ''}
                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Position</label>
                      <Input
                        value={member.position || ''}
                        onChange={(e) => updateTeamMember(index, 'position', e.target.value)}
                        placeholder="Job title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Image URL</label>
                      <Input
                        value={member.image || ''}
                        onChange={(e) => updateTeamMember(index, 'image', e.target.value)}
                        placeholder="/team/image.jpg"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <Users className="h-8 w-8 text-gray-500" />
                      )}
                    </div>
                    <h4 className="font-medium text-gray-900">
                      {member.name || 'No name'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {member.position || 'No position'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Contact Information</h2>
          
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                  <Input
                    value={formData.contact.address.street}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contact: {
                        ...prev.contact,
                        address: { ...prev.contact.address, street: e.target.value }
                      }
                    }))}
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <Input
                    value={formData.contact.address.city}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contact: {
                        ...prev.contact,
                        address: { ...prev.contact.address, city: e.target.value }
                      }
                    }))}
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <Input
                    value={formData.contact.address.country}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contact: {
                        ...prev.contact,
                        address: { ...prev.contact.address, country: e.target.value }
                      }
                    }))}
                    placeholder="Country"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input
                    value={formData.contact.phone}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contact: { ...prev.contact, phone: e.target.value }
                    }))}
                    placeholder="+77272505060"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    value={formData.contact.email}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      contact: { ...prev.contact, email: e.target.value }
                    }))}
                    placeholder="info@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Map Image URL</label>
                <Input
                  value={formData.contact.mapImage}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contact: { ...prev.contact, mapImage: e.target.value }
                  }))}
                  placeholder="/map.png"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Address</h4>
                    <p className="text-gray-600">
                      {formData.contact.address.street}<br />
                      {formData.contact.address.city}<br />
                      {formData.contact.address.country}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">Phone</h4>
                    <p className="text-gray-600">{formData.contact.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">Email</h4>
                    <p className="text-gray-600">{formData.contact.email}</p>
                  </div>
                </div>
              </div>
              
              {formData.contact.mapImage && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                  <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                    <img 
                      src={formData.contact.mapImage} 
                      alt="Location map"
                      className="max-w-full max-h-full rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}