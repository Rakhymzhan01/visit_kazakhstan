import { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { Destination } from '../models/Destination';
import { AuthenticatedRequest } from '../middleware/auth';

// Validation rules
export const createDestinationValidation = [
  body('name').isLength({ min: 1, max: 200 }).trim(),
  body('subtitle').optional().isLength({ max: 100 }).trim(),
  body('description').isLength({ min: 10, max: 1000 }).trim(),
  body('content').isLength({ min: 10 }).trim(),
  body('image').isURL().withMessage('Image must be a valid URL'),
  body('category').isIn(['nature', 'culture', 'cities']),
  body('subcategory').optional().isLength({ max: 50 }).trim(),
  body('location').isLength({ min: 1, max: 100 }).trim(),
  body('highlights').isArray().withMessage('Highlights must be an array'),
  body('highlights.*').isLength({ min: 1, max: 200 }).trim(),
  body('featured').optional().isBoolean(),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE']),
  body('displayOrder').optional().isInt({ min: 0 }),
];

export const updateDestinationValidation = createDestinationValidation;

export const getDestinationsValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isIn(['nature', 'culture', 'cities']),
  query('subcategory').optional().isLength({ max: 50 }),
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
    
    const existing = await Destination.findOne(query);

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

// Get all destinations
export const getDestinations = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const category = req.query.category as string;
    const subcategory = req.query.subcategory as string;
    const status = req.query.status as string || 'ACTIVE';
    const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined;
    const search = req.query.search as string;

    // Build filter object
    const filter: any = { status };
    
    if (category) {
      filter.category = category;
    }
    
    if (subcategory) {
      filter.subcategory = subcategory;
    }
    
    if (featured !== undefined) {
      filter.featured = featured;
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    // Get destinations with pagination
    const [destinations, total] = await Promise.all([
      Destination.find(filter)
        .populate('createdBy', 'name email')
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Destination.countDocuments(filter),
    ]);

    // Transform destinations to include author info
    const transformedDestinations = destinations.map(destination => ({
      ...destination,
      id: destination._id.toString(),
      author: destination.createdBy,
      createdBy: (destination.createdBy as any)?._id?.toString(),
    }));

    res.json({
      success: true,
      data: {
        destinations: transformedDestinations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single destination
export const getDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    let destination;
    
    // Check if it's an ObjectId or slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      destination = await Destination.findById(id).populate('createdBy', 'name email');
    } else {
      destination = await Destination.findOne({ slug: id, status: 'ACTIVE' }).populate('createdBy', 'name email');
    }

    if (!destination) {
      res.status(404).json({ error: 'Destination not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        destination: {
          ...destination.toObject(),
          id: (destination._id as any).toString(),
          author: destination.createdBy,
          createdBy: (destination.createdBy as any)?._id?.toString(),
        },
      },
    });
  } catch (error) {
    console.error('Get destination error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create destination
export const createDestination = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const {
      name,
      subtitle,
      description,
      content,
      image,
      gallery,
      category,
      subcategory,
      location,
      highlights,
      featured = false,
      status = 'ACTIVE',
      displayOrder = 0,
      seoTitle,
      seoDescription,
      price,
      rating,
      coordinates,
      activities,
      facilities,
      tips,
      bestTime,
      duration,
      difficulty,
      era,
      type,
      region,
      population,
      founded,
    } = req.body;

    // Generate unique slug
    const baseSlug = generateSlug(name);
    const slug = await ensureUniqueSlug(baseSlug);

    // Create destination
    const destination = new Destination({
      name,
      slug,
      subtitle,
      description,
      content,
      image,
      gallery,
      category,
      subcategory,
      location,
      highlights,
      featured,
      status,
      displayOrder,
      seoTitle,
      seoDescription,
      price,
      rating,
      coordinates,
      activities,
      facilities,
      tips,
      bestTime,
      duration,
      difficulty,
      era,
      type,
      region,
      population,
      founded,
      createdBy: req.user!.id,
    });

    await destination.save();
    await destination.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: {
        destination: {
          ...destination.toObject(),
          id: (destination._id as any).toString(),
          author: destination.createdBy,
          createdBy: (destination.createdBy as any)._id.toString(),
        },
      },
    });
  } catch (error) {
    console.error('Create destination error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update destination
export const updateDestination = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const {
      name,
      subtitle,
      description,
      content,
      image,
      gallery,
      category,
      subcategory,
      location,
      highlights,
      featured,
      status,
      displayOrder,
      seoTitle,
      seoDescription,
      price,
      rating,
      coordinates,
      activities,
      facilities,
      tips,
      bestTime,
      duration,
      difficulty,
      era,
      type,
      region,
      population,
      founded,
    } = req.body;

    const destination = await Destination.findById(id);
    
    if (!destination) {
      res.status(404).json({ error: 'Destination not found' });
      return;
    }

    // Update fields
    if (name !== undefined) {
      destination.name = name;
      // Generate new slug if name changed
      const baseSlug = generateSlug(name);
      destination.slug = await ensureUniqueSlug(baseSlug, id);
    }
    
    if (subtitle !== undefined) destination.subtitle = subtitle;
    if (description !== undefined) destination.description = description;
    if (content !== undefined) destination.content = content;
    if (image !== undefined) destination.image = image;
    if (gallery !== undefined) destination.gallery = gallery;
    if (category !== undefined) destination.category = category;
    if (subcategory !== undefined) destination.subcategory = subcategory;
    if (location !== undefined) destination.location = location;
    if (highlights !== undefined) destination.highlights = highlights;
    if (featured !== undefined) destination.featured = featured;
    if (status !== undefined) destination.status = status;
    if (displayOrder !== undefined) destination.displayOrder = displayOrder;
    if (seoTitle !== undefined) destination.seoTitle = seoTitle;
    if (seoDescription !== undefined) destination.seoDescription = seoDescription;
    if (price !== undefined) destination.price = price;
    if (rating !== undefined) destination.rating = rating;
    if (coordinates !== undefined) destination.coordinates = coordinates;
    if (activities !== undefined) destination.activities = activities;
    if (facilities !== undefined) destination.facilities = facilities;
    if (tips !== undefined) destination.tips = tips;
    if (bestTime !== undefined) destination.bestTime = bestTime;
    if (duration !== undefined) destination.duration = duration;
    if (difficulty !== undefined) destination.difficulty = difficulty;
    if (era !== undefined) destination.era = era;
    if (type !== undefined) destination.type = type;
    if (region !== undefined) destination.region = region;
    if (population !== undefined) destination.population = population;
    if (founded !== undefined) destination.founded = founded;

    await destination.save();
    await destination.populate('createdBy', 'name email');

    res.json({
      success: true,
      data: {
        destination: {
          ...destination.toObject(),
          id: (destination._id as any).toString(),
          author: destination.createdBy,
          createdBy: (destination.createdBy as any)._id.toString(),
        },
      },
    });
  } catch (error) {
    console.error('Update destination error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete destination
export const deleteDestination = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const destination = await Destination.findById(id);
    
    if (!destination) {
      res.status(404).json({ error: 'Destination not found' });
      return;
    }

    await Destination.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Destination deleted successfully',
    });
  } catch (error) {
    console.error('Delete destination error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get destination statistics (admin only)
export const getDestinationStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const [
      totalDestinations, 
      activeDestinations, 
      inactiveDestinations, 
      featuredDestinations,
      natureDestinations,
      cultureDestinations,
      citiesDestinations
    ] = await Promise.all([
      Destination.countDocuments(),
      Destination.countDocuments({ status: 'ACTIVE' }),
      Destination.countDocuments({ status: 'INACTIVE' }),
      Destination.countDocuments({ featured: true }),
      Destination.countDocuments({ category: 'nature' }),
      Destination.countDocuments({ category: 'culture' }),
      Destination.countDocuments({ category: 'cities' }),
    ]);

    // Get recent destinations
    const recentDestinations = await Destination.find()
      .populate('createdBy', 'name')
      .select('name slug category status featured createdAt')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const transformedRecentDestinations = recentDestinations.map(destination => ({
      ...destination,
      id: destination._id.toString(),
      author: destination.createdBy,
    }));

    res.json({
      success: true,
      data: {
        stats: {
          totalDestinations,
          activeDestinations,
          inactiveDestinations,
          featuredDestinations,
          natureDestinations,
          cultureDestinations,
          citiesDestinations,
        },
        recentDestinations: transformedRecentDestinations,
      },
    });
  } catch (error) {
    console.error('Get destination stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};