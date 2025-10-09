'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Save, RotateCcw } from 'lucide-react';
import { homepageApi } from '@/lib/api';
import Image from 'next/image';

interface WhyVisitItem {
  title: string;
  description: string;
  image: string;
  bgColor: string;
  order: number;
}

export default function HomepageAdmin() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Why Visit Kazakhstan section
  const [whyVisitItems, setWhyVisitItems] = useState<WhyVisitItem[]>([
    {
      title: "Silk Road History",
      description: "Explore ancient trade routes and historical significance",
      image: "/desert.jpg",
      bgColor: "from-blue-400 to-blue-600",
      order: 1
    },
    {
      title: "Nomadic Soul", 
      description: "Experience traditional nomadic culture and lifestyle",
      image: "/shanyrak.jpg",
      bgColor: "from-amber-600 to-amber-800",
      order: 2
    },
    {
      title: "Modern Meets Traditional",
      description: "Witness the blend of contemporary and ancient cultures",
      image: "/baiterek.jpg",
      bgColor: "from-orange-400 to-orange-600",
      order: 3
    },
    {
      title: "No Crowds, Just Space",
      description: "Enjoy vast landscapes and peaceful environments",
      image: "/kanatnaya_doroga.jpg",
      bgColor: "from-red-400 to-red-600",
      order: 4
    },
    {
      title: "Unspoiled Nature",
      description: "Discover pristine natural beauty and wildlife",
      image: "/yurta.jpg",
      bgColor: "from-green-400 to-green-600",
      order: 5
    }
  ]);

  const loadHomepageContent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await homepageApi.getHomepageContent();
      
      if (response.data.success) {
        const data = response.data.data;
        
        if (data.whyVisit?.items) {
          setWhyVisitItems(data.whyVisit.items);
        }
      }
    } catch (error) {
      console.error('Error loading homepage content:', error);
      // Don't show error toast on initial load since data might not exist yet
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomepageContent();
  }, [loadHomepageContent]);

  const saveWhyVisitSection = async () => {
    setSaving(true);
    try {
      await homepageApi.updateWhyVisitSection({
        features: whyVisitItems
      });
      toast.success('Why Visit section updated successfully');
    } catch (error) {
      console.error('Error saving Why Visit section:', error);
      toast.error('Failed to save Why Visit section');
    } finally {
      setSaving(false);
    }
  };

  const addWhyVisitItem = () => {
    const newOrder = Math.max(...whyVisitItems.map(item => item.order), 0) + 1;
    setWhyVisitItems([...whyVisitItems, {
      title: "",
      description: "",
      image: "",
      bgColor: "from-gray-400 to-gray-600",
      order: newOrder
    }]);
  };

  const updateWhyVisitItem = (index: number, field: keyof WhyVisitItem, value: string | number) => {
    setWhyVisitItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeWhyVisitItem = (index: number) => {
    setWhyVisitItems(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-900">Loading homepage content...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Homepage Content Management</h1>
        <Button 
          onClick={loadHomepageContent} 
          variant="outline"
          disabled={loading}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Why Visit Kazakhstan Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Why Visit Kazakhstan Section</CardTitle>
            <div className="flex space-x-2">
              <Button onClick={addWhyVisitItem} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
              <Button onClick={saveWhyVisitSection} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
            <p className="text-blue-800 text-sm">
              Edit the &quot;Why Visit Kazakhstan&quot; cards that appear on the homepage. These cards showcase the main reasons to visit Kazakhstan. 
              You can edit the title, description, image, and background color of each card.
            </p>
          </div>
          
          <div className="space-y-6">
            {whyVisitItems.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold">Card {index + 1}</h4>
                  <Button
                    onClick={() => removeWhyVisitItem(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`title-${index}`}>Title</Label>
                    <Input
                      id={`title-${index}`}
                      value={item.title}
                      onChange={(e) => updateWhyVisitItem(index, 'title', e.target.value)}
                      placeholder="e.g., Silk Road History"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`image-${index}`}>Image URL</Label>
                    <Input
                      id={`image-${index}`}
                      value={item.image}
                      onChange={(e) => updateWhyVisitItem(index, 'image', e.target.value)}
                      placeholder="/image.jpg"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`bgColor-${index}`}>Background Gradient</Label>
                    <select
                      id={`bgColor-${index}`}
                      value={item.bgColor}
                      onChange={(e) => updateWhyVisitItem(index, 'bgColor', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="from-blue-400 to-blue-600">Blue</option>
                      <option value="from-amber-600 to-amber-800">Amber</option>
                      <option value="from-orange-400 to-orange-600">Orange</option>
                      <option value="from-red-400 to-red-600">Red</option>
                      <option value="from-green-400 to-green-600">Green</option>
                      <option value="from-purple-400 to-purple-600">Purple</option>
                      <option value="from-gray-400 to-gray-600">Gray</option>
                      <option value="from-cyan-400 to-cyan-600">Cyan</option>
                      <option value="from-pink-400 to-pink-600">Pink</option>
                      <option value="from-indigo-400 to-indigo-600">Indigo</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor={`order-${index}`}>Display Order</Label>
                    <Input
                      id={`order-${index}`}
                      type="number"
                      value={item.order}
                      onChange={(e) => updateWhyVisitItem(index, 'order', parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Textarea
                    id={`description-${index}`}
                    value={item.description}
                    onChange={(e) => updateWhyVisitItem(index, 'description', e.target.value)}
                    placeholder="Detailed description shown when card is expanded..."
                    rows={3}
                  />
                </div>

                {/* Preview */}
                {item.image && (
                  <div className="mt-4">
                    <Label>Preview</Label>
                    <div className="relative w-32 h-20 rounded overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Other Homepage Sections:</h4>
            <p className="text-sm text-gray-600 mb-3">
              The following sections are managed automatically or through other admin pages:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><strong>• Top Tour Themes:</strong> Shows featured tours (manage in Tours admin)</li>
              <li><strong>• Blog Section:</strong> Shows featured blog posts (manage in Blog admin)</li>
              <li><strong>• Events Section:</strong> Shows featured events (manage in Events admin)</li>
              <li><strong>• About Section:</strong> Static content (not editable)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}