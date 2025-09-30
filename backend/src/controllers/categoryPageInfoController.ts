import { Request, Response } from 'express';
import { CategoryPageInfo, ICategoryPageInfo } from '../models/CategoryPageInfo';
import { AuthenticatedRequest } from '../middleware/auth';

// Get all category page info (Admin)
export const getAllCategoryPageInfo = async (req: Request, res: Response) => {
  try {
    const { status, limit, skip } = req.query;
    
    let filter: any = {};
    if (status) filter.status = status;

    const categoryPageInfos = await CategoryPageInfo.find(filter)
      .populate('createdBy', 'name email')
      .sort({ categorySlug: 1 })
      .limit(limit ? parseInt(limit as string) : 0)
      .skip(skip ? parseInt(skip as string) : 0);

    const total = await CategoryPageInfo.countDocuments(filter);

    res.json({
      success: true,
      data: {
        categoryPageInfos,
        pagination: {
          total,
          pages: limit ? Math.ceil(total / parseInt(limit as string)) : 1,
          currentPage: limit && skip ? Math.floor(parseInt(skip as string) / parseInt(limit as string)) + 1 : 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching category page info:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category page info',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get category page info by slug (Public)
export const getCategoryPageInfoBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const categoryPageInfo = await CategoryPageInfo.findOne({ 
      categorySlug: slug, 
      status: 'ACTIVE' 
    });

    if (!categoryPageInfo) {
      return res.status(404).json({
        success: false,
        message: 'Category page info not found'
      });
    }

    res.json({
      success: true,
      data: { categoryPageInfo }
    });
  } catch (error) {
    console.error('Error fetching category page info:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category page info',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create category page info
export const createCategoryPageInfo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const categoryPageInfoData = {
      ...req.body,
      createdBy: req.user?.id
    };

    // Generate slug from category slug if not provided
    if (!categoryPageInfoData.categorySlug && categoryPageInfoData.title) {
      categoryPageInfoData.categorySlug = categoryPageInfoData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const categoryPageInfo = new CategoryPageInfo(categoryPageInfoData);
    await categoryPageInfo.save();

    await categoryPageInfo.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: { categoryPageInfo },
      message: 'Category page info created successfully'
    });
  } catch (error) {
    console.error('Error creating category page info:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }
    
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category page info with this slug already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating category page info',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update category page info
export const updateCategoryPageInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const categoryPageInfo = await CategoryPageInfo.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!categoryPageInfo) {
      return res.status(404).json({
        success: false,
        message: 'Category page info not found'
      });
    }

    res.json({
      success: true,
      data: { categoryPageInfo },
      message: 'Category page info updated successfully'
    });
  } catch (error) {
    console.error('Error updating category page info:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating category page info',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete category page info
export const deleteCategoryPageInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const categoryPageInfo = await CategoryPageInfo.findByIdAndDelete(id);

    if (!categoryPageInfo) {
      return res.status(404).json({
        success: false,
        message: 'Category page info not found'
      });
    }

    res.json({
      success: true,
      message: 'Category page info deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category page info:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category page info',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get category page info stats
export const getCategoryPageInfoStats = async (req: Request, res: Response) => {
  try {
    const [total, active, inactive] = await Promise.all([
      CategoryPageInfo.countDocuments(),
      CategoryPageInfo.countDocuments({ status: 'ACTIVE' }),
      CategoryPageInfo.countDocuments({ status: 'INACTIVE' })
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          total,
          active,
          inactive
        }
      }
    });
  } catch (error) {
    console.error('Error fetching category page info stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category page info stats',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};