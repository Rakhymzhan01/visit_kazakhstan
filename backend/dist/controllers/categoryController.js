"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryStats = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategory = exports.getCategories = exports.getCategoriesValidation = exports.updateCategoryValidation = exports.createCategoryValidation = void 0;
const express_validator_1 = require("express-validator");
const Category_1 = require("../models/Category");
// Validation rules
exports.createCategoryValidation = [
    (0, express_validator_1.body)('name').isLength({ min: 1, max: 100 }).trim(),
    (0, express_validator_1.body)('description').optional().isLength({ max: 500 }),
    (0, express_validator_1.body)('image').optional().isURL().withMessage('Image must be a valid URL'),
    (0, express_validator_1.body)('featured').optional().isBoolean(),
    (0, express_validator_1.body)('status').optional().isIn(['ACTIVE', 'INACTIVE']),
    (0, express_validator_1.body)('displayOrder').optional().isInt({ min: 0 }),
];
exports.updateCategoryValidation = exports.createCategoryValidation;
exports.getCategoriesValidation = [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }),
    (0, express_validator_1.query)('status').optional().isIn(['ACTIVE', 'INACTIVE']),
    (0, express_validator_1.query)('featured').optional().isBoolean(),
    (0, express_validator_1.query)('search').optional().isLength({ max: 100 }),
];
// Helper function to generate slug
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
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
        const existing = await Category_1.Category.findOne(query);
        if (!existing) {
            return slug;
        }
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
};
// Get all categories
const getCategories = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const status = req.query.status || 'ACTIVE';
        const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined;
        const search = req.query.search;
        // Build filter object
        const filter = { status };
        if (featured !== undefined) {
            filter.featured = featured;
        }
        if (search) {
            filter.$text = { $search: search };
        }
        // Get categories with pagination
        const [categories, total] = await Promise.all([
            Category_1.Category.find(filter)
                .populate('createdBy', 'name email')
                .sort({ displayOrder: 1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Category_1.Category.countDocuments(filter),
        ]);
        // Transform categories to include author info
        const transformedCategories = categories.map(category => ({
            ...category,
            id: category._id.toString(),
            author: category.createdBy,
            createdBy: category.createdBy?._id?.toString(),
        }));
        res.json({
            success: true,
            data: {
                categories: transformedCategories,
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
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getCategories = getCategories;
// Get single category
const getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        let category;
        // Check if it's an ObjectId or slug
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            category = await Category_1.Category.findById(id).populate('createdBy', 'name email');
        }
        else {
            category = await Category_1.Category.findOne({ slug: id, status: 'ACTIVE' }).populate('createdBy', 'name email');
        }
        if (!category) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        res.json({
            success: true,
            data: {
                category: {
                    ...category.toObject(),
                    id: category._id.toString(),
                    author: category.createdBy,
                    createdBy: category.createdBy?._id?.toString(),
                },
            },
        });
    }
    catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getCategory = getCategory;
// Create category
const createCategory = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { name, description, image, featured = false, status = 'ACTIVE', displayOrder = 0, } = req.body;
        // Generate unique slug
        const baseSlug = generateSlug(name);
        const slug = await ensureUniqueSlug(baseSlug);
        // Create category
        const category = new Category_1.Category({
            name,
            slug,
            description,
            image,
            featured,
            status,
            displayOrder,
            createdBy: req.user.id,
        });
        await category.save();
        await category.populate('createdBy', 'name email');
        res.status(201).json({
            success: true,
            data: {
                category: {
                    ...category.toObject(),
                    id: category._id.toString(),
                    author: category.createdBy,
                    createdBy: category.createdBy._id.toString(),
                },
            },
        });
    }
    catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createCategory = createCategory;
// Update category
const updateCategory = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { id } = req.params;
        const { name, description, image, featured, status, displayOrder, } = req.body;
        const category = await Category_1.Category.findById(id);
        if (!category) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        // Update fields
        if (name !== undefined) {
            category.name = name;
            // Generate new slug if name changed
            const baseSlug = generateSlug(name);
            category.slug = await ensureUniqueSlug(baseSlug, id);
        }
        if (description !== undefined)
            category.description = description;
        if (image !== undefined)
            category.image = image;
        if (featured !== undefined)
            category.featured = featured;
        if (status !== undefined)
            category.status = status;
        if (displayOrder !== undefined)
            category.displayOrder = displayOrder;
        await category.save();
        await category.populate('createdBy', 'name email');
        res.json({
            success: true,
            data: {
                category: {
                    ...category.toObject(),
                    id: category._id.toString(),
                    author: category.createdBy,
                    createdBy: category.createdBy._id.toString(),
                },
            },
        });
    }
    catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateCategory = updateCategory;
// Delete category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category_1.Category.findById(id);
        if (!category) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        await Category_1.Category.findByIdAndDelete(id);
        res.json({
            success: true,
            message: 'Category deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteCategory = deleteCategory;
// Get category statistics (admin only)
const getCategoryStats = async (req, res) => {
    try {
        const [totalCategories, activeCategories, inactiveCategories, featuredCategories] = await Promise.all([
            Category_1.Category.countDocuments(),
            Category_1.Category.countDocuments({ status: 'ACTIVE' }),
            Category_1.Category.countDocuments({ status: 'INACTIVE' }),
            Category_1.Category.countDocuments({ featured: true }),
        ]);
        // Get recent categories
        const recentCategories = await Category_1.Category.find()
            .populate('createdBy', 'name')
            .select('name slug status featured createdAt')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();
        const transformedRecentCategories = recentCategories.map(category => ({
            ...category,
            id: category._id.toString(),
            author: category.createdBy,
        }));
        res.json({
            success: true,
            data: {
                stats: {
                    totalCategories,
                    activeCategories,
                    inactiveCategories,
                    featuredCategories,
                },
                recentCategories: transformedRecentCategories,
            },
        });
    }
    catch (error) {
        console.error('Get category stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getCategoryStats = getCategoryStats;
//# sourceMappingURL=categoryController.js.map