import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

export interface IEvent extends Document {
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  image: string;
  category: string;
  date: Date;
  time?: string;
  location?: string;
  featured: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  price?: string;
  duration?: string;
  organizer?: string;
  website?: string;
  tags: string[];
  authorId: mongoose.Types.ObjectId;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  image: {
    type: String,
    required: [true, 'Event image is required']
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: ['Music', 'Culture', 'Sports', 'Conference', 'Workshop', 'Festival', 'Adventure', 'Business', 'Exhibition', 'Other']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot be more than 200 characters']
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
  price: {
    type: String,
    trim: true,
    maxlength: [100, 'Price cannot be more than 100 characters']
  },
  duration: {
    type: String,
    trim: true,
    maxlength: [100, 'Duration cannot be more than 100 characters']
  },
  organizer: {
    type: String,
    trim: true,
    maxlength: [200, 'Organizer cannot be more than 200 characters']
  },
  website: {
    type: String,
    trim: true,
    maxlength: [500, 'Website URL cannot be more than 500 characters']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from title before saving
EventSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Virtual for author population
EventSchema.virtual('author', {
  ref: 'User',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true
});

// Index for better query performance
EventSchema.index({ status: 1, featured: 1, date: 1 });
EventSchema.index({ category: 1, status: 1 });
EventSchema.index({ tags: 1, status: 1 });
EventSchema.index({ date: 1, status: 1 });

export const Event = mongoose.model<IEvent>('Event', EventSchema);