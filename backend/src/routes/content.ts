import { Router } from 'express';
import {
  getPageContent,
  getAllPages,
  updateContent,
  bulkUpdateContent,
  deleteContent,
  getContentHistory,
  updateContentValidation,
} from '../controllers/contentController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes (for frontend to fetch content)
router.get('/page/:page', getPageContent);
router.get('/pages', getAllPages);

// Protected routes (admin only)
router.use(authenticateToken);
router.use(requireAdmin);

router.put('/', updateContentValidation, updateContent);
router.put('/bulk', bulkUpdateContent);
router.delete('/:id', deleteContent);
router.get('/history', getContentHistory);

export default router;