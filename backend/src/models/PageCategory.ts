import mongoose, { Document, Schema } from 'mongoose';

export interface IPageCategory extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  featured: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  displayOrder: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PageCategorySchema = new Schema<IPageCategory>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
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
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  },
  displayOrder: {
    type: Number,
    default: 0
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
PageCategorySchema.index({ name: 'text', description: 'text' });
PageCategorySchema.index({ status: 1, displayOrder: 1 });
PageCategorySchema.index({ slug: 1 });
PageCategorySchema.index({ featured: 1, status: 1 });

export const PageCategory = mongoose.model<IPageCategory>('PageCategory', PageCategorySchema);