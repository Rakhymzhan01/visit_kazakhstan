import express from 'express';
import {
  getAllCategoryPageInfo,
  getCategoryPageInfoBySlug,
  createCategoryPageInfo,
  updateCategoryPageInfo,
  deleteCategoryPageInfo,
  getCategoryPageInfoStats
} from '../controllers/categoryPageInfoController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/public/:slug', getCategoryPageInfoBySlug);

// Admin routes (protected)
router.use(authenticateToken);
router.use(requireAdmin);

router.get('/', getAllCategoryPageInfo);
router.get('/stats', getCategoryPageInfoStats);
router.post('/', createCategoryPageInfo);
router.put('/:id', updateCategoryPageInfo);
router.delete('/:id', deleteCategoryPageInfo);

export default router;