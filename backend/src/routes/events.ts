import express from 'express';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { Event } from '../models';

const router = express.Router();

// @desc    Get all events (public endpoint)
// @route   GET /api/events/public
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      featured,
      search
    } = req.query;

    const query: any = {
      status: 'PUBLISHED'
    };

    if (featured === 'true') {
      query.featured = true;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const events = await Event.find(query)
      .select('title slug description excerpt image category date time location featured status views')
      .sort({ date: 1 }) // Sort by event date ascending
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching public events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    });
  }
});

// @desc    Get all events (admin endpoint)
// @route   GET /api/events
// @access  Private/Admin
router.get('/', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
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

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const events = await Event.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    });
  }
});

// @desc    Get single event by slug (public)
// @route   GET /api/events/public/slug/:slug
// @access  Public
router.get('/public/slug/:slug', async (req, res) => {
  try {
    const event = await Event.findOne({ 
      slug: req.params.slug,
      status: 'PUBLISHED'
    }).lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event by slug:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event'
    });
  }
});

// @desc    Get single event (public)
// @route   GET /api/events/public/:id
// @access  Public
router.get('/public/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .where('status')
      .equals('PUBLISHED')
      .lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event'
    });
  }
});

// @desc    Get single event (admin)
// @route   GET /api/events/:id
// @access  Private/Admin
router.get('/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('author', 'name email')
      .lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event'
    });
  }
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
router.post('/', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const eventData = {
      ...req.body,
      authorId: req.user!.id
    };

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create event'
    });
  }
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update event'
    });
  }
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete event'
    });
  }
});

// @desc    Get event statistics
// @route   GET /api/events/stats
// @access  Private/Admin  
router.get('/stats', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const totalEvents = await Event.countDocuments({});
    const publishedEvents = await Event.countDocuments({ status: 'PUBLISHED' });
    const draftEvents = await Event.countDocuments({ status: 'DRAFT' });
    const featuredEvents = await Event.countDocuments({ featured: true });

    res.json({
      success: true,
      data: {
        stats: {
          totalEvents,
          publishedEvents,
          draftEvents,
          featuredEvents
        }
      }
    });
  } catch (error) {
    console.error('Error fetching event stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event statistics'
    });
  }
});

export default router;