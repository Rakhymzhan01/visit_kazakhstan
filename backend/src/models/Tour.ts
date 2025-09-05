import mongoose, { Document, Schema } from 'mongoose';

export interface ITour extends Document {
  title: string;
  slug: string;
  description?: string;
  image: string;
  category: string;
  rating: number;
  date?: string;
  location?: string;
  price?: number;
  duration?: string;
  featured: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  seoTitle?: string;
  seoDescription?: string;
  gallery?: string[];
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: Array<{
    day: number;
    title: string;
    description: string;
    activities: string[];
  }>;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TourSchema = new Schema<ITour>({
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
    type: Schema.Types.ObjectId,
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

export const Tour = mongoose.model<ITour>('Tour', TourSchema);