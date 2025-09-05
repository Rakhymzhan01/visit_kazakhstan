"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tour = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const TourSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 5
    },
    date: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        min: 0
    },
    duration: {
        type: String,
        trim: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
        default: 'PUBLISHED'
    },
    seoTitle: {
        type: String,
        trim: true
    },
    seoDescription: {
        type: String,
        trim: true
    },
    gallery: [{
            type: String,
            trim: true
        }],
    highlights: [{
            type: String,
            trim: true
        }],
    inclusions: [{
            type: String,
            trim: true
        }],
    exclusions: [{
            type: String,
            trim: true
        }],
    itinerary: [{
            day: {
                type: Number,
                required: true
            },
            title: {
                type: String,
                required: true,
                trim: true
            },
            description: {
                type: String,
                required: true,
                trim: true
            },
            activities: [{
                    type: String,
                    trim: true
                }]
        }],
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
// Create index for better search performance
TourSchema.index({ title: 'text', description: 'text', location: 'text' });
TourSchema.index({ category: 1, status: 1 });
TourSchema.index({ featured: 1, status: 1 });
exports.Tour = mongoose_1.default.model('Tour', TourSchema);
//# sourceMappingURL=Tour.js.map