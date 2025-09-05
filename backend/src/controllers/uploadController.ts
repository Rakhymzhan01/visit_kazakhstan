import { Response } from 'express';
import { Media } from '../models/Media';
import { AuthenticatedRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

// Single file upload
export const uploadSingle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { alt, caption } = req.body;
    const file = req.file;

    // Create media record
    const media = new Media({
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
          id: (media._id as any).toString(),
        }
      },
    });
  } catch (error) {
    console.error('Upload single error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Multiple file upload
export const uploadMultiple = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ error: 'No files uploaded' });
      return;
    }

    const files = req.files as Express.Multer.File[];
    const mediaRecords = [];

    for (const file of files) {
      const media = new Media({
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
        id: (media._id as any).toString(),
      });
    }

    res.status(201).json({
      success: true,
      data: { media: mediaRecords },
    });
  } catch (error) {
    console.error('Upload multiple error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get media files
export const getMedia = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type as string;
    const search = req.query.search as string;

    // Build filter
    const filter: any = {};
    
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
      Media.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Media.countDocuments(filter),
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
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update media metadata
export const updateMedia = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { alt, caption } = req.body;

    const media = await Media.findById(id);
    
    if (!media) {
      res.status(404).json({ error: 'Media not found' });
      return;
    }

    if (alt !== undefined) media.alt = alt;
    if (caption !== undefined) media.caption = caption;

    await media.save();

    res.json({
      success: true,
      data: { 
        media: {
          ...media.toObject(),
          id: (media._id as any).toString(),
        }
      },
    });
  } catch (error) {
    console.error('Update media error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete media
export const deleteMedia = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const media = await Media.findById(id);
    
    if (!media) {
      res.status(404).json({ error: 'Media not found' });
      return;
    }

    // Delete file from filesystem
    try {
      if (fs.existsSync(media.path)) {
        fs.unlinkSync(media.path);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    await Media.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get media statistics
export const getMediaStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const [totalFiles, totalSize, imageCount, documentCount] = await Promise.all([
      Media.countDocuments(),
      Media.aggregate([{ $group: { _id: null, totalSize: { $sum: '$size' } } }]),
      Media.countDocuments({ mimeType: { $regex: '^image/', $options: 'i' } }),
      Media.countDocuments({ mimeType: { $regex: '^application/', $options: 'i' } }),
    ]);

    const recentFiles = await Media.find()
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
  } catch (error) {
    console.error('Get media stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};