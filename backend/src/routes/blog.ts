import { Router } from 'express';
import {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  getBlogStats,
  createBlogValidation,
  updateBlogValidation,
  getBlogsValidation,
} from '../controllers/blogController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes (for frontend to fetch published blogs)
router.get('/', getBlogsValidation, getBlogs);

// Protected admin routes (these must come before parameterized routes)
router.get('/admin/stats', authenticateToken, requireAdmin, getBlogStats);

// Public parameterized route
router.get('/:id', getBlog);

// Protected routes (admin only)
router.use(authenticateToken);
router.use(requireAdmin);

router.post('/', createBlogValidation, createBlog);
router.put('/:id', updateBlogValidation, updateBlog);
router.delete('/:id', deleteBlog);

export default router;