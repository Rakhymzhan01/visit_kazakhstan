import mongoose, { Document, Schema } from 'mongoose';

export interface IContent extends Document {
  page: string;
  content: Record<string, any>;
  updatedById: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>({
  page: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  content: {
    type: Schema.Types.Mixed,
    required: true,
    default: {}
  },
  updatedById: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export const Content = mongoose.model<IContent>('Content', ContentSchema);