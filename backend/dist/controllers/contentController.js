"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentHistory = exports.deleteContent = exports.bulkUpdateContent = exports.updateContent = exports.getAllPages = exports.getPageContent = exports.updateContentValidation = void 0;
const express_validator_1 = require("express-validator");
const database_1 = require("../config/database");
// Validation rules
exports.updateContentValidation = [
    (0, express_validator_1.body)('page').isLength({ min: 1, max: 50 }),
    (0, express_validator_1.body)('section').isLength({ min: 1, max: 50 }),
    (0, express_validator_1.body)('key').isLength({ min: 1, max: 50 }),
    (0, express_validator_1.body)('type').isIn(['text', 'image', 'rich_text', 'json']),
    (0, express_validator_1.body)('value').isLength({ min: 0 }),
    (0, express_validator_1.body)('metadata').optional().isObject(),
];
// Get content for a specific page
const getPageContent = async (req, res) => {
    try {
        const { page } = req.params;
        const { section } = req.query;
        const where = { page };
        if (section) {
            where.section = section;
        }
        const content = await database_1.prisma.content.findMany({
            where,
            orderBy: [
                { section: 'asc' },
                { key: 'asc' },
            ],
            select: {
                id: true,
                page: true,
                section: true,
                key: true,
                type: true,
                value: true,
                metadata: true,
                updatedAt: true,
                updatedBy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        res.json({
            success: true,
            data: { content },
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
        const pages = await database_1.prisma.content.groupBy({
            by: ['page'],
            _count: {
                id: true,
            },
            orderBy: {
                page: 'asc',
            },
        });
        const pagesWithSections = await Promise.all(pages.map(async (page) => {
            const sections = await database_1.prisma.content.groupBy({
                by: ['section'],
                where: { page: page.page },
                _count: {
                    id: true,
                },
                orderBy: {
                    section: 'asc',
                },
            });
            return {
                page: page.page,
                contentCount: page._count.id,
                sections: sections.map(section => ({
                    section: section.section,
                    contentCount: section._count.id,
                })),
            };
        }));
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
// Update or create content
const updateContent = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { page, section, key, type, value, metadata } = req.body;
        // Check if content already exists
        const existingContent = await database_1.prisma.content.findUnique({
            where: {
                page_section_key: {
                    page,
                    section,
                    key,
                },
            },
        });
        let content;
        let action = 'UPDATE';
        if (existingContent) {
            // Update existing content
            content = await database_1.prisma.content.update({
                where: {
                    page_section_key: {
                        page,
                        section,
                        key,
                    },
                },
                data: {
                    type,
                    value,
                    metadata,
                    updatedById: req.user.id,
                },
                include: {
                    updatedBy: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
        }
        else {
            // Create new content
            action = 'CREATE';
            content = await database_1.prisma.content.create({
                data: {
                    page,
                    section,
                    key,
                    type,
                    value,
                    metadata,
                    updatedById: req.user.id,
                },
                include: {
                    updatedBy: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
        }
        // Create audit log
        await database_1.prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action,
                entityType: 'Content',
                entityId: content.id,
                oldValues: existingContent ? {
                    type: existingContent.type,
                    value: existingContent.value,
                } : undefined,
                newValues: {
                    type,
                    value: value.length > 500 ? `${value.substring(0, 500)}...` : value,
                },
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.get('User-Agent'),
            },
        });
        res.json({
            success: true,
            data: { content },
            message: `Content ${action.toLowerCase()}d successfully`,
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
        // Validate each update
        for (const update of updates) {
            const { page, section, key, type, value } = update;
            if (!page || !section || !key || !type || value === undefined) {
                res.status(400).json({
                    error: 'Each update must include page, section, key, type, and value'
                });
                return;
            }
        }
        const results = [];
        // Process each update
        for (const update of updates) {
            const { page, section, key, type, value, metadata } = update;
            try {
                const content = await database_1.prisma.content.upsert({
                    where: {
                        page_section_key: {
                            page,
                            section,
                            key,
                        },
                    },
                    update: {
                        type,
                        value,
                        metadata,
                        updatedById: req.user.id,
                    },
                    create: {
                        page,
                        section,
                        key,
                        type,
                        value,
                        metadata,
                        updatedById: req.user.id,
                    },
                    include: {
                        updatedBy: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                });
                results.push({
                    success: true,
                    content,
                });
                // Create audit log
                await database_1.prisma.auditLog.create({
                    data: {
                        userId: req.user.id,
                        action: 'BULK_UPDATE',
                        entityType: 'Content',
                        entityId: content.id,
                        newValues: {
                            page,
                            section,
                            key,
                            type,
                            value: value.length > 500 ? `${value.substring(0, 500)}...` : value,
                        },
                        ipAddress: req.ip || req.connection.remoteAddress,
                        userAgent: req.get('User-Agent'),
                    },
                });
            }
            catch (error) {
                console.error(`Error updating content ${page}/${section}/${key}:`, error);
                results.push({
                    success: false,
                    error: 'Failed to update content',
                    content: { page, section, key },
                });
            }
        }
        res.json({
            success: true,
            data: { results },
            message: `Processed ${updates.length} content updates`,
        });
    }
    catch (error) {
        console.error('Bulk update content error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.bulkUpdateContent = bulkUpdateContent;
// Delete content
const deleteContent = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if content exists
        const existingContent = await database_1.prisma.content.findUnique({
            where: { id },
        });
        if (!existingContent) {
            res.status(404).json({ error: 'Content not found' });
            return;
        }
        // Delete content
        await database_1.prisma.content.delete({
            where: { id },
        });
        // Create audit log
        await database_1.prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'DELETE',
                entityType: 'Content',
                entityId: id,
                oldValues: {
                    page: existingContent.page,
                    section: existingContent.section,
                    key: existingContent.key,
                    type: existingContent.type,
                },
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.get('User-Agent'),
            },
        });
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
// Get content history/audit logs
const getContentHistory = async (req, res) => {
    try {
        const { page, section, key } = req.query;
        const where = {
            entityType: 'Content',
        };
        if (page || section || key) {
            // If we have specific page/section/key, we need to find the content first
            const contentWhere = {};
            if (page)
                contentWhere.page = page;
            if (section)
                contentWhere.section = section;
            if (key)
                contentWhere.key = key;
            const contentItems = await database_1.prisma.content.findMany({
                where: contentWhere,
                select: { id: true },
            });
            where.entityId = {
                in: contentItems.map(item => item.id),
            };
        }
        const history = await database_1.prisma.auditLog.findMany({
            where,
            orderBy: { timestamp: 'desc' },
            take: 100, // Limit to last 100 entries
            select: {
                id: true,
                action: true,
                entityId: true,
                oldValues: true,
                newValues: true,
                timestamp: true,
                userId: true,
            },
        });
        // Get user details for the history
        const userIds = [...new Set(history.map(h => h.userId).filter(Boolean))];
        const users = await database_1.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true },
        });
        const usersMap = new Map(users.map(u => [u.id, u.name]));
        const historyWithUsers = history.map(h => ({
            ...h,
            userName: h.userId ? usersMap.get(h.userId) : 'System',
        }));
        res.json({
            success: true,
            data: { history: historyWithUsers },
        });
    }
    catch (error) {
        console.error('Get content history error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getContentHistory = getContentHistory;
//# sourceMappingURL=contentController.js.map