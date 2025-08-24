"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contentController_1 = require("../controllers/contentController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes (for frontend to fetch content)
router.get('/page/:page', contentController_1.getPageContent);
router.get('/pages', contentController_1.getAllPages);
// Protected routes (admin only)
router.use(auth_1.authenticateToken);
router.use(auth_1.requireAdmin);
router.put('/', contentController_1.updateContentValidation, contentController_1.updateContent);
router.put('/bulk', contentController_1.bulkUpdateContent);
router.delete('/:id', contentController_1.deleteContent);
router.get('/history', contentController_1.getContentHistory);
exports.default = router;
//# sourceMappingURL=content.js.map