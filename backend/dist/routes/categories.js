"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes (no authentication required)
router.get('/public', categoryController_1.getCategoriesValidation, categoryController_1.getCategories);
router.get('/public/:id', categoryController_1.getCategory);
// Admin routes (authentication required)
router.use(auth_1.authenticateToken);
router.use(auth_1.requireAdmin);
// Admin category management
router.get('/stats', categoryController_1.getCategoryStats);
router.get('/', categoryController_1.getCategoriesValidation, categoryController_1.getCategories);
router.post('/', categoryController_1.createCategoryValidation, categoryController_1.createCategory);
router.get('/:id', categoryController_1.getCategory);
router.put('/:id', categoryController_1.updateCategoryValidation, categoryController_1.updateCategory);
router.delete('/:id', categoryController_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=categories.js.map