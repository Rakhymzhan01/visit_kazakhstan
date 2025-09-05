import mongoose, { Document } from 'mongoose';
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
export declare const Tour: mongoose.Model<ITour, {}, {}, {}, mongoose.Document<unknown, {}, ITour, {}, {}> & ITour & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Tour.d.ts.map