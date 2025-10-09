import express from 'express';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Create a simple schema for homepage content
const HomepageContentSchema = new mongoose.Schema({}, { strict: false });
const HomepageContent = mongoose.model('HomepageContent', HomepageContentSchema);

// @desc    Get homepage content
// @route   GET /api/homepage
// @access  Public
router.get('/', async (req: Request, res: Response) => {
  console.log('🏠 [BACKEND] HOMEPAGE GET - Request received');
  console.log('🔍 [BACKEND] Request query params:', req.query);
  console.log('🔍 [BACKEND] Request headers:', req.headers);
  console.log('⏰ [BACKEND] Timestamp:', new Date().toISOString());
  
  try {
    console.log('🔍 [BACKEND] Searching for active homepage content...');
    const homepageContent = await HomepageContent.findOne({ isActive: true });
    
    console.log('📦 [BACKEND] Homepage content found:', homepageContent ? 'YES' : 'NO');
    if (homepageContent) {
      console.log('📝 [BACKEND] Homepage content ID:', homepageContent._id);
      console.log('📝 [BACKEND] Homepage content keys:', Object.keys(homepageContent.toObject ? homepageContent.toObject() : homepageContent));
    }
    
    console.log('📤 [BACKEND] Sending homepage GET response');
    res.json({
      success: true,
      data: homepageContent
    });
    
    console.log('✅ [BACKEND] Homepage GET response sent successfully');
  } catch (error) {
    console.error('❌ [BACKEND] Error fetching homepage content:', error);
    console.error('📍 [BACKEND] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update homepage content  
// @route   PUT /api/homepage
// @access  Private/Admin
router.put('/', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  console.log('🏠 [BACKEND] HOMEPAGE UPDATE - Request received');
  console.log('📝 [BACKEND] Homepage update data:', JSON.stringify(req.body, null, 2));
  console.log('🔍 [BACKEND] Request headers:', req.headers);
  console.log('⏰ [BACKEND] Timestamp:', new Date().toISOString());
  
  try {
    console.log('✅ [BACKEND] Processing homepage content update...');
    
    // First, deactivate all existing homepage content
    console.log('🔄 [BACKEND] Deactivating existing homepage content...');
    await HomepageContent.updateMany({}, { isActive: false });
    
    // Create new homepage content with isActive: true
    console.log('💾 [BACKEND] Creating new homepage content...');
    const newContent = new HomepageContent({
      ...req.body,
      isActive: true,
      updatedAt: new Date(),
      createdAt: new Date()
    });
    
    const savedContent = await newContent.save();
    console.log('✅ [BACKEND] Homepage content saved with ID:', savedContent._id);
    
    console.log('📤 [BACKEND] Sending homepage update response');
    res.json({
      success: true,
      data: savedContent
    });
    
    console.log('✅ [BACKEND] Homepage update response sent successfully');
  } catch (error) {
    console.error('❌ [BACKEND] Error updating homepage content:', error);
    console.error('📍 [BACKEND] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;