"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.post('/login', authController_1.loginValidation, authController_1.login);
// Protected routes (require authentication)
router.use(auth_1.authenticateToken);
router.get('/profile', authController_1.getProfile);
router.put('/profile', authController_1.updateProfile);
router.post('/change-password', authController_1.changePassword);
router.post('/logout', authController_1.logout);
// Super Admin only routes
router.post('/create-user', auth_1.requireSuperAdmin, authController_1.createUserValidation, authController_1.createUser);
exports.default = router;
//# sourceMappingURL=auth.js.map