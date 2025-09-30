import { Router } from 'express';
import {
  getDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  getDestinationStats,
  createDestinationValidation,
  updateDestinationValidation,
  getDestinationsValidation,
} from '../controllers/destinationController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes (no authentication required)
router.get('/public', getDestinationsValidation, getDestinations);
router.get('/public/:id', getDestination);
router.get('/public/slug/:slug', getDestination);

// Admin routes (authentication required)
router.use(authenticateToken);
router.use(requireAdmin);

// Admin destination management
router.get('/stats', getDestinationStats);
router.get('/', getDestinationsValidation, getDestinations);
router.post('/', createDestinationValidation, createDestination);
router.get('/:id', getDestination);
router.put('/:id', updateDestinationValidation, updateDestination);
router.delete('/:id', deleteDestination);

export default router;