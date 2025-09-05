import mongoose, { Document, Schema } from 'mongoose';

export interface IMedia extends Document {
  filename: string;
  originalName: string;
  path: string;
  url: string;
  mimeType: string;
  size: number;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  metadata?: Record<string, any>;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>({
  filename: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true,
    trim: true
  },
  path: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  mimeType: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: Number,
    required: true,
    min: 0
  },
  alt: {
    type: String,
    trim: true
  },
  caption: {
    type: String,
    trim: true
  },
  width: {
    type: Number,
    min: 0
  },
  height: {
    type: Number,
    min: 0
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  usageCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

export const Media = mongoose.model<IMedia>('Media', MediaSchema);