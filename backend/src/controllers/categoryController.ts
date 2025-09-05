import { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { Category } from '../models/Category';
import { AuthenticatedRequest } from '../middleware/auth';

// Validation rules
export const createCategoryValidation = [
  body('name').isLength({ min: 1, max: 100 }).trim(),
  body('description').optional().isLength({ max: 500 }),
  body('image').optional().isURL().withMessage('Image must be a valid URL'),
  body('featured').optional().isBoolean(),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE']),
  body('displayOrder').optional().isInt({ min: 0 }),
];

export const updateCategoryValidation = createCategoryValidation;

export const getCategoriesValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['ACTIVE', 'INACTIVE']),
  query('featured').optional().isBoolean(),
  query('search').optional().isLength({ max: 100 }),
];

// Helper function to generate slug
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
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
    
    const existing = await Category.findOne(query);

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

// Get all categories
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status as string || 'ACTIVE';
    const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined;
    const search = req.query.search as string;

    // Build filter object
    const filter: any = { status };
    
    if (featured !== undefined) {
      filter.featured = featured;
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    // Get categories with pagination
    const [categories, total] = await Promise.all([
      Category.find(filter)
        .populate('createdBy', 'name email')
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Category.countDocuments(filter),
    ]);

    // Transform categories to include author info
    const transformedCategories = categories.map(category => ({
      ...category,
      id: category._id.toString(),
      author: category.createdBy,
      createdBy: (category.createdBy as any)?._id?.toString(),
    }));

    res.json({
      success: true,
      data: {
        categories: transformedCategories,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single category
export const getCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    let category;
    
    // Check if it's an ObjectId or slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(id).populate('createdBy', 'name email');
    } else {
      category = await Category.findOne({ slug: id, status: 'ACTIVE' }).populate('createdBy', 'name email');
    }

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        category: {
          ...category.toObject(),
          id: (category._id as any).toString(),
          author: category.createdBy,
          createdBy: (category.createdBy as any)?._id?.toString(),
        },
      },
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create category
export const createCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const {
      name,
      description,
      image,
      featured = false,
      status = 'ACTIVE',
      displayOrder = 0,
    } = req.body;

    // Generate unique slug
    const baseSlug = generateSlug(name);
    const slug = await ensureUniqueSlug(baseSlug);

    // Create category
    const category = new Category({
      name,
      slug,
      description,
      image,
      featured,
      status,
      displayOrder,
      createdBy: req.user!.id,
    });

    await category.save();
    await category.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: {
        category: {
          ...category.toObject(),
          id: (category._id as any).toString(),
          author: category.createdBy,
          createdBy: (category.createdBy as any)._id.toString(),
        },
      },
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update category
export const updateCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const {
      name,
      description,
      image,
      featured,
      status,
      displayOrder,
    } = req.body;

    const category = await Category.findById(id);
    
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    // Update fields
    if (name !== undefined) {
      category.name = name;
      // Generate new slug if name changed
      const baseSlug = generateSlug(name);
      category.slug = await ensureUniqueSlug(baseSlug, id);
    }
    
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (featured !== undefined) category.featured = featured;
    if (status !== undefined) category.status = status;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;

    await category.save();
    await category.populate('createdBy', 'name email');

    res.json({
      success: true,
      data: {
        category: {
          ...category.toObject(),
          id: (category._id as any).toString(),
          author: category.createdBy,
          createdBy: (category.createdBy as any)._id.toString(),
        },
      },
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete category
export const deleteCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    await Category.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get category statistics (admin only)
export const getCategoryStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const [totalCategories, activeCategories, inactiveCategories, featuredCategories] = await Promise.all([
      Category.countDocuments(),
      Category.countDocuments({ status: 'ACTIVE' }),
      Category.countDocuments({ status: 'INACTIVE' }),
      Category.countDocuments({ featured: true }),
    ]);

    // Get recent categories
    const recentCategories = await Category.find()
      .populate('createdBy', 'name')
      .select('name slug status featured createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const transformedRecentCategories = recentCategories.map(category => ({
      ...category,
      id: category._id.toString(),
      author: category.createdBy,
    }));

    res.json({
      success: true,
      data: {
        stats: {
          totalCategories,
          activeCategories,
          inactiveCategories,
          featuredCategories,
        },
        recentCategories: transformedRecentCategories,
      },
    });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};