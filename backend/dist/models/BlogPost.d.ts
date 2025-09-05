import mongoose, { Document } from 'mongoose';
export interface IBlogPost extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featured: boolean;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    publishedAt?: Date;
    seoTitle?: string;
    seoDescription?: string;
    featuredImage?: string;
    images: string[];
    readTime?: number;
    views: number;
    tags: string[];
    category?: string;
    authorId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const BlogPost: mongoose.Model<IBlogPost, {}, {}, {}, mongoose.Document<unknown, {}, IBlogPost, {}, {}> & IBlogPost & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=BlogPost.d.ts.map