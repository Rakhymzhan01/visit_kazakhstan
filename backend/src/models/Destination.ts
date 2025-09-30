import mongoose, { Document, Schema } from 'mongoose';

export interface IDestination extends Document {
  name: string;
  slug: string;
  subtitle?: string;
  description: string;
  content: string;
  image: string;
  gallery?: string[]; // Additional images
  category: 'nature' | 'culture' | 'cities';
  subcategory?: string; // For culture: 'now' or 'then'
  location: string;
  highlights: string[];
  featured: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  displayOrder: number;
  
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  
  // Practical information
  price?: string;
  rating?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  // Additional content sections
  activities?: string[];
  facilities?: string[];
  tips?: string[];
  
  // Nature-specific fields
  bestTime?: string;
  duration?: string;
  difficulty?: string;
  
  // Culture-specific fields
  era?: string;
  type?: string;
  
  // Cities-specific fields
  region?: string;
  population?: string;
  founded?: string;
  
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DestinationSchema = new Schema<IDestination>({
  name: {
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
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  gallery: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['nature', 'culture', 'cities']
  },
  subcategory: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  highlights: [{
    type: String,
    trim: true
  }],
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
  
  // SEO fields
  seoTitle: {
    type: String,
    trim: true
  },
  seoDescription: {
    type: String,
    trim: true
  },
  
  // Practical information
  price: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  coordinates: {
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  },
  
  // Additional content sections
  activities: [{
    type: String,
    trim: true
  }],
  facilities: [{
    type: String,
    trim: true
  }],
  tips: [{
    type: String,
    trim: true
  }],
  
  // Nature-specific fields
  bestTime: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    trim: true
  },
  
  // Culture-specific fields
  era: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    trim: true
  },
  
  // Cities-specific fields
  region: {
    type: String,
    trim: true
  },
  population: {
    type: String,
    trim: true
  },
  founded: {
    type: String,
    trim: true
  },
  
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for better search performance
DestinationSchema.index({ name: 'text', description: 'text', content: 'text' });
DestinationSchema.index({ category: 1, subcategory: 1, status: 1, displayOrder: 1 });
DestinationSchema.index({ slug: 1 });
DestinationSchema.index({ featured: 1, status: 1 });

export const Destination = mongoose.model<IDestination>('Destination', DestinationSchema);