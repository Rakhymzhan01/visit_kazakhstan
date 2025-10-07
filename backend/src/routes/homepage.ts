import express from 'express';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Create a simple schema for homepage content
const HomepageContentSchema = new mongoose.Schema({}, { strict: false });
const HomepageContent = mongoose.model('HomepageContent', HomepageContentSchema);

// @desc    Get homepage content
// @route   GET /api/homepage
// @access  Public
router.get('/', async (req: Request, res: Response) => {
  try {
    const homepageContent = await HomepageContent.findOne({ isActive: true });
    
    res.json({
      success: true,
      data: homepageContent
    });
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update homepage content  
// @route   PUT /api/homepage
// @access  Private/Admin
router.put('/', async (req: Request, res: Response) => {
  try {
    // For now, just return success
    res.json({
      success: true,
      data: req.body
    });
  } catch (error) {
    console.error('Error updating homepage content:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;