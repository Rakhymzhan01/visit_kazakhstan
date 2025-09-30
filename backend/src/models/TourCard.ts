import mongoose, { Document, Schema } from 'mongoose';

export interface ITourCard extends Document {
  title: string;
  slug: string;
  description?: string;
  image: string;
  category: string; // Will reference main categories like "nature", "culture", "cities"
  price?: string;
  duration?: string;
  rating?: number;
  highlights?: string[];
  link?: string; // Link to detailed page or booking
  featured: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  displayOrder: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TourCardSchema = new Schema<ITourCard>({
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
  price: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  highlights: [{
    type: String,
    trim: true
  }],
  link: {
    type: String,
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
TourCardSchema.index({ title: 'text', description: 'text' });
TourCardSchema.index({ category: 1, status: 1 });
TourCardSchema.index({ featured: 1, status: 1 });
TourCardSchema.index({ displayOrder: 1 });

export const TourCard = mongoose.model<ITourCard>('TourCard', TourCardSchema);