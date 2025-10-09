import express from 'express';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { PageCategory } from '../models';

const router = express.Router();

// @desc    Get all page categories (public endpoint)
// @route   GET /api/page-categories/public
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      featured,
      search
    } = req.query;

    const query: any = {
      status: 'ACTIVE'
    };

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const pageCategories = await PageCategory.find(query)
      .select('name slug description image featured status displayOrder createdAt updatedAt')
      .sort({ displayOrder: 1, name: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await PageCategory.countDocuments(query);

    // Add id field for compatibility
    const formattedCategories = pageCategories.map(category => ({
      ...category,
      id: category._id.toString()
    }));

    res.json({
      success: true,
      data: {
        categories: formattedCategories,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching public page categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch page categories'
    });
  }
});

// @desc    Get all page categories (admin endpoint)
// @route   GET /api/page-categories
// @access  Private/Admin
router.get('/', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      featured,
      search
    } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const pageCategories = await PageCategory.find(query)
      .populate('authorId', 'name email')
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await PageCategory.countDocuments(query);

    res.json({
      success: true,
      data: {
        categories: pageCategories,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching page categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch page categories'
    });
  }
});

// @desc    Get single page category by ID (admin)
// @route   GET /api/page-categories/:id
// @access  Private/Admin
router.get('/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const pageCategory = await PageCategory.findById(req.params.id)
      .populate('authorId', 'name email')
      .lean();

    if (!pageCategory) {
      return res.status(404).json({
        success: false,
        error: 'Page category not found'
      });
    }

    res.json({
      success: true,
      data: pageCategory
    });
  } catch (error) {
    console.error('Error fetching page category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch page category'
    });
  }
});

// @desc    Create new page category
// @route   POST /api/page-categories
// @access  Private/Admin
router.post('/', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const pageCategoryData = {
      ...req.body,
      authorId: req.user!.id
    };

    const pageCategory = new PageCategory(pageCategoryData);
    await pageCategory.save();

    res.status(201).json({
      success: true,
      data: pageCategory
    });
  } catch (error) {
    console.error('Error creating page category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create page category'
    });
  }
});

// @desc    Update page category
// @route   PUT /api/page-categories/:id
// @access  Private/Admin
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const pageCategory = await PageCategory.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!pageCategory) {
      return res.status(404).json({
        success: false,
        error: 'Page category not found'
      });
    }

    res.json({
      success: true,
      data: pageCategory
    });
  } catch (error) {
    console.error('Error updating page category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update page category'
    });
  }
});

// @desc    Delete page category
// @route   DELETE /api/page-categories/:id
// @access  Private/Admin
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const pageCategory = await PageCategory.findByIdAndDelete(req.params.id);

    if (!pageCategory) {
      return res.status(404).json({
        success: false,
        error: 'Page category not found'
      });
    }

    res.json({
      success: true,
      message: 'Page category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting page category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete page category'
    });
  }
});

export default router;