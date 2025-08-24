"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure uploads directory exists
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const uploadsPath = path_1.default.join(process.cwd(), uploadDir);
if (!fs_1.default.existsSync(uploadsPath)) {
    fs_1.default.mkdirSync(uploadsPath, { recursive: true });
}
// Create subdirectories
const subdirs = ['images', 'documents', 'temp'];
subdirs.forEach(dir => {
    const dirPath = path_1.default.join(uploadsPath, dir);
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, { recursive: true });
    }
});
// Configure storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Determine subdirectory based on file type
        let subdir = 'documents';
        if (file.mimetype.startsWith('image/')) {
            subdir = 'images';
        }
        const destPath = path_1.default.join(uploadsPath, subdir);
        cb(null, destPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        const name = path_1.default.basename(file.originalname, ext)
            .replace(/[^a-zA-Z0-9]/g, '-')
            .toLowerCase();
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    },
});
// File filter function
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedTypes = [
        // Images
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        // Documents
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
};
// Configure multer
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
        files: 10, // Maximum 10 files per request
    },
});
exports.default = upload;
//# sourceMappingURL=upload.js.map