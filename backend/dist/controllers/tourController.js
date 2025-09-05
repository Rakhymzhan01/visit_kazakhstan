"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTourStats = exports.deleteTour = exports.updateTour = exports.createTour = exports.getTour = exports.getToursByCategory = exports.getTours = exports.getToursValidation = exports.updateTourValidation = exports.createTourValidation = void 0;
const express_validator_1 = require("express-validator");
const Tour_1 = require("../models/Tour");
// Validation rules
exports.createTourValidation = [
    (0, express_validator_1.body)('title').isLength({ min: 1, max: 200 }).trim(),
    (0, express_validator_1.body)('category').isLength({ min: 1, max: 100 }).trim(),
    (0, express_validator_1.body)('image').isURL().withMessage('Image must be a valid URL'),
    (0, express_validator_1.body)('description').optional().isLength({ max: 2000 }),
    (0, express_validator_1.body)('rating').optional().isInt({ min: 1, max: 5 }),
    (0, express_validator_1.body)('price').optional().isFloat({ min: 0 }),
    (0, express_validator_1.body)('featured').optional().isBoolean(),
    (0, express_validator_1.body)('status').optional().isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
];
exports.updateTourValidation = exports.createTourValidation;
exports.getToursValidation = [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }),
    (0, express_validator_1.query)('category').optional().isLength({ max: 100 }),
    (0, express_validator_1.query)('status').optional().isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
    (0, express_validator_1.query)('featured').optional().isBoolean(),
    (0, express_validator_1.query)('search').optional().isLength({ max: 100 }),
];
// Helper function to generate slug
const generateSlug = (title) => {
    return title
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
        const existing = await Tour_1.Tour.findOne(query);
        if (!existing) {
            return slug;
        }
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
};
// Get all tours
const getTours = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const category = req.query.category;
        const status = req.query.status || 'PUBLISHED';
        const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined;
        const search = req.query.search;
        // Build filter object
        const filter = { status };
        if (category) {
            filter.category = category;
        }
        if (featured !== undefined) {
            filter.featured = featured;
        }
        if (search) {
            filter.$text = { $search: search };
        }
        // Get tours with pagination
        const [tours, total] = await Promise.all([
            Tour_1.Tour.find(filter)
                .populate('createdBy', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Tour_1.Tour.countDocuments(filter),
        ]);
        // Transform tours to include author info
        const transformedTours = tours.map(tour => ({
            ...tour,
            id: tour._id.toString(),
            author: tour.createdBy,
            createdBy: tour.createdBy?._id?.toString(),
        }));
        res.json({
            success: true,
            data: {
                tours: transformedTours,
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
        console.error('Get tours error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getTours = getTours;
// Get tours grouped by category
const getToursByCategory = async (req, res) => {
    try {
        const status = req.query.status || 'PUBLISHED';
        // Get all categories
        const categories = await Tour_1.Tour.distinct('category', { status });
        // Get tours for each category
        const toursByCategory = {};
        for (const category of categories) {
            const tours = await Tour_1.Tour.find({ category, status })
                .populate('createdBy', 'name')
                .select('title slug description image rating date location price featured')
                .sort({ featured: -1, createdAt: -1 })
                .lean();
            toursByCategory[category] = tours.map(tour => ({
                ...tour,
                id: tour._id.toString(),
            }));
        }
        res.json({
            success: true,
            data: {
                categories,
                toursByCategory,
            },
        });
    }
    catch (error) {
        console.error('Get tours by category error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getToursByCategory = getToursByCategory;
// Get single tour
const getTour = async (req, res) => {
    try {
        const { id } = req.params;
        let tour;
        // Check if it's an ObjectId or slug
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            tour = await Tour_1.Tour.findById(id).populate('createdBy', 'name email');
        }
        else {
            tour = await Tour_1.Tour.findOne({ slug: id, status: 'PUBLISHED' }).populate('createdBy', 'name email');
        }
        if (!tour) {
            res.status(404).json({ error: 'Tour not found' });
            return;
        }
        res.json({
            success: true,
            data: {
                tour: {
                    ...tour.toObject(),
                    id: tour._id.toString(),
                    author: tour.createdBy,
                    createdBy: tour.createdBy?._id?.toString(),
                },
            },
        });
    }
    catch (error) {
        console.error('Get tour error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getTour = getTour;
// Create tour
const createTour = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { title, category, description, image, rating = 5, date, location, price, duration, featured = false, status = 'PUBLISHED', seoTitle, seoDescription, gallery = [], highlights = [], inclusions = [], exclusions = [], itinerary = [], } = req.body;
        // Generate unique slug
        const baseSlug = generateSlug(title);
        const slug = await ensureUniqueSlug(baseSlug);
        // Create tour
        const tour = new Tour_1.Tour({
            title,
            slug,
            category,
            description,
            image,
            rating,
            date,
            location,
            price,
            duration,
            featured,
            status,
            seoTitle,
            seoDescription,
            gallery,
            highlights,
            inclusions,
            exclusions,
            itinerary,
            createdBy: req.user.id,
        });
        await tour.save();
        await tour.populate('createdBy', 'name email');
        res.status(201).json({
            success: true,
            data: {
                tour: {
                    ...tour.toObject(),
                    id: tour._id.toString(),
                    author: tour.createdBy,
                    createdBy: tour.createdBy._id.toString(),
                },
            },
        });
    }
    catch (error) {
        console.error('Create tour error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createTour = createTour;
// Update tour
const updateTour = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { id } = req.params;
        const { title, category, description, image, rating, date, location, price, duration, featured, status, seoTitle, seoDescription, gallery, highlights, inclusions, exclusions, itinerary, } = req.body;
        const tour = await Tour_1.Tour.findById(id);
        if (!tour) {
            res.status(404).json({ error: 'Tour not found' });
            return;
        }
        // Update fields
        if (title !== undefined) {
            tour.title = title;
            // Generate new slug if title changed
            const baseSlug = generateSlug(title);
            tour.slug = await ensureUniqueSlug(baseSlug, id);
        }
        if (category !== undefined)
            tour.category = category;
        if (description !== undefined)
            tour.description = description;
        if (image !== undefined)
            tour.image = image;
        if (rating !== undefined)
            tour.rating = rating;
        if (date !== undefined)
            tour.date = date;
        if (location !== undefined)
            tour.location = location;
        if (price !== undefined)
            tour.price = price;
        if (duration !== undefined)
            tour.duration = duration;
        if (featured !== undefined)
            tour.featured = featured;
        if (status !== undefined)
            tour.status = status;
        if (seoTitle !== undefined)
            tour.seoTitle = seoTitle;
        if (seoDescription !== undefined)
            tour.seoDescription = seoDescription;
        if (gallery !== undefined)
            tour.gallery = gallery;
        if (highlights !== undefined)
            tour.highlights = highlights;
        if (inclusions !== undefined)
            tour.inclusions = inclusions;
        if (exclusions !== undefined)
            tour.exclusions = exclusions;
        if (itinerary !== undefined)
            tour.itinerary = itinerary;
        await tour.save();
        await tour.populate('createdBy', 'name email');
        res.json({
            success: true,
            data: {
                tour: {
                    ...tour.toObject(),
                    id: tour._id.toString(),
                    author: tour.createdBy,
                    createdBy: tour.createdBy._id.toString(),
                },
            },
        });
    }
    catch (error) {
        console.error('Update tour error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateTour = updateTour;
// Delete tour
const deleteTour = async (req, res) => {
    try {
        const { id } = req.params;
        const tour = await Tour_1.Tour.findById(id);
        if (!tour) {
            res.status(404).json({ error: 'Tour not found' });
            return;
        }
        await Tour_1.Tour.findByIdAndDelete(id);
        res.json({
            success: true,
            message: 'Tour deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete tour error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteTour = deleteTour;
// Get tour statistics (admin only)
const getTourStats = async (req, res) => {
    try {
        const [totalTours, publishedTours, draftTours, featuredTours] = await Promise.all([
            Tour_1.Tour.countDocuments(),
            Tour_1.Tour.countDocuments({ status: 'PUBLISHED' }),
            Tour_1.Tour.countDocuments({ status: 'DRAFT' }),
            Tour_1.Tour.countDocuments({ featured: true }),
        ]);
        // Get tours by category
        const toursByCategory = await Tour_1.Tour.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        // Get recent tours
        const recentTours = await Tour_1.Tour.find()
            .populate('createdBy', 'name')
            .select('title slug category status featured createdAt')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();
        const transformedRecentTours = recentTours.map(tour => ({
            ...tour,
            id: tour._id.toString(),
            author: tour.createdBy,
        }));
        res.json({
            success: true,
            data: {
                stats: {
                    totalTours,
                    publishedTours,
                    draftTours,
                    featuredTours,
                },
                toursByCategory,
                recentTours: transformedRecentTours,
            },
        });
    }
    catch (error) {
        console.error('Get tour stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getTourStats = getTourStats;
//# sourceMappingURL=tourController.js.map