import { Router } from 'express';
import {
  login,
  getProfile,
  updateProfile,
  changePassword,
  createUser,
  logout,
  loginValidation,
  createUserValidation,
} from '../controllers/authController';
import { authenticateToken, requireSuperAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/login', loginValidation, login);

// Protected routes (require authentication)
router.use(authenticateToken);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/change-password', changePassword);
router.post('/logout', logout);

// Super Admin only routes
router.post('/create-user', requireSuperAdmin, createUserValidation, createUser);

export default router;