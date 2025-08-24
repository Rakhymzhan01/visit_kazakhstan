import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Helper to get image dimensions
const getImageDimensions = async (filePath: string): Promise<{ width: number; height: number } | null> => {
  try {
    const metadata = await sharp(filePath).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
    };
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    return null;
  }
};

// Upload single file
export const uploadFile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    const file = req.file;
    const { alt, caption } = req.body;

    // Generate URL
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const relativePath = file.path.replace(process.cwd(), '').replace(/\\/g, '/');
    const url = `${baseUrl}${relativePath}`;

    // Get image dimensions if it's an image
    let dimensions = null;
    if (file.mimetype.startsWith('image/')) {
      dimensions = await getImageDimensions(file.path);
    }

    // Save to database
    const media = await prisma.media.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        url,
        mimeType: file.mimetype,
        size: file.size,
        alt: alt || file.originalname,
        caption,
        width: dimensions?.width,
        height: dimensions?.height,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPLOAD',
        entityType: 'Media',
        entityId: media.id,
        newValues: {
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
        },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
      },
    });

    res.status(201).json({
      success: true,
      data: { media },
    });
  } catch (error) {
    console.error('Upload file error:', error);
    
    // Clean up uploaded file if database save failed
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up uploaded file:', unlinkError);
      }
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

// Upload multiple files
export const uploadFiles = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No files provided' });
      return;
    }

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const mediaItems = [];

    for (const file of files) {
      try {
        // Generate URL
        const relativePath = file.path.replace(process.cwd(), '').replace(/\\/g, '/');
        const url = `${baseUrl}${relativePath}`;

        // Get image dimensions if it's an image
        let dimensions = null;
        if (file.mimetype.startsWith('image/')) {
          dimensions = await getImageDimensions(file.path);
        }

        // Save to database
        const media = await prisma.media.create({
          data: {
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            url,
            mimeType: file.mimetype,
            size: file.size,
            alt: file.originalname,
            width: dimensions?.width,
            height: dimensions?.height,
          },
        });

        mediaItems.push(media);

        // Create audit log
        await prisma.auditLog.create({
          data: {
            userId: req.user!.id,
            action: 'UPLOAD',
            entityType: 'Media',
            entityId: media.id,
            newValues: {
              filename: file.filename,
              originalName: file.originalname,
              mimeType: file.mimetype,
              size: file.size,
            },
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
          },
        });
      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        
        // Clean up this file
        if (fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
          } catch (unlinkError) {
            console.error('Error cleaning up uploaded file:', unlinkError);
          }
        }
      }
    }

    res.status(201).json({
      success: true,
      data: { media: mediaItems },
      message: `Successfully uploaded ${mediaItems.length} out of ${files.length} files`,
    });
  } catch (error) {
    console.error('Upload files error:', error);

    // Clean up all uploaded files
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      files.forEach(file => {
        if (fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
          } catch (unlinkError) {
            console.error('Error cleaning up uploaded file:', unlinkError);
          }
        }
      });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get media files with pagination
export const getMedia = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const mimeType = req.query.type as string;
    const search = req.query.search as string;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (mimeType) {
      where.mimeType = { startsWith: mimeType };
    }

    if (search) {
      where.OR = [
        { originalName: { contains: search, mode: 'insensitive' } },
        { alt: { contains: search, mode: 'insensitive' } },
        { caption: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get media files
    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.media.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        media,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
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

    // Check if media exists
    const existingMedia = await prisma.media.findUnique({
      where: { id },
    });

    if (!existingMedia) {
      res.status(404).json({ error: 'Media not found' });
      return;
    }

    // Update media
    const updatedMedia = await prisma.media.update({
      where: { id },
      data: {
        alt: alt !== undefined ? alt : existingMedia.alt,
        caption: caption !== undefined ? caption : existingMedia.caption,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE',
        entityType: 'Media',
        entityId: id,
        oldValues: {
          alt: existingMedia.alt,
          caption: existingMedia.caption,
        },
        newValues: { alt, caption },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
      },
    });

    res.json({
      success: true,
      data: { media: updatedMedia },
    });
  } catch (error) {
    console.error('Update media error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete media file
export const deleteMedia = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if media exists
    const existingMedia = await prisma.media.findUnique({
      where: { id },
    });

    if (!existingMedia) {
      res.status(404).json({ error: 'Media not found' });
      return;
    }

    // Delete file from filesystem
    if (fs.existsSync(existingMedia.path)) {
      try {
        fs.unlinkSync(existingMedia.path);
      } catch (error) {
        console.error('Error deleting file from filesystem:', error);
      }
    }

    // Delete from database
    await prisma.media.delete({
      where: { id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'DELETE',
        entityType: 'Media',
        entityId: id,
        oldValues: {
          filename: existingMedia.filename,
          originalName: existingMedia.originalName,
          path: existingMedia.path,
        },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
      },
    });

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
    const [
      totalFiles,
      totalSize,
      imageCount,
      documentCount,
      recentUploads,
    ] = await Promise.all([
      prisma.media.count(),
      prisma.media.aggregate({
        _sum: { size: true },
      }),
      prisma.media.count({
        where: { mimeType: { startsWith: 'image/' } },
      }),
      prisma.media.count({
        where: { mimeType: { not: { startsWith: 'image/' } } },
      }),
      prisma.media.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          filename: true,
          originalName: true,
          mimeType: true,
          size: true,
          url: true,
          createdAt: true,
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalFiles,
        totalSize: totalSize._sum.size || 0,
        imageCount,
        documentCount,
        recentUploads,
      },
    });
  } catch (error) {
    console.error('Get media stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};