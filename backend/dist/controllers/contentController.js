"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentHistory = exports.deleteContent = exports.bulkUpdateContent = exports.updateContent = exports.getAllPages = exports.getPageContent = exports.updateContentValidation = void 0;
const express_validator_1 = require("express-validator");
const Content_1 = require("../models/Content");
// Validation rules
exports.updateContentValidation = [
    (0, express_validator_1.body)('page').isLength({ min: 1, max: 50 }),
    (0, express_validator_1.body)('updates').isArray().withMessage('Updates must be an array'),
];
// Get content for a specific page
const getPageContent = async (req, res) => {
    try {
        const { page } = req.params;
        const { section } = req.query;
        let content = await Content_1.Content.findOne({ page }).populate('updatedById', 'id name');
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
        const transformedContent = [];
        const flattenContent = (obj, section = '', parentKey = '') => {
            for (const [key, value] of Object.entries(obj)) {
                const fullKey = parentKey ? `${parentKey}.${key}` : key;
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    // If it's an object, recurse
                    flattenContent(value, section || key, section ? fullKey : '');
                }
                else {
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
    }
    catch (error) {
        console.error('Get page content error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getPageContent = getPageContent;
// Get all pages with their sections
const getAllPages = async (req, res) => {
    try {
        const pages = await Content_1.Content.find({}, 'page content updatedAt').lean();
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
    }
    catch (error) {
        console.error('Get all pages error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllPages = getAllPages;
// Update content (legacy single update - kept for backward compatibility)
const updateContent = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { page, section, key, type, value, metadata } = req.body;
        // Find or create the page content
        let content = await Content_1.Content.findOne({ page });
        if (!content) {
            content = new Content_1.Content({
                page,
                content: {},
                updatedById: req.user.id,
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
            }
            catch (error) {
                console.warn('Failed to parse JSON value:', value);
            }
        }
        target[keys[keys.length - 1]] = parsedValue;
        // Update metadata
        content.updatedById = req.user.id;
        content.markModified('content');
        await content.save();
        res.json({
            success: true,
            data: { content },
            message: 'Content updated successfully',
        });
    }
    catch (error) {
        console.error('Update content error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateContent = updateContent;
// Bulk update content for a page
const bulkUpdateContent = async (req, res) => {
    try {
        const { updates } = req.body;
        if (!Array.isArray(updates) || updates.length === 0) {
            res.status(400).json({ error: 'Updates array is required' });
            return;
        }
        // Group updates by page
        const updatesByPage = {};
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
                let content = await Content_1.Content.findOne({ page });
                if (!content) {
                    content = new Content_1.Content({
                        page,
                        content: {},
                        updatedById: req.user.id,
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
                        }
                        catch (error) {
                            console.warn('Failed to parse JSON value:', value);
                        }
                    }
                    target[keys[keys.length - 1]] = parsedValue;
                }
                // Update metadata
                content.updatedById = req.user.id;
                content.markModified('content');
                await content.save();
                results.push({
                    success: true,
                    page,
                    updatesCount: pageUpdates.length,
                    content,
                });
            }
            catch (error) {
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
    }
    catch (error) {
        console.error('Bulk update content error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.bulkUpdateContent = bulkUpdateContent;
// Delete content (delete entire page or section)
const deleteContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { section, key } = req.query;
        // Parse the page from ID if it's in the format "page_section_key"
        const parts = id.split('_');
        const page = parts[0];
        const content = await Content_1.Content.findOne({ page });
        if (!content) {
            res.status(404).json({ error: 'Content not found' });
            return;
        }
        if (section && key) {
            // Delete specific key from section
            if (content.content[section] && content.content[section][key]) {
                delete content.content[section][key];
                content.markModified('content');
                await content.save();
            }
        }
        else if (section) {
            // Delete entire section
            if (content.content[section]) {
                delete content.content[section];
                content.markModified('content');
                await content.save();
            }
        }
        else {
            // Delete entire page
            await Content_1.Content.deleteOne({ page });
        }
        res.json({
            success: true,
            message: 'Content deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete content error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteContent = deleteContent;
// Get content history (simplified - just return last updated info)
const getContentHistory = async (req, res) => {
    try {
        const { page, section, key } = req.query;
        const where = {};
        if (page)
            where.page = page;
        const contents = await Content_1.Content.find(where)
            .populate('updatedById', 'id name')
            .sort({ updatedAt: -1 })
            .limit(100);
        const history = contents.map(content => ({
            id: content._id,
            page: content.page,
            action: 'UPDATE',
            entityType: 'Content',
            entityId: content._id.toString(),
            timestamp: content.updatedAt,
            userId: content.updatedById?._id,
            userName: content.updatedById?.name || 'System',
            newValues: {
                page: content.page,
                sectionsCount: Object.keys(content.content).length,
            },
        }));
        res.json({
            success: true,
            data: { history },
        });
    }
    catch (error) {
        console.error('Get content history error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getContentHistory = getContentHistory;
//# sourceMappingURL=contentController.js.map