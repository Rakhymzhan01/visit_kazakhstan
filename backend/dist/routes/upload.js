"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadController_1 = require("../controllers/uploadController");
const auth_1 = require("../middleware/auth");
const upload_1 = __importDefault(require("../middleware/upload"));
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticateToken);
router.use(auth_1.requireAdmin);
// Upload routes
router.post('/single', upload_1.default.single('file'), uploadController_1.uploadSingle);
router.post('/multiple', upload_1.default.array('files', 10), uploadController_1.uploadMultiple);
// Media management routes
router.get('/media/stats', uploadController_1.getMediaStats);
router.get('/media', uploadController_1.getMedia);
router.put('/media/:id', uploadController_1.updateMedia);
router.delete('/media/:id', uploadController_1.deleteMedia);
exports.default = router;
//# sourceMappingURL=upload.js.map