import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { migrateDestinations } from '../controllers/migrateController';

const router = express.Router();

// Protected admin route for data migration
router.use(authenticateToken);
router.use(requireAdmin);

router.post('/destinations', migrateDestinations);

export default router;