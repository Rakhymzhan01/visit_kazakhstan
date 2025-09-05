import { Router } from 'express';
import {
  uploadSingle,
  uploadMultiple,
  getMedia,
  updateMedia,
  deleteMedia,
  getMediaStats,
} from '../controllers/uploadController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import upload from '../middleware/upload';

const router = Router();

// All routes require authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Upload routes
router.post('/single', upload.single('file'), uploadSingle);
router.post('/multiple', upload.array('files', 10), uploadMultiple);

// Media management routes
router.get('/media/stats', getMediaStats);
router.get('/media', getMedia);
router.put('/media/:id', updateMedia);
router.delete('/media/:id', deleteMedia);

export default router;