import express from 'express';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { AboutUs } from '../models';

const router = express.Router();

// @desc    Get published About Us content (public endpoint)
// @route   GET /api/aboutus/public
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const aboutUsContent = await AboutUs.findOne({ 
      status: 'PUBLISHED' 
    })
    .sort({ version: -1 })
    .lean();

    if (!aboutUsContent) {
      return res.status(404).json({
        success: false,
        error: 'About Us content not found'
      });
    }

    res.json({
      success: true,
      data: aboutUsContent
    });
  } catch (error) {
    console.error('Error fetching public About Us content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch About Us content'
    });
  }
});

// @desc    Get all About Us content versions (admin endpoint)
// @route   GET /api/aboutus
// @access  Private/Admin
router.get('/', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      version
    } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (version) {
      query.version = version;
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const aboutUsContent = await AboutUs.find(query)
      .populate('authorId', 'name email')
      .sort({ version: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await AboutUs.countDocuments(query);

    res.json({
      success: true,
      data: {
        content: aboutUsContent,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching About Us content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch About Us content'
    });
  }
});

// @desc    Get single About Us content by ID (admin)
// @route   GET /api/aboutus/:id
// @access  Private/Admin
router.get('/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const aboutUsContent = await AboutUs.findById(req.params.id)
      .populate('authorId', 'name email')
      .lean();

    if (!aboutUsContent) {
      return res.status(404).json({
        success: false,
        error: 'About Us content not found'
      });
    }

    res.json({
      success: true,
      data: aboutUsContent
    });
  } catch (error) {
    console.error('Error fetching About Us content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch About Us content'
    });
  }
});

// @desc    Create new About Us content
// @route   POST /api/aboutus
// @access  Private/Admin
router.post('/', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    // Get the latest version number
    const latestContent = await AboutUs.findOne().sort({ version: -1 });
    const nextVersion = latestContent ? latestContent.version + 1 : 1;

    const aboutUsData = {
      ...req.body,
      authorId: req.user!.id,
      version: nextVersion
    };

    const aboutUsContent = new AboutUs(aboutUsData);
    await aboutUsContent.save();

    res.status(201).json({
      success: true,
      data: aboutUsContent
    });
  } catch (error) {
    console.error('Error creating About Us content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create About Us content'
    });
  }
});

// @desc    Update About Us content
// @route   PUT /api/aboutus/:id
// @access  Private/Admin
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const aboutUsContent = await AboutUs.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!aboutUsContent) {
      return res.status(404).json({
        success: false,
        error: 'About Us content not found'
      });
    }

    res.json({
      success: true,
      data: aboutUsContent
    });
  } catch (error) {
    console.error('Error updating About Us content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update About Us content'
    });
  }
});

// @desc    Delete About Us content
// @route   DELETE /api/aboutus/:id
// @access  Private/Admin
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const aboutUsContent = await AboutUs.findByIdAndDelete(req.params.id);

    if (!aboutUsContent) {
      return res.status(404).json({
        success: false,
        error: 'About Us content not found'
      });
    }

    res.json({
      success: true,
      message: 'About Us content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting About Us content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete About Us content'
    });
  }
});

// @desc    Publish specific About Us content version
// @route   PUT /api/aboutus/:id/publish
// @access  Private/Admin
router.put('/:id/publish', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    // First, unpublish all existing content
    await AboutUs.updateMany({}, { status: 'DRAFT' });

    // Then publish the selected version
    const aboutUsContent = await AboutUs.findByIdAndUpdate(
      req.params.id,
      { status: 'PUBLISHED', updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!aboutUsContent) {
      return res.status(404).json({
        success: false,
        error: 'About Us content not found'
      });
    }

    res.json({
      success: true,
      data: aboutUsContent,
      message: 'About Us content published successfully'
    });
  } catch (error) {
    console.error('Error publishing About Us content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to publish About Us content'
    });
  }
});

export default router;