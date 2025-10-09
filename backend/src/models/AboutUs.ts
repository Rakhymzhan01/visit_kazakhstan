import mongoose, { Document, Schema } from 'mongoose';

// Interface for About Us content
export interface IAboutUs extends Document {
  // About section
  aboutDescription: string;
  
  // Stats section
  stats: Array<{
    value: string;
    description: string;
    order: number;
  }>;

  // Team members
  teamMembers: Array<{
    name: string;
    position: string;
    image: string;
    order: number;
  }>;
  
  // Team description
  teamDescription: string;

  // Contact information
  contact: {
    address: {
      street: string;
      city: string;
      country: string;
    };
    phone: string;
    email: string;
    mapImage: string;
  };

  // Metadata
  status: 'DRAFT' | 'PUBLISHED';
  version: number;
  authorId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AboutUsSchema = new Schema<IAboutUs>({
  aboutDescription: {
    type: String,
    required: [true, 'About description is required'],
    trim: true,
    maxlength: [1000, 'About description cannot be more than 1000 characters']
  },

  stats: [{
    value: {
      type: String,
      required: [true, 'Stat value is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Stat description is required'],
      trim: true,
      maxlength: [200, 'Stat description cannot be more than 200 characters']
    },
    order: {
      type: Number,
      required: true,
      min: 0
    }
  }],

  teamMembers: [{
    name: {
      type: String,
      required: [true, 'Team member name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    position: {
      type: String,
      required: [true, 'Team member position is required'],
      trim: true,
      maxlength: [150, 'Position cannot be more than 150 characters']
    },
    image: {
      type: String,
      required: [true, 'Team member image is required']
    },
    order: {
      type: Number,
      required: true,
      min: 0
    }
  }],

  teamDescription: {
    type: String,
    required: [true, 'Team description is required'],
    trim: true,
    maxlength: [1000, 'Team description cannot be more than 1000 characters']
  },

  contact: {
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required'],
        trim: true
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true
      }
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    mapImage: {
      type: String,
      required: [true, 'Map image is required']
    }
  },

  status: {
    type: String,
    required: true,
    enum: ['DRAFT', 'PUBLISHED'],
    default: 'DRAFT'
  },

  version: {
    type: Number,
    default: 1
  },

  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  }
}, {
  timestamps: true
});

// Index for better query performance
AboutUsSchema.index({ status: 1, version: -1 });
AboutUsSchema.index({ createdAt: -1 });

export const AboutUs = mongoose.model<IAboutUs>('AboutUs', AboutUsSchema);