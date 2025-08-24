"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blogController_1 = require("../controllers/blogController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes (for frontend to fetch published blogs)
router.get('/', blogController_1.getBlogsValidation, blogController_1.getBlogs);
// Protected admin routes (these must come before parameterized routes)
router.get('/admin/stats', auth_1.authenticateToken, auth_1.requireAdmin, blogController_1.getBlogStats);
// Public parameterized route
router.get('/:id', blogController_1.getBlog);
// Protected routes (admin only)
router.use(auth_1.authenticateToken);
router.use(auth_1.requireAdmin);
router.post('/', blogController_1.createBlogValidation, blogController_1.createBlog);
router.put('/:id', blogController_1.updateBlogValidation, blogController_1.updateBlog);
router.delete('/:id', blogController_1.deleteBlog);
exports.default = router;
//# sourceMappingURL=blog.js.map