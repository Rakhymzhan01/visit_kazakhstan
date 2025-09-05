import { Router } from 'express';
import {
  getTours,
  getToursByCategory,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
  createTourValidation,
  updateTourValidation,
  getToursValidation,
} from '../controllers/tourController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes (no authentication required)
router.get('/public', getToursValidation, getTours);
router.get('/public/categories', getToursByCategory);
router.get('/public/:id', getTour);

// Admin routes (authentication required)
router.use(authenticateToken);
router.use(requireAdmin);

// Admin tour management
router.get('/stats', getTourStats);
router.get('/', getToursValidation, getTours);
router.post('/', createTourValidation, createTour);
router.get('/:id', getTour);
router.put('/:id', updateTourValidation, updateTour);
router.delete('/:id', deleteTour);

export default router;