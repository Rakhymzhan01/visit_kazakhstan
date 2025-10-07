import express from 'express';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { BlogPost } from '../models';

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
      status: 'PUBLISHED',
      category: 'EVENTS'
    };

    if (featured === 'true') {
      query.featured = true;
    }

    if (category) {
      query.tags = { $in: [category] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const events = await BlogPost.find(query)
      .select('title slug excerpt featuredImage tags createdAt publishedAt featured')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await BlogPost.countDocuments(query);

    // Transform blog posts to event format
    const transformedEvents = events.map(event => ({
      _id: event._id,
      title: event.title,
      slug: event.slug,
      image: event.featuredImage || '/placeholder.svg',
      category: event.tags?.[0] || 'Events',
      date: event.publishedAt || event.createdAt,
      featured: event.featured || false,
      status: 'PUBLISHED'
    }));

    res.json({
      success: true,
      data: {
        events: transformedEvents,
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

    const query: any = {
      category: 'EVENTS'
    };

    if (status) {
      query.status = status;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (category) {
      query.tags = { $in: [category] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const events = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await BlogPost.countDocuments(query);

    // Transform blog posts to event format
    const transformedEvents = events.map(event => ({
      _id: event._id,
      title: event.title,
      slug: event.slug,
      image: event.featuredImage || '/placeholder.svg',
      category: event.tags?.[0] || 'Events',
      date: event.publishedAt || event.createdAt,
      featured: event.featured || false,
      status: event.status
    }));

    res.json({
      success: true,
      data: {
        events: transformedEvents,
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

// @desc    Get single event (public)
// @route   GET /api/events/public/:id
// @access  Public
router.get('/public/:id', async (req, res) => {
  try {
    const event = await BlogPost.findById(req.params.id)
      .where('status')
      .equals('PUBLISHED')
      .where('category')
      .equals('EVENTS')
      .lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    const transformedEvent = {
      _id: event._id,
      title: event.title,
      slug: event.slug,
      image: event.featuredImage || '/placeholder.svg',
      category: event.tags?.[0] || 'Events',
      date: event.publishedAt || event.createdAt,
      featured: event.featured || false,
      status: 'PUBLISHED',
      content: event.content,
      excerpt: event.excerpt
    };

    res.json({
      success: true,
      data: transformedEvent
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
    const event = await BlogPost.findById(req.params.id)
      .where('category')
      .equals('EVENTS')
      .lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    const transformedEvent = {
      _id: event._id,
      title: event.title,
      slug: event.slug,
      image: event.featuredImage || '/placeholder.svg',
      category: event.tags?.[0] || 'Events',
      date: event.publishedAt || event.createdAt,
      featured: event.featured || false,
      status: event.status,
      content: event.content,
      excerpt: event.excerpt
    };

    res.json({
      success: true,
      data: transformedEvent
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
      category: 'EVENTS',
      author: req.user!.id
    };

    const event = new BlogPost(eventData);
    await event.save();

    const transformedEvent = {
      _id: event._id,
      title: event.title,
      slug: event.slug,
      image: event.featuredImage || '/placeholder.svg',
      category: event.tags?.[0] || 'Events',
      date: event.publishedAt || event.createdAt,
      featured: event.featured || false,
      status: event.status
    };

    res.status(201).json({
      success: true,
      data: transformedEvent
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
    const event = await BlogPost.findOneAndUpdate(
      { _id: req.params.id, category: 'EVENTS' },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    const transformedEvent = {
      _id: event._id,
      title: event.title,
      slug: event.slug,
      image: event.featuredImage || '/placeholder.svg',
      category: event.tags?.[0] || 'Events',
      date: event.publishedAt || event.createdAt,
      featured: event.featured || false,
      status: event.status
    };

    res.json({
      success: true,
      data: transformedEvent
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
    const event = await BlogPost.findOneAndDelete({
      _id: req.params.id,
      category: 'EVENTS'
    });

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
    const totalEvents = await BlogPost.countDocuments({ category: 'EVENTS' });
    const publishedEvents = await BlogPost.countDocuments({ 
      category: 'EVENTS', 
      status: 'PUBLISHED' 
    });
    const draftEvents = await BlogPost.countDocuments({ 
      category: 'EVENTS', 
      status: 'DRAFT' 
    });
    const featuredEvents = await BlogPost.countDocuments({ 
      category: 'EVENTS', 
      featured: true 
    });

    res.json({
      success: true,
      data: {
        total: totalEvents,
        published: publishedEvents,
        drafts: draftEvents,
        featured: featuredEvents
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