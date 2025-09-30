import mongoose, { Document, Schema } from 'mongoose';

export interface ICategoryPageInfo extends Document {
  categorySlug: string; // nature, culture, cities, etc.
  title: string;
  subtitle?: string;
  description: string;
  heroImage?: string;
  heroText?: string;
  seoTitle?: string;
  seoDescription?: string;
  sections?: Array<{
    title: string;
    content: string;
    image?: string;
    order: number;
  }>;
  features?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  status: 'ACTIVE' | 'INACTIVE';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategoryPageInfoSchema = new Schema<ICategoryPageInfo>({
  categorySlug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  heroImage: {
    type: String,
    trim: true
  },
  heroText: {
    type: String,
    trim: true
  },
  seoTitle: {
    type: String,
    trim: true
  },
  seoDescription: {
    type: String,
    trim: true
  },
  sections: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  features: [{
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
    icon: {
      type: String,
      trim: true
    }
  }],
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create index for better search performance
CategoryPageInfoSchema.index({ categorySlug: 1, status: 1 });
CategoryPageInfoSchema.index({ title: 'text', description: 'text' });

export const CategoryPageInfo = mongoose.model<ICategoryPageInfo>('CategoryPageInfo', CategoryPageInfoSchema);