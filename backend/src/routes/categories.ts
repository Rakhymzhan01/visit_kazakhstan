import { Router } from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
  createCategoryValidation,
  updateCategoryValidation,
  getCategoriesValidation,
} from '../controllers/categoryController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes (no authentication required)
router.get('/public', getCategoriesValidation, getCategories);
router.get('/public/:id', getCategory);

// Admin routes (authentication required)
router.use(authenticateToken);
router.use(requireAdmin);

// Admin category management
router.get('/stats', getCategoryStats);
router.get('/', getCategoriesValidation, getCategories);
router.post('/', createCategoryValidation, createCategory);
router.get('/:id', getCategory);
router.put('/:id', updateCategoryValidation, updateCategory);
router.delete('/:id', deleteCategory);

export default router;