import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Content } from '../models/Content';
import { AuthenticatedRequest } from '../middleware/auth';

// Validation rules
export const updateContentValidation = [
  body('page').isLength({ min: 1, max: 50 }),
  body('updates').isArray().withMessage('Updates must be an array'),
];

// Get content for a specific page
export const getPageContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page } = req.params;
    const { section } = req.query;

    let content = await Content.findOne({ page }).populate('updatedById', 'id name');

    if (!content) {
      // Return empty content structure if page doesn't exist
      res.json({
        success: true,
        data: { 
          content: [],
          page,
          pageContent: {}
        },
      });
      return;
    }

    // If section is specified, filter to that section only
    if (section && typeof section === 'string') {
      const sectionContent = content.content[section] || {};
      res.json({
        success: true,
        data: { 
          content: [{
            page: content.page,
            section,
            content: sectionContent,
            updatedAt: content.updatedAt,
            updatedBy: content.updatedById
          }],
          pageContent: { [section]: sectionContent }
        },
      });
      return;
    }

    // Transform content to match the expected API format for backward compatibility
    const transformedContent: any[] = [];
    const flattenContent = (obj: any, section: string = '', parentKey: string = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // If it's an object, recurse
          flattenContent(value, section || key, section ? fullKey : '');
        } else {
          // If it's a primitive value or array, add it to transformed content
          transformedContent.push({
            id: `${page}_${section || key}_${fullKey}`,
            page: content.page,
            section: section || key,
            key: section ? fullKey : key,
            type: Array.isArray(value) ? 'json' : typeof value === 'string' ? 'text' : 'json',
            value: typeof value === 'string' ? value : JSON.stringify(value),
            metadata: null,
            updatedAt: content.updatedAt,
            updatedBy: content.updatedById
          });
        }
      }
    };

    flattenContent(content.content);

    res.json({
      success: true,
      data: { 
        content: transformedContent,
        pageContent: content.content 
      },
    });
  } catch (error) {
    console.error('Get page content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all pages with their sections
export const getAllPages = async (req: Request, res: Response): Promise<void> => {
  try {
    const pages = await Content.find({}, 'page content updatedAt').lean();

    const pagesWithSections = pages.map(page => {
      const sections = Object.keys(page.content || {}).map(sectionName => ({
        section: sectionName,
        contentCount: Object.keys(page.content[sectionName] || {}).length,
      }));

      return {
        page: page.page,
        contentCount: sections.reduce((total, section) => total + section.contentCount, 0),
        sections,
        lastUpdated: page.updatedAt,
      };
    });

    res.json({
      success: true,
      data: { pages: pagesWithSections },
    });
  } catch (error) {
    console.error('Get all pages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update content (legacy single update - kept for backward compatibility)
export const updateContent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { page, section, key, type, value, metadata } = req.body;

    // Find or create the page content
    let content = await Content.findOne({ page });
    
    if (!content) {
      content = new Content({
        page,
        content: {},
        updatedById: req.user!.id as any,
      });
    }

    // Update the specific section and key
    if (!content.content[section]) {
      content.content[section] = {};
    }

    // Handle nested keys (e.g., "hero.title")
    const keys = key.split('.');
    let target = content.content[section];
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!target[keys[i]]) {
        target[keys[i]] = {};
      }
      target = target[keys[i]];
    }

    // Set the value (parse JSON if needed)
    let parsedValue = value;
    if (type === 'json') {
      try {
        parsedValue = JSON.parse(value);
      } catch (error) {
        console.warn('Failed to parse JSON value:', value);
      }
    }

    target[keys[keys.length - 1]] = parsedValue;

    // Update metadata
    content.updatedById = req.user!.id as any;
    content.markModified('content');

    await content.save();

    res.json({
      success: true,
      data: { content },
      message: 'Content updated successfully',
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Bulk update content for a page
export const bulkUpdateContent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      res.status(400).json({ error: 'Updates array is required' });
      return;
    }

    // Group updates by page
    const updatesByPage: { [page: string]: any[] } = {};
    
    for (const update of updates) {
      const { page, section, key, type, value } = update;
      if (!page || !section || !key || !type || value === undefined) {
        res.status(400).json({ 
          error: 'Each update must include page, section, key, type, and value' 
        });
        return;
      }

      if (!updatesByPage[page]) {
        updatesByPage[page] = [];
      }
      updatesByPage[page].push(update);
    }

    const results = [];

    // Process each page
    for (const [page, pageUpdates] of Object.entries(updatesByPage)) {
      try {
        // Find or create the page content
        let content = await Content.findOne({ page });
        
        if (!content) {
          content = new Content({
            page,
            content: {},
            updatedById: req.user!.id as any,
          });
        }

        // Apply all updates for this page
        for (const update of pageUpdates) {
          const { section, key, type, value } = update;

          // Ensure section exists
          if (!content.content[section]) {
            content.content[section] = {};
          }

          // Handle nested keys (e.g., "hero.title")
          const keys = key.split('.');
          let target = content.content[section];
          
          for (let i = 0; i < keys.length - 1; i++) {
            if (!target[keys[i]]) {
              target[keys[i]] = {};
            }
            target = target[keys[i]];
          }

          // Set the value (parse JSON if needed)
          let parsedValue = value;
          if (type === 'json') {
            try {
              parsedValue = JSON.parse(value);
            } catch (error) {
              console.warn('Failed to parse JSON value:', value);
            }
          }

          target[keys[keys.length - 1]] = parsedValue;
        }

        // Update metadata
        content.updatedById = req.user!.id as any;
        content.markModified('content');

        await content.save();

        results.push({
          success: true,
          page,
          updatesCount: pageUpdates.length,
          content,
        });

      } catch (error) {
        console.error(`Error updating page ${page}:`, error);
        results.push({
          success: false,
          page,
          error: 'Failed to update page content',
        });
      }
    }

    res.json({
      success: true,
      data: { results },
      message: `Processed ${updates.length} content updates across ${Object.keys(updatesByPage).length} pages`,
    });
  } catch (error) {
    console.error('Bulk update content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete content (delete entire page or section)
export const deleteContent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { section, key } = req.query;

    // Parse the page from ID if it's in the format "page_section_key"
    const parts = id.split('_');
    const page = parts[0];

    const content = await Content.findOne({ page });
    
    if (!content) {
      res.status(404).json({ error: 'Content not found' });
      return;
    }

    if (section && key) {
      // Delete specific key from section
      if (content.content[section as string] && content.content[section as string][key as string]) {
        delete content.content[section as string][key as string];
        content.markModified('content');
        await content.save();
      }
    } else if (section) {
      // Delete entire section
      if (content.content[section as string]) {
        delete content.content[section as string];
        content.markModified('content');
        await content.save();
      }
    } else {
      // Delete entire page
      await Content.deleteOne({ page });
    }

    res.json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get content history (simplified - just return last updated info)
export const getContentHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { page, section, key } = req.query;

    const where: any = {};
    if (page) where.page = page;

    const contents = await Content.find(where)
      .populate('updatedById', 'id name')
      .sort({ updatedAt: -1 })
      .limit(100);

    const history = contents.map(content => ({
      id: (content._id as any),
      page: content.page,
      action: 'UPDATE',
      entityType: 'Content',
      entityId: (content._id as any).toString(),
      timestamp: content.updatedAt,
      userId: (content.updatedById as any)?._id,
      userName: (content.updatedById as any)?.name || 'System',
      newValues: {
        page: content.page,
        sectionsCount: Object.keys(content.content).length,
      },
    }));

    res.json({
      success: true,
      data: { history },
    });
  } catch (error) {
    console.error('Get content history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};