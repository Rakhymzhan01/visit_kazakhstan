'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { blogApi, uploadApi } from '@/lib/api';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  ArrowLeft,
  Save,
  Eye,
  Trash2,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Helper function to strip HTML tags for editing
const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  return html
    .replace(/<h([1-6])>/g, '\n# ') // Convert headings to markdown-style
    .replace(/<\/h[1-6]>/g, '\n')
    .replace(/<p>/g, '\n')
    .replace(/<\/p>/g, '\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<li>/g, '• ')
    .replace(/<\/li>/g, '\n')
    .replace(/<ul>|<\/ul>|<ol>|<\/ol>/g, '\n')
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**') // Bold text
    .replace(/<[^>]*>/g, '') // Remove all remaining HTML tags
    .replace(/\n\s*\n/g, '\n\n') // Clean up multiple newlines
    .trim();
};

// Helper function to convert simple text back to HTML
const textToHtml = (text: string): string => {
  if (!text) return '';
  return text
    .split('\n\n') // Split by paragraphs
    .map(paragraph => {
      if (paragraph.startsWith('# ')) {
        return `<h2>${paragraph.substring(2)}</h2>`;
      }
      if (paragraph.includes('• ')) {
        const items = paragraph.split('\n').filter(line => line.trim());
        const listItems = items.map(item => `<li>${item.replace('• ', '')}</li>`).join('');
        return `<ul>${listItems}</ul>`;
      }
      return `<p>${paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');
};

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'),
  excerpt: z.string().max(500, 'Excerpt too long').optional(),
  content: z.string().min(1, 'Content is required'),
  category: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  featured: z.boolean(),
  seoTitle: z.string().max(60, 'SEO title too long').optional(),
  seoDescription: z.string().max(160, 'SEO description too long').optional(),
});

type BlogPostForm = z.infer<typeof blogPostSchema>;

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  const postId = params.id as string;

  // Fetch post data
  const { 
    data: postData, 
    isLoading: isLoadingPost,
    error: postError 
  } = useQuery({
    queryKey: ['blog', postId],
    queryFn: () => blogApi.getBlog(postId),
    enabled: !!postId,
  });

  const post = postData?.data?.data?.blog;
  
  // Debug the post data loading (can be removed later)
  console.log('Edit Page - post loaded:', !!post, post?.title);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<BlogPostForm>({
    resolver: zodResolver(blogPostSchema),
  });

  // Set form data when post loads
  useEffect(() => {
    if (post) {
      const formData = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: stripHtmlTags(post.content), // Clean HTML for editing
        category: post.category || '',
        tags: post.tags?.join(', ') || '',
        status: post.status,
        featured: post.featured,
        seoTitle: post.seoTitle || '',
        seoDescription: post.seoDescription || '',
      };
      reset(formData);
      setFeaturedImage(post.featuredImage || null);
    }
  }, [post, reset]);

  // Update post mutation
  const updateMutation = useMutation({
    mutationFn: (data: BlogPostForm & { featuredImage?: string }) => {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        featuredImage,
      };
      return blogApi.updateBlog(postId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', postId] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogStats'] });
      toast.success('Post updated successfully!');
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'error' in error.response.data ? String(error.response.data.error) : 'Failed to update post';
      toast.error(errorMessage);
    },
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: () => blogApi.deleteBlog(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogStats'] });
      toast.success('Post deleted successfully!');
      router.push('/admin/blog');
    },
    onError: (error: unknown) => {
      const errorMessage = error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'error' in error.response.data ? String(error.response.data.error) : 'Failed to delete post';
      toast.error(errorMessage);
    },
  });

  // Image upload handler
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setImageUploading(true);
    try {
      const response = await uploadApi.uploadFile(file, {
        alt: watch('title') || 'Featured image',
        caption: watch('title') || '',
      });
      
      const imageUrl = response.data.data.url;
      setFeaturedImage(imageUrl);
      toast.success('Image uploaded successfully');
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'error' in error.response.data ? String(error.response.data.error) : 'Failed to upload image';
      toast.error(errorMessage);
    } finally {
      setImageUploading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${post?.title}"? This action cannot be undone.`)) {
      deleteMutation.mutate();
    }
  };

  const onSubmit = async (data: BlogPostForm) => {
    try {
      // Convert clean text back to HTML for saving
      const dataWithHtml = {
        ...data,
        content: textToHtml(data.content),
        featuredImage: featuredImage || undefined
      };
      console.log('Saving with HTML content:', dataWithHtml.content);
      await updateMutation.mutateAsync(dataWithHtml);
    } catch {
      // Error handled in mutation
    }
  };

  if (isLoadingPost) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
        <p className="text-gray-600 mb-6">The post you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
        <Link href="/admin/blog">
          <Button>Back to Posts</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/blog">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
            <p className="text-gray-600">
              Last updated: {new Date(post.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {post.status === 'PUBLISHED' && (
            <Link href={`/blog/${post.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Post
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Enter post title..."
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    {...register('slug')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="post-url-slug"
                  />
                  {errors.slug && (
                    <p className="text-red-600 text-sm mt-1">{errors.slug.message}</p>
                  )}
                  {post.status === 'PUBLISHED' && (
                    <p className="text-xs text-orange-600 mt-1">
                      ⚠️ Changing the slug will break existing links to this post
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    {...register('excerpt')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Brief description of the post..."
                  />
                  {errors.excerpt && (
                    <p className="text-red-600 text-sm mt-1">{errors.excerpt.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardContent className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  {...register('content')}
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                  placeholder="Write your post content..."
                />
                {errors.content && (
                  <p className="text-red-600 text-sm mt-1">{errors.content.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Use simple formatting: # for headings, **bold text**, • for bullet points
                </p>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <input
                    {...register('seoTitle')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="SEO optimized title..."
                  />
                  {errors.seoTitle && (
                    <p className="text-red-600 text-sm mt-1">{errors.seoTitle.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Description
                  </label>
                  <textarea
                    {...register('seoDescription')}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Meta description for search engines..."
                  />
                  {errors.seoDescription && (
                    <p className="text-red-600 text-sm mt-1">{errors.seoDescription.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Publish</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    {...register('featured')}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Featured post
                  </label>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || updateMutation.isPending || !isDirty}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>

                {!isDirty && (
                  <p className="text-xs text-gray-500 text-center">
                    No changes to save
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Post Stats */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="text-lg font-medium text-gray-900">Post Stats</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Views:</span>
                    <span className="font-medium">{post.views || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {post.publishedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Published:</span>
                      <span className="font-medium">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Featured Image</h3>
                
                {featuredImage ? (
                  <div className="relative">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFeaturedImage(null)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <label className="cursor-pointer">
                      <span className="text-sm text-blue-600 hover:text-blue-500">
                        Choose image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={imageUploading}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, WebP up to 5MB
                    </p>
                  </div>
                )}

                {imageUploading && (
                  <div className="flex items-center justify-center py-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Categories & Tags */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Organization</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    {...register('category')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Travel, Culture, Adventure..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    {...register('tags')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="kazakhstan, travel, adventure"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate tags with commas
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}