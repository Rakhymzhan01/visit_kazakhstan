import { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { BlogPost } from '../models/BlogPost';
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
    const query: any = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const existing = await BlogPost.findOne(query);

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

// Get all blog posts
export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;
    const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined;
    const search = req.query.search as string;
    const category = req.query.category as string;

    // Build filter object
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (featured !== undefined) {
      filter.featured = featured;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (category) {
      filter.category = category;
    }

    // Get blogs with pagination
    const [blogs, total] = await Promise.all([
      BlogPost.find(filter)
        .populate('authorId', 'name email')
        .select('-content') // Exclude full content for list view
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(filter),
    ]);

    // Transform blogs to include author info
    const transformedBlogs = blogs.map(blog => ({
      ...blog,
      id: blog._id.toString(),
      author: blog.authorId,
      authorId: blog.authorId?._id?.toString(),
    }));

    res.json({
      success: true,
      data: {
        blogs: transformedBlogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single blog post
export const getBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    let blog;
    
    // Check if it's an ObjectId or slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await BlogPost.findById(id).populate('authorId', 'name email');
    } else {
      blog = await BlogPost.findOne({ slug: id }).populate('authorId', 'name email');
    }

    if (!blog) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json({
      success: true,
      data: {
        blog: {
          ...blog.toObject(),
          id: (blog._id as any).toString(),
          author: blog.authorId,
          authorId: (blog.authorId as any)?._id?.toString(),
        },
      },
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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

    // Calculate read time (average reading speed: 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    // Create blog post
    const blog = new BlogPost({
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
    });

    await blog.save();
    await blog.populate('authorId', 'name email');

    res.status(201).json({
      success: true,
      data: {
        blog: {
          ...blog.toObject(),
          id: (blog._id as any).toString(),
          author: blog.authorId,
          authorId: (blog.authorId as any)._id.toString(),
        },
      },
    });
  } catch (error) {
    console.error('Create blog error:', error);
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

    const blog = await BlogPost.findById(id);
    
    if (!blog) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    // Update fields
    if (title !== undefined) {
      blog.title = title;
      // Generate new slug if title changed
      const baseSlug = generateSlug(title);
      blog.slug = await ensureUniqueSlug(baseSlug, id);
    }
    
    if (content !== undefined) {
      blog.content = content;
      // Recalculate read time
      const wordCount = content.split(/\s+/).length;
      blog.readTime = Math.ceil(wordCount / 200);
    }
    
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (featured !== undefined) blog.featured = featured;
    if (tags !== undefined) blog.tags = tags;
    if (category !== undefined) blog.category = category;
    if (seoTitle !== undefined) blog.seoTitle = seoTitle;
    if (seoDescription !== undefined) blog.seoDescription = seoDescription;
    if (featuredImage !== undefined) blog.featuredImage = featuredImage;
    if (images !== undefined) blog.images = images;

    // Handle status change
    if (status !== undefined) {
      const oldStatus = blog.status;
      blog.status = status;
      
      // Set publishedAt when publishing for first time
      if (status === 'PUBLISHED' && oldStatus !== 'PUBLISHED') {
        blog.publishedAt = new Date();
      }
    }

    await blog.save();
    await blog.populate('authorId', 'name email');

    res.json({
      success: true,
      data: {
        blog: {
          ...blog.toObject(),
          id: (blog._id as any).toString(),
          author: blog.authorId,
          authorId: (blog.authorId as any)._id.toString(),
        },
      },
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

    const blog = await BlogPost.findById(id);
    
    if (!blog) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    await BlogPost.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get blog statistics (admin only)
export const getBlogStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const [totalPosts, publishedPosts, draftPosts, featuredPosts, totalViews] = await Promise.all([
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ status: 'PUBLISHED' }),
      BlogPost.countDocuments({ status: 'DRAFT' }),
      BlogPost.countDocuments({ featured: true }),
      BlogPost.aggregate([{ $group: { _id: null, totalViews: { $sum: '$views' } } }]),
    ]);

    // Get recent posts
    const recentPosts = await BlogPost.find()
      .populate('authorId', 'name')
      .select('title slug status createdAt views')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const transformedRecentPosts = recentPosts.map(post => ({
      ...post,
      id: post._id.toString(),
      author: post.authorId,
    }));

    res.json({
      success: true,
      data: {
        stats: {
          totalPosts,
          publishedPosts,
          draftPosts,
          featuredPosts,
          totalViews: totalViews[0]?.totalViews || 0,
        },
        recentPosts: transformedRecentPosts,
      },
    });
  } catch (error) {
    console.error('Get blog stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};