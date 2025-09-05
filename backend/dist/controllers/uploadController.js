"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMediaStats = exports.deleteMedia = exports.updateMedia = exports.getMedia = exports.uploadMultiple = exports.uploadSingle = void 0;
const Media_1 = require("../models/Media");
const fs_1 = __importDefault(require("fs"));
// Single file upload
const uploadSingle = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        const { alt, caption } = req.body;
        const file = req.file;
        // Create media record
        const media = new Media_1.Media({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            url: `/uploads/${file.filename}`,
            mimeType: file.mimetype,
            size: file.size,
            alt: alt || null,
            caption: caption || null,
            usageCount: 0,
        });
        await media.save();
        res.status(201).json({
            success: true,
            data: {
                media: {
                    ...media.toObject(),
                    id: media._id.toString(),
                }
            },
        });
    }
    catch (error) {
        console.error('Upload single error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.uploadSingle = uploadSingle;
// Multiple file upload
const uploadMultiple = async (req, res) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            res.status(400).json({ error: 'No files uploaded' });
            return;
        }
        const files = req.files;
        const mediaRecords = [];
        for (const file of files) {
            const media = new Media_1.Media({
                filename: file.filename,
                originalName: file.originalname,
                path: file.path,
                url: `/uploads/${file.filename}`,
                mimeType: file.mimetype,
                size: file.size,
                usageCount: 0,
            });
            await media.save();
            mediaRecords.push({
                ...media.toObject(),
                id: media._id.toString(),
            });
        }
        res.status(201).json({
            success: true,
            data: { media: mediaRecords },
        });
    }
    catch (error) {
        console.error('Upload multiple error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.uploadMultiple = uploadMultiple;
// Get media files
const getMedia = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const type = req.query.type;
        const search = req.query.search;
        // Build filter
        const filter = {};
        if (type) {
            filter.mimeType = { $regex: type, $options: 'i' };
        }
        if (search) {
            filter.$or = [
                { originalName: { $regex: search, $options: 'i' } },
                { alt: { $regex: search, $options: 'i' } },
                { caption: { $regex: search, $options: 'i' } },
            ];
        }
        // Get media files
        const [media, total] = await Promise.all([
            Media_1.Media.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Media_1.Media.countDocuments(filter),
        ]);
        const transformedMedia = media.map(item => ({
            ...item,
            id: item._id.toString(),
        }));
        res.json({
            success: true,
            data: {
                media: transformedMedia,
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
        console.error('Get media error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getMedia = getMedia;
// Update media metadata
const updateMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const { alt, caption } = req.body;
        const media = await Media_1.Media.findById(id);
        if (!media) {
            res.status(404).json({ error: 'Media not found' });
            return;
        }
        if (alt !== undefined)
            media.alt = alt;
        if (caption !== undefined)
            media.caption = caption;
        await media.save();
        res.json({
            success: true,
            data: {
                media: {
                    ...media.toObject(),
                    id: media._id.toString(),
                }
            },
        });
    }
    catch (error) {
        console.error('Update media error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateMedia = updateMedia;
// Delete media
const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const media = await Media_1.Media.findById(id);
        if (!media) {
            res.status(404).json({ error: 'Media not found' });
            return;
        }
        // Delete file from filesystem
        try {
            if (fs_1.default.existsSync(media.path)) {
                fs_1.default.unlinkSync(media.path);
            }
        }
        catch (error) {
            console.error('Error deleting file:', error);
        }
        await Media_1.Media.findByIdAndDelete(id);
        res.json({
            success: true,
            message: 'Media deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete media error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteMedia = deleteMedia;
// Get media statistics
const getMediaStats = async (req, res) => {
    try {
        const [totalFiles, totalSize, imageCount, documentCount] = await Promise.all([
            Media_1.Media.countDocuments(),
            Media_1.Media.aggregate([{ $group: { _id: null, totalSize: { $sum: '$size' } } }]),
            Media_1.Media.countDocuments({ mimeType: { $regex: '^image/', $options: 'i' } }),
            Media_1.Media.countDocuments({ mimeType: { $regex: '^application/', $options: 'i' } }),
        ]);
        const recentFiles = await Media_1.Media.find()
            .select('filename originalName mimeType size createdAt')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();
        const transformedRecentFiles = recentFiles.map(file => ({
            ...file,
            id: file._id.toString(),
        }));
        res.json({
            success: true,
            data: {
                stats: {
                    totalFiles,
                    totalSize: totalSize[0]?.totalSize || 0,
                    imageCount,
                    documentCount,
                    otherCount: totalFiles - imageCount - documentCount,
                },
                recentFiles: transformedRecentFiles,
            },
        });
    }
    catch (error) {
        console.error('Get media stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getMediaStats = getMediaStats;
//# sourceMappingURL=uploadController.js.map