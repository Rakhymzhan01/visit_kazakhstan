import { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';

// Validation rules
export const createBlogValidation = [
  body('title').isLength({ min: 1, max: 200 }).trim(),
  body('content').isLength({ min: 10 }),
  body('excerpt').optional().isLength({ max: 500 }),
  body('status').optional().isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  body('featured').optional().isBoolean(),
  body('tags').optional().isArray(),
  body('category').optional().isLength({ max: 50 }),
  body('seoTitle').optional().isLength({ max: 200 }),
  body('seoDescription').optional().isLength({ max: 160 }),
];

export const updateBlogValidation = createBlogValidation;

export const getBlogsValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  query('featured').optional().isBoolean(),
  query('search').optional().isLength({ max: 100 }),
  query('category').optional().isLength({ max: 50 }),
];

// Helper function to generate slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Helper function to ensure unique slug
const ensureUniqueSlug = async (baseSlug: string, excludeId?: string): Promise<string> => {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.blogPost.findFirst({
      where: {
        slug,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

// Helper function to calculate read time
const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Create blog post
export const createBlog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const {
      title,
      content,
      excerpt,
      status = 'DRAFT',
      featured = false,
      tags = [],
      category,
      seoTitle,
      seoDescription,
      featuredImage,
      images = [],
    } = req.body;

    // Generate unique slug
    const baseSlug = generateSlug(title);
    const slug = await ensureUniqueSlug(baseSlug);

    // Calculate read time
    const readTime = calculateReadTime(content);

    // Create blog post
    const blogPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        status,
        featured,
        tags,
        category,
        seoTitle,
        seoDescription,
        featuredImage,
        images,
        readTime,
        authorId: req.user!.id,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'CREATE',
        entityType: 'BlogPost',
        entityId: blogPost.id,
        newValues: { title, slug, status },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
      },
    });

    res.status(201).json({
      success: true,
      data: { blogPost },
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all blog posts with pagination and filtering
export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const featured = req.query.featured === 'true';
    const search = req.query.search as string;
    const category = req.query.category as string;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (req.query.featured !== undefined) {
      where.featured = featured;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    // Get blog posts
    const [blogPosts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        blogPosts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single blog post by ID or slug
export const getBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if id is a valid cuid or try as slug
    const isId = id.length > 10; // cuid is longer than typical slugs

    const blogPost = await prisma.blogPost.findFirst({
      where: isId ? { id } : { slug: id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!blogPost) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    // Increment view count if accessing by slug (public access)
    if (!isId) {
      await prisma.blogPost.update({
        where: { id: blogPost.id },
        data: { views: { increment: 1 } },
      });
    }

    res.json({
      success: true,
      data: { blogPost },
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update blog post
export const updateBlog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const {
      title,
      content,
      excerpt,
      status,
      featured,
      tags,
      category,
      seoTitle,
      seoDescription,
      featuredImage,
      images,
    } = req.body;

    // Check if blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    // Prepare update data
    const updateData: any = {};

    if (title !== undefined) {
      updateData.title = title;
      // Update slug if title changed
      if (title !== existingPost.title) {
        const baseSlug = generateSlug(title);
        updateData.slug = await ensureUniqueSlug(baseSlug, id);
      }
    }

    if (content !== undefined) {
      updateData.content = content;
      updateData.readTime = calculateReadTime(content);
    }

    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (status !== undefined) {
      updateData.status = status;
      // Set publishedAt if publishing for the first time
      if (status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED') {
        updateData.publishedAt = new Date();
      }
    }
    if (featured !== undefined) updateData.featured = featured;
    if (tags !== undefined) updateData.tags = tags;
    if (category !== undefined) updateData.category = category;
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
    if (images !== undefined) updateData.images = images;

    // Update blog post
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE',
        entityType: 'BlogPost',
        entityId: id,
        oldValues: { title: existingPost.title, status: existingPost.status },
        newValues: { title: updateData.title, status: updateData.status },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
      },
    });

    res.json({
      success: true,
      data: { blogPost: updatedPost },
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete blog post
export const deleteBlog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    // Delete blog post
    await prisma.blogPost.delete({
      where: { id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'DELETE',
        entityType: 'BlogPost',
        entityId: id,
        oldValues: { title: existingPost.title, slug: existingPost.slug },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
      },
    });

    res.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get blog statistics
export const getBlogStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      featuredPosts,
      totalViews,
      categories,
    ] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
      prisma.blogPost.count({ where: { status: 'DRAFT' } }),
      prisma.blogPost.count({ where: { featured: true } }),
      prisma.blogPost.aggregate({
        _sum: { views: true },
      }),
      prisma.blogPost.groupBy({
        by: ['category'],
        where: { category: { not: null } },
        _count: { category: true },
        orderBy: { _count: { category: 'desc' } },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalPosts,
        publishedPosts,
        draftPosts,
        featuredPosts,
        totalViews: totalViews._sum.views || 0,
        categories: categories.map(cat => ({
          name: cat.category,
          count: cat._count.category,
        })),
      },
    });
  } catch (error) {
    console.error('Get blog stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};