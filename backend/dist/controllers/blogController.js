"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogStats = exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlog = exports.getBlogs = exports.getBlogsValidation = exports.updateBlogValidation = exports.createBlogValidation = void 0;
const express_validator_1 = require("express-validator");
const BlogPost_1 = require("../models/BlogPost");
// Validation rules
exports.createBlogValidation = [
    (0, express_validator_1.body)('title').isLength({ min: 1, max: 200 }).trim(),
    (0, express_validator_1.body)('content').isLength({ min: 10 }),
    (0, express_validator_1.body)('excerpt').optional().isLength({ max: 500 }),
    (0, express_validator_1.body)('status').optional().isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
    (0, express_validator_1.body)('featured').optional().isBoolean(),
    (0, express_validator_1.body)('tags').optional().isArray(),
    (0, express_validator_1.body)('category').optional().isLength({ max: 50 }),
    (0, express_validator_1.body)('seoTitle').optional().isLength({ max: 200 }),
    (0, express_validator_1.body)('seoDescription').optional().isLength({ max: 160 }),
];
exports.updateBlogValidation = exports.createBlogValidation;
exports.getBlogsValidation = [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }),
    (0, express_validator_1.query)('status').optional().isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
    (0, express_validator_1.query)('featured').optional().isBoolean(),
    (0, express_validator_1.query)('search').optional().isLength({ max: 100 }),
    (0, express_validator_1.query)('category').optional().isLength({ max: 50 }),
];
// Helper function to generate slug
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};
// Helper function to ensure unique slug
const ensureUniqueSlug = async (baseSlug, excludeId) => {
    let slug = baseSlug;
    let counter = 1;
    while (true) {
        const query = { slug };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }
        const existing = await BlogPost_1.BlogPost.findOne(query);
        if (!existing) {
            return slug;
        }
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
};
// Get all blog posts
const getBlogs = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status;
        const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined;
        const search = req.query.search;
        const category = req.query.category;
        // Build filter object
        const filter = {};
        if (status) {
            filter.status = status;
        }
        if (featured !== undefined) {
            filter.featured = featured;
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
            ];
        }
        if (category) {
            filter.category = category;
        }
        // Get blogs with pagination
        const [blogs, total] = await Promise.all([
            BlogPost_1.BlogPost.find(filter)
                .populate('authorId', 'name email')
                .select('-content') // Exclude full content for list view
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            BlogPost_1.BlogPost.countDocuments(filter),
        ]);
        // Transform blogs to include author info
        const transformedBlogs = blogs.map(blog => ({
            ...blog,
            id: blog._id.toString(),
            author: blog.authorId,
            authorId: blog.authorId?._id?.toString(),
        }));
        res.json({
            success: true,
            data: {
                blogs: transformedBlogs,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    }
    catch (error) {
        console.error('Get blogs error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getBlogs = getBlogs;
// Get single blog post
const getBlog = async (req, res) => {
    try {
        const { id } = req.params;
        let blog;
        // Check if it's an ObjectId or slug
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            blog = await BlogPost_1.BlogPost.findById(id).populate('authorId', 'name email');
        }
        else {
            blog = await BlogPost_1.BlogPost.findOne({ slug: id }).populate('authorId', 'name email');
        }
        if (!blog) {
            res.status(404).json({ error: 'Blog post not found' });
            return;
        }
        // Increment view count
        blog.views += 1;
        await blog.save();
        res.json({
            success: true,
            data: {
                blog: {
                    ...blog.toObject(),
                    id: blog._id.toString(),
                    author: blog.authorId,
                    authorId: blog.authorId?._id?.toString(),
                },
            },
        });
    }
    catch (error) {
        console.error('Get blog error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getBlog = getBlog;
// Create blog post
const createBlog = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { title, content, excerpt, status = 'DRAFT', featured = false, tags = [], category, seoTitle, seoDescription, featuredImage, images = [], } = req.body;
        // Generate unique slug
        const baseSlug = generateSlug(title);
        const slug = await ensureUniqueSlug(baseSlug);
        // Calculate read time (average reading speed: 200 words per minute)
        const wordCount = content.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200);
        // Create blog post
        const blog = new BlogPost_1.BlogPost({
            title,
            slug,
            content,
            excerpt,
            status,
            featured,
            tags,
            category,
            seoTitle,
            seoDescription,
            featuredImage,
            images,
            readTime,
            authorId: req.user.id,
            publishedAt: status === 'PUBLISHED' ? new Date() : null,
        });
        await blog.save();
        await blog.populate('authorId', 'name email');
        res.status(201).json({
            success: true,
            data: {
                blog: {
                    ...blog.toObject(),
                    id: blog._id.toString(),
                    author: blog.authorId,
                    authorId: blog.authorId._id.toString(),
                },
            },
        });
    }
    catch (error) {
        console.error('Create blog error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createBlog = createBlog;
// Update blog post
const updateBlog = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { id } = req.params;
        const { title, content, excerpt, status, featured, tags, category, seoTitle, seoDescription, featuredImage, images, } = req.body;
        const blog = await BlogPost_1.BlogPost.findById(id);
        if (!blog) {
            res.status(404).json({ error: 'Blog post not found' });
            return;
        }
        // Update fields
        if (title !== undefined) {
            blog.title = title;
            // Generate new slug if title changed
            const baseSlug = generateSlug(title);
            blog.slug = await ensureUniqueSlug(baseSlug, id);
        }
        if (content !== undefined) {
            blog.content = content;
            // Recalculate read time
            const wordCount = content.split(/\s+/).length;
            blog.readTime = Math.ceil(wordCount / 200);
        }
        if (excerpt !== undefined)
            blog.excerpt = excerpt;
        if (featured !== undefined)
            blog.featured = featured;
        if (tags !== undefined)
            blog.tags = tags;
        if (category !== undefined)
            blog.category = category;
        if (seoTitle !== undefined)
            blog.seoTitle = seoTitle;
        if (seoDescription !== undefined)
            blog.seoDescription = seoDescription;
        if (featuredImage !== undefined)
            blog.featuredImage = featuredImage;
        if (images !== undefined)
            blog.images = images;
        // Handle status change
        if (status !== undefined) {
            const oldStatus = blog.status;
            blog.status = status;
            // Set publishedAt when publishing for first time
            if (status === 'PUBLISHED' && oldStatus !== 'PUBLISHED') {
                blog.publishedAt = new Date();
            }
        }
        await blog.save();
        await blog.populate('authorId', 'name email');
        res.json({
            success: true,
            data: {
                blog: {
                    ...blog.toObject(),
                    id: blog._id.toString(),
                    author: blog.authorId,
                    authorId: blog.authorId._id.toString(),
                },
            },
        });
    }
    catch (error) {
        console.error('Update blog error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateBlog = updateBlog;
// Delete blog post
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await BlogPost_1.BlogPost.findById(id);
        if (!blog) {
            res.status(404).json({ error: 'Blog post not found' });
            return;
        }
        await BlogPost_1.BlogPost.findByIdAndDelete(id);
        res.json({
            success: true,
            message: 'Blog post deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteBlog = deleteBlog;
// Get blog statistics (admin only)
const getBlogStats = async (req, res) => {
    try {
        const [totalPosts, publishedPosts, draftPosts, featuredPosts, totalViews] = await Promise.all([
            BlogPost_1.BlogPost.countDocuments(),
            BlogPost_1.BlogPost.countDocuments({ status: 'PUBLISHED' }),
            BlogPost_1.BlogPost.countDocuments({ status: 'DRAFT' }),
            BlogPost_1.BlogPost.countDocuments({ featured: true }),
            BlogPost_1.BlogPost.aggregate([{ $group: { _id: null, totalViews: { $sum: '$views' } } }]),
        ]);
        // Get recent posts
        const recentPosts = await BlogPost_1.BlogPost.find()
            .populate('authorId', 'name')
            .select('title slug status createdAt views')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();
        const transformedRecentPosts = recentPosts.map(post => ({
            ...post,
            id: post._id.toString(),
            author: post.authorId,
        }));
        res.json({
            success: true,
            data: {
                stats: {
                    totalPosts,
                    publishedPosts,
                    draftPosts,
                    featuredPosts,
                    totalViews: totalViews[0]?.totalViews || 0,
                },
                recentPosts: transformedRecentPosts,
            },
        });
    }
    catch (error) {
        console.error('Get blog stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getBlogStats = getBlogStats;
//# sourceMappingURL=blogController.js.map